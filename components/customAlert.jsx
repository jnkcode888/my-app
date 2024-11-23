import { StyleSheet, Text, View,Pressable } from 'react-native'
import React,{useState} from 'react'
import { MaterialIcons } from '@expo/vector-icons';

const CustomAlert = ({title,message,handlePress,isAlert}) => {
  

  
  return (
    <View style={[styles.main]}>
      <Text style={styles.title}>{title}</Text>
      <View>
      <Text style={styles.text}>{message}</Text>
        </View>
         <Pressable style={styles.xIcon} onPress={()=>handlePress(false)}>
         <MaterialIcons  name="close" size={20} color="red" />
            </Pressable>
      
    </View>
  )
}

export default CustomAlert

const styles = StyleSheet.create({
    main:{
      alignSelf:'center',
        flex:1,
        backgroundColor:'rgba(255,255,255,0.7)',
        height:'4.5rem',
        borderRadius:10,
        paddingHorizontal:10,
        position:'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10000,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
        top:10,

    },
    xIcon:{
        position:'absolute',
        right:3,
        top:3,
        backgroundColor:'transparent',
    },
    text:{
      fontSize:17,
      fontWeight:'500',
      color:'#333',
      paddingHorizontal:10,
      paddingVertical:5,
      letterSpacing:0.5
    },
    title:{
      fontSize:20,
      fontWeight:'bold'
    }
})