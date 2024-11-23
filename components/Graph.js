import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import {api} from './Axios'
import {useAuth} from './AuthProvider'

const Graph = () => {
  const {dataList, setDataList,savedLocation} = useAuth()

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  // Local state to hold the graph data

  // Dummy data for visualization
  const tempData = [];
  const rainfallData = [];
  const humidityData = [];

  // const dummyData = {
  //   message: [
  //     { Month: 1, Temperature: 28, Rainfall_mm: 40, Humidity: 80 },
  //     { Month: 2, Temperature: 30, Rainfall_mm: 20, Humidity: 70 },
  //     { Month: 3, Temperature: 25, Rainfall_mm: 50, Humidity: 65 },
  //     { Month: 4, Temperature: 26, Rainfall_mm: 60, Humidity: 68 },
  //     { Month: 5, Temperature: 29, Rainfall_mm: 30, Humidity: 75 },
  //     { Month: 6, Temperature: 32, Rainfall_mm: 15, Humidity: 60 },
  //     { Month: 7, Temperature: 35, Rainfall_mm: 5, Humidity: 55 },
  //     { Month: 8, Temperature: 33, Rainfall_mm: 10, Humidity: 65 },
  //     { Month: 9, Temperature: 30, Rainfall_mm: 20, Humidity: 70 },
  //     { Month: 10, Temperature: 28, Rainfall_mm: 35, Humidity: 75 },
  //     { Month: 11, Temperature: 26, Rainfall_mm: 50, Humidity: 80 },
  //     { Month: 12, Temperature: 25, Rainfall_mm: 60, Humidity: 85 },
  //   ],
  // };
  if(dataList&&dataList['message']){
    dataList['message'].forEach((element,index)=>{
     tempData.push( 
      { month: monthNames[element.Month - 1], temp: element.Temperature, height: getHeight(element.Temperature) * 2},
     )
     rainfallData.push(
       { month: monthNames[element.Month - 1], rainfall: element.Rainfall_mm, height: getHeight(element.Rainfall_mm) * 7 }
     )
     humidityData.push(
       { month: monthNames[element.Month - 1], humidity: element.Humidity, height: getHeight(element.Humidity) }
     )
    }) 
  }
 
    function getHeight(x){
      return Math.round((x * 100) / 40);
    }
  useEffect(() => {
    async function defaultStart() {  
      try{
      const res = await api.post('locationData/', {
        country: 'Kenya',
        county: 'Machakos',
        sub_county: 'Kathiani'
      });
      setDataList(res);
      }catch(error){
      console.log('Errrror ',error)
      }
    };
    // / Set the dummy data to the local state
   defaultStart()}, [savedLocation]);


 
  return (
    <ScrollView style={styles.container}>
        {/* Temperature Graph */}
        <View style={styles.chartContainer}>
          <Text style={styles.title}>Yearly Temperature Trend</Text>
          <View style={styles.chart}>
            {tempData.map((item, index) => (
              <View key={index} style={[styles.bar, { height: item.height }]}>
                <Text style={styles.barLabel}>{item.temp}°C</Text>
              </View>
            ))}
          </View>
          <View style={styles.xAxis}>
            {tempData.map((item, index) => (
              <Text key={index} style={styles.xAxisLabel}>{item.month.substring(0, 3)}</Text>
            ))}
          </View>
        </View>

        {/* Rainfall Graph */}
        <View style={styles.chartContainer}>
          <Text style={styles.title}>Yearly Rainfall Trend</Text>
          <View style={styles.chart}>
            {rainfallData.map((item, index) => (
              <View key={index} style={[styles.bar, { height: item.height }]}>
                <Text style={styles.barLabel}>{item.rainfall}mm</Text>
              </View>
            ))}
          </View>
          <View style={styles.xAxis}>
            {rainfallData.map((item, index) => (
              <Text key={index} style={styles.xAxisLabel}>{item.month.substring(0, 3)}</Text>
            ))}
          </View>
        </View>

        {/* Humidity Graph */}
        <View style={styles.chartContainer}>
          <Text style={styles.title}>Yearly Humidity Trend</Text>
          <View style={styles.chart}>
            {humidityData.map((item, index) => (
              <View key={index} style={[styles.bar, { height: item.height }]}>
                <Text style={styles.barLabel}>{item.humidity}%</Text>
              </View>
            ))}
          </View>
          <View style={styles.xAxis}>
            {humidityData.map((item, index) => (
              <Text key={index} style={styles.xAxisLabel}>{item.month.substring(0, 3)}</Text>
            ))}
          </View>
        </View>
      
    </ScrollView>
  );
};

export default Graph;

const styles = StyleSheet.create({
  container: {
    flex:1,
    borderWidth:0,
    backgroundColor:'#a2d9ce'
  
  },
  chartContainer:{
    borderWidth:0,
    alignItems:'center',
    width:'100%',
    backgroundColor:'',
    alignSelf:'center'
  
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  chart: {
    flexDirection: 'row',
    gap:3,
    alignItems: 'flex-end',
    
    
  },
  bar: {
    width: 30,
    backgroundColor: '#16a085',
    justifyContent: 'center',
    alignItems: 'center',
  },
  barLabel: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  xAxis: {
    flexDirection: 'row',
    gap:13,
    marginTop: 10,
  },
  xAxisLabel: {
    fontSize: 12,
  },
});
