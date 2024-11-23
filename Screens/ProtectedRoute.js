import React from 'react'
import { jwtDecode } from "jwt-decode"
import { AuthContext } from '../components/AuthProvider'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useAuth } from '../components/AuthProvider'

const ProtectedRoute = ({children,navigation}) => {
    const {isAuthenticated,Login,Logout}=useAuth()

    async function refreshToken(){
        const REFRESH_TOKEN=await AsyncStorage.getItem('refresh')
        const decode=jwtDecode(REFRESH_TOKEN)
        const now=Date.now()
        
        if(decode.exp>now){
            Logout()
            return
        }

        try {
            const res=await api.post('api/token/refresh/',{
                refresh: REFRESH_TOKEN
            })
            if(res.Status==200){
                await AsyncStorage.setItem('access',res.data.accessToken)
               
            }else{
                Logout()
            }
        } catch (error) {
            console.error(error)
            Logout()
        }
    }
    
   async function checkAuth(){
        const ACCESS_TOKEN=localStorage.getItem('access')
        if(!ACCESS_TOKEN){
            Logout()
            return
        }

        const decode=jwtDecode(ACCESS_TOKEN)
        const now=Date.now()/1000
        if(decode>now){
           await refreshToken()
        }else{
           Login()
        }


    }

    if(!isAuthenticated){
        Logout()
        navigation.navigate('Login')
    }

    return children
  
}

export default ProtectedRoute

