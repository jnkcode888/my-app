import { StyleSheet,SafeAreaView} from 'react-native'
import React,{useState,useEffect} from 'react'
import MessageInput from '../components/MessageInput'
import Navbar from '../components/Navbar'
import Settings from '../components/Settings'
import CustomAlert from '../components/customAlert'

const AgriBot = ({overlay,setOverlay}) => {
    

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

   return (
    <SafeAreaView style={styles.main}>
        <Settings overlay={overlay} setOverlay={setOverlay}/>

        <Navbar setOverlay={setOverlay}/>

        {isAlert&&
      <CustomAlert title={alertData.title} message={alertData.message} handlePress={setAlert} />
}  
      <MessageInput setAlertData={setAlertData} setAlert={setAlert}/>
    </SafeAreaView>
  )
}

export default AgriBot

const styles = StyleSheet.create({
    main:{
        flex:1,
        
    }
})