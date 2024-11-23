import { StyleSheet} from 'react-native'
import React from 'react'
import Tabs from '../Screens/Tabs'
import AuthProvider from '../components/AuthProvider'
const index = () => {
  return (
    <AuthProvider>
    <Tabs />
  </AuthProvider>  )
}

export default index

const styles = StyleSheet.create({

    
  }

)