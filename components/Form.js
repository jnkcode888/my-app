import { StyleSheet,SafeAreaView,TextInput, Text, View,Pressable,ActivityIndicator} from 'react-native'
import React,{useEffect,useState} from 'react'
import { Feather } from '@expo/vector-icons'
import {api} from './Axios'
import { useAuth } from './AuthProvider'
import CustomAlert from './customAlert';
import AsyncStorage from '@react-native-async-storage/async-storage'

const Form = (props) => {
    const [focused,setFocused]=useState(false)
    const [form,setForm]=useState('Login')
    const {Logout,Login,setUserInfo}=useAuth()
    const [isLoading,setLoading]=useState(false)
    let [formData,setFormData]=useState(
      {'username':'','email':'','password':'','uuid':''}
    )

    const [isAlert,setAlert]=useState(false)
   const [alertData,setAlertData]=useState({
    title:'',
    message:''
   })

   useEffect(()=>{
    const timer= setInterval(() => {
      if(isAlert){

        setAlert(false)
      }
     }, 4000);
     return () => clearInterval(timer);
   },[isAlert])

   

    const validateForm = () => {
      if (form === 'signUp') {
          return formData.email !== '' && formData.username !== '' && formData.password !== ''&& formData.uuid;
      }
      return formData.username !== '' && formData.password !== '';
  };
     
    
    const handleSubmit=async()=>{
      if (!validateForm()) {
        setAlert(true)
        setAlertData({
          title:'Error',
          message:'Please fill all fields'
        })
        return; 
    }

    setLoading(true)
    if(form==='Login'){
        try{
        const res= await api.post('api/token/',{username:formData.username,password:formData.password})
        console.log(res)
        await AsyncStorage.setItem('refresh',res.refresh)
        await AsyncStorage.setItem('access',res.access)
        setUserInfo(prev=>({...prev,['username']:formData.username}))
        Login()
        setLoading(false)
        }catch(error){
          if(!error.response){
            setAlert(true)
            setAlertData({
              title:'Error',
              message:'Network Error, Please check your internet connection'
            })
          }else{
            setAlert(true)
            setAlertData({
              title:'Error',
              message:'Incorrect Credentials'
            })
          }
          await Logout()
          console.log(error)
          setLoading(false)
        }
        
      }else{
        try{
          console.log(' bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb')
          setAlert(true)
            setAlertData({
              title:'Error',
              message:'im in'
            })
        const res= await api.post('register/',{username:formData.username,password:formData.password,email:formData.email,uuid:formData.uuid})
        console.log(res)
        await AsyncStorage.setItem('refresh',res.refresh)
        await AsyncStorage.setItem('access',res.access)
        Login()
        setLoading(false)
        }catch(error){
          console.log('my errrorr',error)
          if(!error.response){
            setAlert(true)
            setAlertData({
              title:'Error',
              message:'Network Error, Please check your internet connection'
            })
          }else if(error.status===403){
            setAlert(true)
            setAlertData({
              title:'Error',
              message:error.response.data['error']
            })
          }else if(error.status===404){
            setAlert(true)
            setAlertData({
              title:'Error',
              message:error.response.data['error']
            })
          }else{
            setAlert(true)
            setAlertData({
              title:'Error',
              message:'Server Error ,please try again later'
            })
          }



          await Logout()
          console.log(error)
          setLoading(false)
        }

      }

        
    }
    const handleChange=(text,field)=>{
        setFormData({...formData,[field]:text})
    }
  
    const changeForm=()=>{
      setForm(form=='Login'?'signUp':'Login')
      setFormData({'username':'','email':'','password':'','uuid':''}
      )
    }

  return (
    <SafeAreaView style={styles.container}>
      {isAlert&&
      <CustomAlert title={alertData.title} message={alertData.message} handlePress={setAlert}/>
}

        <View style={styles.form}>
        <Text style={styles.Title}><Feather name='user' size={25}/>{form=='Login'?'Login':'Sign-Up'}</Text>
        {form==='signUp'&&
        <>
        <TextInput
        placeholder='Enter Email'
        style={styles.input}
        autoCapitalize='none'
        value={formData.email}
        autoCorrect={false}
        onChangeText={(text)=>handleChange(text,'email')}
        

        

        />
        <TextInput
        placeholder='Enter Gadget Id'
        style={styles.input}
        autoCapitalize='none'
        value={formData.uuid}
        autoCorrect={false}
        onChangeText={(text)=>handleChange(text,'uuid')}
        
        

        

        />
        </>
        }
        <TextInput
        placeholder='Enter Username'
        style={styles.input}
        autoCapitalize='none'
        autoCorrect={false}
        value={formData.username}
        onChangeText={(text)=>handleChange(text,'username')}



        />
         <TextInput
        placeholder='Enter Password'
        style={[styles.input,focused&&styles.inputFocused]}
        onFocus={()=>setFocused(true)}
        onBlur={()=>setFocused(false)}
        secureTextEntry={true}
        autoCapitalize='none'
        autoCorrect={false}
        value={formData.password}
        onChangeText={(text)=>handleChange(text,'password')}

        />
        {isLoading ? <ActivityIndicator size="large" color="white" />:
        <View style={[{display:'flex',flexDirection:'row',height:'3rem',justifyContent:'space-around'}]}>
        <Pressable style={[{width:'5rem',alignSelf:'center',height:'100%'}]} onPress={handleSubmit}>
            <Text style={styles.button}>Submit</Text>
        </Pressable>
        <Pressable  onPress={changeForm}>
        <Text style={styles.signUp}>{form=='signUp'?'Login':'Sign-Up'} <Feather color={'blue'}   name={form==='signUp'?'log-in':'user-plus'} size={24}/></Text>
        </Pressable>
        </View>
}
      </View>
    </SafeAreaView>
  )
}

export default Form

const styles = StyleSheet.create({
    container:{
      flex:1,
      alignItems:'center',
      justifyContent:'center',
    },
    Title:{
     color:'white',
     alignSelf:'center',
     fontSize:25
    },
    form:{
      paddingHorizontal:40,
      paddingBottom:25,
      paddingTop:10,
      flexDirection:'column',
      gap:20,
      borderRadius: 5,
      width: '80%',
      alignSelf: 'center',
      maxWidth:'35rem',
      backgroundColor:'rgba(22, 160, 133,0.5)',
     
    },
    input:{
      fontWeight:'bold',
      fontSize:15,
        height: 35,
        borderColor: 'gray',
        width:'90%',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 5,
        alignSelf:'center',
        backgroundColor:'white'
      },
      inputFocused:{
        borderColor:'transparent',
        borderWidth:0,
        // borderColor:'blue',
        // backgroundColor:'green',
        
        
        
      },
      signUp:{
        alignSelf:'center',
        color:'black',
        fontSize:15,
        fontWeight:'bold',
        backgroundColor:'white',
        borderRadius:5,
        padding:5,
        height:'100%'


        
      },
      button:{
        color:'blue',
        alignSelf:'center',
        backgroundColor:'white',
        textAlign:'center',
        padding:3,
        borderRadius:0,
        fontWeight:'bold',
        paddingTop:13,
        height:'100%',
        borderRadius:5,
        width:'100%',
        fontSize:15



      }
      
    }
  
  )