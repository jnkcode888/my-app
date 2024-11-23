import { ImageBackground, StyleSheet } from 'react-native'
import React from 'react'
import Form from '../components/Form'

export const Auth = () => {
  return (
    <ImageBackground
    source={{uri:'/assets/images/FormImage.png'}}
    style={styles.backgroundImage}
    >
        <Form />
    </ImageBackground>
  )
}

export default Auth

const styles = StyleSheet.create({
    backgroundImage:{
     resizeMode:'cover',
     flex:1
    },
    
})