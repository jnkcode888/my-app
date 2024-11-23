import { StyleSheet} from 'react-native'
import React,{createContext, useContext, useState} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';


export const AuthContext=createContext()
const AuthProvider = ({children}) => {
     const [isAuthenticated,setIsAuthenticated]=useState(false)
     const [userInfo,setUserInfo]=useState(
      {
    username:'',
    profilePic: '',
    dark_mode:null,
      }
    )
    const [dataList, setDataList] = useState('');

    const [realTimeData,setRealTimeData]=useState(
      {
    Temperature: 0,
    Humidity: 0,
    Moisture: 0,
    Nitrogen:0,
    Phosporous:0,
    Potassium:0,
      }
    )

    const [savedLocation,setSavedLocation]=useState({
      Country:'',
      County:'',
      Sub_county:''
     })
  

     const Login=()=>{
     
      setIsAuthenticated(true)
     }
     const Logout=async()=>{
      await AsyncStorage.removeItem('refresh');
      await AsyncStorage.removeItem('access');

      setIsAuthenticated(false)
     }

  return (
    <AuthContext.Provider value={{dataList,savedLocation,setSavedLocation,setDataList,realTimeData,setRealTimeData,isAuthenticated,Login,Logout,userInfo,setUserInfo}}>
       {children}
    </AuthContext.Provider>
  )
}

export const useAuth=()=>{
  return useContext(AuthContext)
}

export default AuthProvider

const styles = StyleSheet.create({})

