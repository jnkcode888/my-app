import { StyleSheet, Text, View } from 'react-native'
import React, { useContext } from 'react'
import Auth from './Auth'
import Home from './Home'
import Automation from './Automation'
import { AuthContext } from '../components/AuthProvider'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import ProtectedRoute from './ProtectedRoute'
import { Feather } from '@expo/vector-icons'
import AgriBot from './AgriBot'
import { useState } from 'react'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab=createBottomTabNavigator()

const Tabs = () => {
    const [overlay,setOverlay]=useState(false)

    const {isAuthenticated}=useContext(AuthContext)
  return (
            <Tab.Navigator
             screenOptions={{
        
        tabBarActiveTintColor: 'blue', // active tab color
        tabBarInactiveTintColor: 'black', // inactive tab color
        tabBarStyle: { 
            backgroundColor: '#16a085',
            // position:'absolute',
            bottom:0,
            borderWidth:0
        
        }, // tab bar background color
        tabBarShowLabel: false, // show or hide labels
        tabBarLabelStyle: { fontSize: 14 }, // font size of labels
        
      }}
            >
                
            {isAuthenticated!==true&&
                <Tab.Screen name='Login' component={Auth} options={
                    {
                        tabBarStyle:{
                            display:'none',
                            backgroundColor:'gray'
                        },
                        headerShown:false,

                       
                    }
                }/>
            }
                   
                <Tab.Screen name='Home' 
                options={
                    {
                        tabBarIcon:({color})=>(
                            <FontAwesome name="home" color={color} size={24}/>
                        ),
                        headerShown:false
                    }
                }
                >
                {props=>(
               <ProtectedRoute navigation={props.navigation}>
               <Home {...props} setOverlay={setOverlay} overlay={overlay}/>
               </ProtectedRoute>
                )}
                </Tab.Screen>

                <Tab.Screen name='Automation' 
                options={
                    {
                        tabBarIcon:({color})=>(
                            <FontAwesome name='leaf' color={color} size={24}/>
                        ),
                        headerShown:false
                    }
                }
                >
                {props=>(
               <ProtectedRoute navigation={props.navigation}>
               <Automation {...props} setOverlay={setOverlay} overlay={overlay}/>
               </ProtectedRoute>
                )}
                </Tab.Screen>
                <Tab.Screen name='AgriBot' options={{
                    tabBarIcon:({color,size})=>(
                        <Ionicons name='chatbubble-ellipses-outline' color={color} size={size}/>
                    ),
                    headerShown:false
                }}>
                 {props=>(
                     <ProtectedRoute navigation={props.navigation}>
                     <AgriBot {...props} setOverlay={setOverlay} overlay={overlay}/>
                     </ProtectedRoute>
 
                 )}
                </Tab.Screen>
                
            </Tab.Navigator>
  )
}

export default Tabs

const styles = StyleSheet.create({

    
})