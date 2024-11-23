import { StyleSheet,SafeAreaView} from 'react-native'
import React,{useState,useEffect} from 'react'
import RealTimeDisplay from '../components/RealTime'
import Graph from '../components/Graph'
import Settings from '../components/Settings'
import Navbar from '../components/Navbar'
import CustomAlert from '../components/customAlert'
import {api} from '../components/Axios'
import { useAuth } from '@/components/AuthProvider'
const Home = ({overlay,setOverlay}) => {
    const {setSavedLocation}=useAuth()
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

   
   useEffect(() => {
     async function defaultStart() {  
      try{
      const res = await api.get('locationData/');
      console.log('goten',res)
      const data=res['message']
      const data1={
        Country:'Kenya',
        County:'Machakos',
        Sub_county:'kangudo'
      }
      console.log(data1,'data1')
      setSavedLocation(data1)

      }catch(error){
        if(!error.response){
        setAlert(true)
        setAlertData(
            {
                title:'Error',
                message:'Network Error, Check your Internet connection'
            }
        )
      }else if(error.response.status===404){
        setAlert(true)
        setAlertData(
            {
                title:'Message',
                message:'Set location to acces your climate trend'
            }
        )
      }else{
        setAlert(true)
        setAlertData(
            {
                title:'Error',
                message:'Server Error, Please try again later'
            }
        )
      }
          
          }
  }; defaultStart()}, []);

     
  return (

    <SafeAreaView style={styles.container}>
        <Settings overlay={overlay} setOverlay={setOverlay} setAlertData={setAlertData}  setAlert={setAlert} />
        <Navbar setOverlay={setOverlay}/>
        {isAlert&&
      <CustomAlert title={alertData.title} message={alertData.message} handlePress={setAlert} />}         
      <RealTimeDisplay setAlertData={setAlertData} setAlert={setAlert}/>
        <Graph setAlertData={setAlertData} setAlert={setAlert}/>
        
    </SafeAreaView>
  )
}

export default Home

const styles = StyleSheet.create({
    container:{
        flex:1,
      
    }, 
})