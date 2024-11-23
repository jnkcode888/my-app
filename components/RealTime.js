import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle, Text as SvgText, Path } from "react-native-svg";
import { api } from "./Axios";
import { useAuth } from "./AuthProvider";

export default function RealTimeDisplay({setAlert,setAlertData}) {
    const {realTimeData,setRealTimeData}=useAuth()

 useEffect(()=>{
  const fetch=async()=>{
   try{
    const res=await api.get('api/realTimeData/')
    setRealTimeData(res)

   }catch(error){
    if(!error.response){
       setAlert(true)
       setAlertData({
        title:'Error',
        message:'Check your internet Connection'
       })
    }else{
      setAlert(true)
       setAlertData({
        title:'Error',
        message:'Server Error, Please try again later'
       })
    }
    console.log(error)
   }
  };fetch()
  
 },[])

  return (
    <View style={styles.container}>

      {/* Temperature */}
      <View style={styles.item}>
        <Svg height="100" width="100" viewBox="0 0 36 36">
          <Circle
            cx="18"
            cy="18"
            r="16"
            stroke="lightgray"
            strokeWidth="3"
            fill="none"
          />
          <Path
            d={`M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831`}
            stroke="#45b39d"
            strokeWidth="3"
            fill="none"
            strokeDasharray={`${realTimeData.Temperature}, 100`}
          />
          <SvgText
            x="18"
            y="20.35"
            fontSize="6"
            textAnchor="middle"
            fill="black"
          >
             {realTimeData.Temperature}°C
          </SvgText>
        </Svg>
        <Text style={styles.name}>Temperature</Text>
      </View>
      <View style={styles.item}>
        <Svg height="100" width="100" viewBox="0 0 36 36">
          <Circle
            cx="18"
            cy="18"
            r="16"
            stroke="lightgray"
            strokeWidth="3"
            fill="none"
          />
          <Path
            d={`M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831`}
            stroke="#45b39d"
            strokeWidth="3"
            fill="none"
            strokeDasharray={`${realTimeData.Humidity}, 100`}
          />
          <SvgText
            x="18"
            y="20.35"
            fontSize="6"
            textAnchor="middle"
            fill="black"
          >
             {realTimeData.Humidity}%
          </SvgText>
        </Svg>
        <Text  style={styles.name}>Humidity</Text>
      </View>
      <View style={styles.item}>
        <Svg height="100" width="100" viewBox="0 0 36 36">
          <Circle
            cx="18"
            cy="18"
            r="16"
            stroke="lightgray"
            strokeWidth="3"
            fill="none"
          />
          <Path
            d={`M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831`}
            stroke="#45b39d"
            strokeWidth="3"
            fill="none"
            strokeDasharray={`${realTimeData.Moisture}, 100`}
          />
          <SvgText
            x="18"
            y="20.35"
            fontSize="6"
            textAnchor="middle"
            fill="black"
          >
             {realTimeData.Moisture}%
          </SvgText>
        </Svg>
        <Text  style={styles.name}>Moisture</Text>
      </View>
      <View style={styles.item}>
        <Svg height="100" width="100" viewBox="0 0 36 36">
          <Circle
            cx="18"
            cy="18"
            r="16"
            stroke="lightgray"
            strokeWidth="3"
            fill="none"
          />
          <Path
            d={`M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831`}
            stroke="#45b39d"
            strokeWidth="3"
            fill="none"
            strokeDasharray={`${70}, 170`}
          />
          <SvgText
            x="18"
            y="20.35"
            fontSize="6"
            textAnchor="middle"
            fill="black"
          >
             70 mg/kg
          </SvgText>
        </Svg>
        <Text  style={styles.name}>Pottasium</Text>
      </View>
      <View style={styles.item}>
        <Svg height="100" width="100" viewBox="0 0 36 36">
          <Circle
            cx="18"
            cy="18"
            r="16"
            stroke="lightgray"
            strokeWidth="3"
            fill="none"
          />
          <Path
            d={`M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831`}
            stroke="#45b39d"
            strokeWidth="3"
            fill="none"
            strokeDasharray={`${10}, 100`}
          />
          <SvgText
            x="18"
            y="20.35"
            fontSize="6"
            textAnchor="middle"
            fill="black"
          >
             10 (mg/kg)
          </SvgText>
        </Svg>
        <Text  style={styles.name}>Phoporous</Text>
      </View>
      <View style={styles.item}>
        <Svg height="100" width="100" viewBox="0 0 36 36">
          <Circle
            cx="18"
            cy="18"
            r="16"
            stroke="lightgray"
            strokeWidth="3"
            fill="none"
          />
          <Path
            d={`M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831`}
            stroke="#45b39d"
            strokeWidth="3"
            fill="none"
            strokeDasharray={`${20}, 100`}
          />
          <SvgText
            x="18"
            y="20.35"
            fontSize="6"
            textAnchor="middle"
            fill="black"
          >
             20 (mg/kg)
          </SvgText>
        </Svg>
        <Text  style={styles.name}>Nitrogen</Text>
      </View>



    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "no-wrap",
    overflow:'scroll',
    gap:10,
    paddingTop:10,
    paddingBottom:10,
    backgroundColor:'#a2d9ce'
  },
  name:{
    paddingLeft:15
  }


});
