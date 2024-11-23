import { StyleSheet, Text, View,Image,Pressable } from 'react-native'
import React from 'react'
import { useAuth } from './AuthProvider';
import { Ionicons } from '@expo/vector-icons';

const Navbar = ({setOverlay}) => {
    const {userInfo}=useAuth()
  return (
    <View style={styles.navBar}>

        <Image source={userInfo.profilePic!==''?{ uri:userInfo.profilePic} :{uri: '/assets/images/edited boy.png'}} style={styles.profile} />
           <Text style={styles.username}>{userInfo.username}</Text>
           <Pressable onPress={()=>setOverlay(true)}>
           <Ionicons name="grid-outline" color={'black'} size={25}/>
                      </Pressable>
        </View>
  )
}

export default Navbar

const styles = StyleSheet.create({
    navBar:{
        backgroundColor:'#16a085',
        height:'3.3rem',
        flexDirection:'row',
        justifyContent:'space-between',
        paddingHorizontal:15,
        alignItems:'center',
        
    },

    profile:{
        width:50,
        height:50,
        borderRadius:'50%'
        
    },
    username:{
        fontWeight:500,
        fontSize:18,
        fontStyle:'italic'
    }
})