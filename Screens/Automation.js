import React,{useState,useEffect} from 'react'
import Navbar from '../components/Navbar'
import { api } from '../components/Axios';
import Settings from '../components/Settings';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Modal,
    StyleSheet,
    Switch,
    ActivityIndicator,
    SafeAreaView
  } from 'react-native';
import { useAuth } from '../components/AuthProvider';
import CustomAlert from '../components/customAlert'

  
const initialCrops= [
    {
      id: 1,
      crop: "Tomatoes",
      description: "A warm-season crop that requires full sun and well-drained soil.",
      Temperature: 25,
      Humidity: 65,
      Moisture: 80,
      Nitrogen: 45,
      Potassium: 35,
      Phosphorous: 40,
      Irrigation_interval_perweek: 3,
      Irrigation_interval_perday: 2,
      isChosen: false,
    },
    {
      id: 2,
      crop: "Lettuce",
      description: "A cool-season crop that grows best in temperatures between 60-70°F.",
      Temperature: 18,
      Humidity: 70,
      Moisture: 75,
      Nitrogen: 30,
      Potassium: 25,
      Phosphorous: 30,
      Irrigation_interval_perweek: 4,
      Irrigation_interval_perday: 1,
      isChosen: false,
    },
    {
      id: 3,
      crop: "Carrots",
      description: "Root vegetables that prefer loose, well-drained soil and full sun.",
      Temperature: 20,
      Humidity: 60,
      Moisture: 70,
      Nitrogen: 25,
      Potassium: 30,
      Phosphorous: 35,
      Irrigation_interval_perweek: 2,
      Irrigation_interval_perday: 1,
      isChosen: true,
    },
    
        {
            id: 4,
            crop: "Onions",
            description: "Cool-season crop requiring well-drained, fertile soil with high organic matter. Needs consistent moisture but avoid waterlogging. Best grown in full sun with proper spacing for bulb development. Matures in 90-160 days depending on variety.",
            Temperature: 18, 
            Humidity: 65, 
            Moisture: 65, 
            Nitrogen: 40, 
            Potassium: 45, 
            Phosphorous: 35, 
            Irrigation_interval_perweek: 2, 
            Irrigation_interval_perday: 1, 
            isChosen: true,
          },
  ];
  

const Automation = ({overlay,setOverlay}) => {
    const [crops, setCrops] = useState(initialCrops);
    const [selectedCrop, setSelectedCrop] = useState(null);
    const [deployModalVisible, setDeployModalVisible] = useState(false);
    const [viewModalVisible, setViewModalVisible] = useState(false);
    const [descriptionModalVisible, setDescriptionModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showChosenCrops, setShowChosenCrops] = useState(false);
    const [pumpActive, setPumpActive] = useState(false);
    const {realTimeData}=useAuth()

    const handleDeployCrop = (crop) => {
        setSelectedCrop(crop);
        setDeployModalVisible(true);
      };
    
    const [isAlert,setAlert]=useState(false)
   const [alertData,setAlertData]=useState({
    title:'',
    message:''
   })
      const handleViewCrop = (crop) => {
        setSelectedCrop(crop);
       setViewModalVisible(true);
      };
  
      const handleStartExecution = async () => {
        setLoading(true);
        // Simulate API call
        // await new Promise(resolve => setTimeout(resolve, 2000));
        try{
        const res2 = await api.patch("api/Chosen_crop/", {
            id: selectedCrop.id,
            isChosen: 1,
          });
        setCrops(crops.map(crop => 
          crop.id === selectedCrop.id ? { ...crop, isChosen: true } : crop
        ));
        setLoading(false);
        setDeployModalVisible(false);
    }catch(error){
      if(!error.response){
      setAlert(true)
      setAlertData(
          {
              title:'Error',
              message:'Network Error, Check your Internet connection'
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
            console.log('Error ',error)
            setLoading(false);
            setDeployModalVisible(false);
        }
      };
    
      const handleRemoveCrop = async () => {
        setLoading(true);
        // Simulate API call
        try{
    const res2 = await api.patch("api/Chosen_crop/", {
        id:selectedCrop.id,
        isChosen: false,
      });
        // await new Promise(resolve => setTimeout(resolve, 2000));
        setCrops(crops.map(crop => 
          crop.id === selectedCrop.id ? { ...crop, isChosen: false } : crop
        ));
        setLoading(false);
        setViewModalVisible(false);
    }catch(error){
      if(!error.response){
      setAlert(true)
      setAlertData(
          {
              title:'Error',
              message:'Network Error, Check your Internet connection'
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
            console.log('Error ',error)
            setLoading(false);
            setViewModalVisible(false);
        }
      };
    

    const renderCropItem = ({ item }) => {
        if (showChosenCrops !== item.isChosen) return null;
    
        return (
          <View style={[styles.cropRow,{display:'flex',flexDirection:'row',width:'100%',alignItems:'center'}]}>
            <Text style={styles.cropName}>{item.crop}</Text>
            <TouchableOpacity 
            style={[{width:'50%',alignSelf:'center'}]}
              onPress={() => {
                setSelectedCrop(item);
                setDescriptionModalVisible(true);
              }}
            >
              <Text style={[styles.description]} numberOfLines={1}>
                {item.description}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, item.isChosen && styles.chosenButton,,{marginLeft:10}]}
              onPress={() => item.isChosen ? handleViewCrop(item) : handleDeployCrop(item)}
            >
              <Text style={[styles.buttonText]}>
                {item.isChosen ? 'View' : 'More'}
              </Text>
            </TouchableOpacity>
          </View>
        );
      };

    const CropDetails = () => (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailRow}>Temperature: {selectedCrop?.Temperature}ºC</Text>
          <Text style={styles.detailRow}>Humidity: {selectedCrop?.Humidity}%</Text>
          <Text style={styles.detailRow}>Moisture: {selectedCrop?.Moisture}K</Text>
          <Text style={styles.detailRow}>Nitrogen: {selectedCrop?.Nitrogen}%</Text>
          <Text style={styles.detailRow}>Potassium: {selectedCrop?.Potassium}%</Text>
          <Text style={styles.detailRow}>Phosphorous: {selectedCrop?.Phosphorous}%</Text>
          <Text style={styles.detailRow}>Days to Irrigate/Week: {selectedCrop?.Irrigation_interval_perweek}</Text>
          <Text style={styles.detailRow}>Times to Irrigate/Day: {selectedCrop?.Irrigation_interval_perday}</Text>
        </View>
      );
    

      useEffect(() => {
        async function cropSpecs() {
          if (realTimeData.Temperature !== 0) {
        try{
            setLoading(true);
            const data = {
              Temperature: realTimeData.Temperature,
              Humidity: realTimeData.Humidity,
              Moisture: realTimeData.Moisture,
              Nitrogen: realTimeData.Nitrogen,
              Phosporous: realTimeData.Phosporous,
              Potassium: realTimeData.Potassium,
            };
            const res = await api.post("api/crop_specification/", data);
            console.log("ressssssssss", res.data);
            if (res.message === "No Match Found") {
              setLoading(false);
            }
            console.log(res.message);
            if(Array.isArray(res.message)){
                
            
            res.message.forEach((element) => {
              const newData={ crop: element.crop_name,
  description: element.description,
  Temperature: element.Temperature,
  Humidity: element.Humidity,
  Moisture: element.Moisture,
  Nitrogen: element.Nitrogen,
  Phosporous: element.Phosporous,
  Potassium: element.Potassium,
  Irrigation_interval_perday: element.No_of_irigation_per_day,
  Irrigation_interval_perweek: element.No_of_irigation_per_week,
  Soil_pH: element.Soil_pH,
  isChosen: element.isChosen,
  id: element.id,
  Altitude: element.Altitude
              }
              crops.push(newData);
            }, []);
        }else{
            const element=res.message
            const newData={ crop: element.crop_name,
description: element.description,
Temperature: element.Temperature,
Humidity: element.Humidity,
Moisture: element.Moisture,
Nitrogen: element.Nitrogen,
Phosporous: element.Phosporous,
Potassium: element.Potassium,
Irrigation_interval_perday: element.No_of_irigation_per_day,
Irrigation_interval_perweek: element.No_of_irigation_per_week,
Soil_pH: element.Soil_pH,
isChosen: element.isChosen,
id: element.id,
Altitude: element.Altitude
            }
            crops.push(newData);

        }

        setLoading(false)

          
        }catch(error){
          if(!error.response){
            setAlert(true)
            setAlertData(
                {
                    title:'Error',
                    message:'Network Error, Check yu Internet connection'
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
            console.log(error)
            setLoading(false)
        }
    }
       }
        cropSpecs();
      }, []);

      useEffect(()=>{
        const timer= setInterval(() => {
          if(isAlert){
    
            setAlert(false)
          }
         }, 4000);
         return () => clearInterval(timer);
       },[isAlert])
    

  return (
    <SafeAreaView style={styles.main}>
        <Navbar setOverlay={setOverlay}/>
        <Settings overlay={overlay} setOverlay={setOverlay}/>

        {isAlert&&
      <CustomAlert title={alertData.title} message={alertData.message} handlePress={setAlert} />
}  
        <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.headerButton} 
          onPress={() => setShowChosenCrops(false)}
        >
          <Text style={styles.headerButtonText}>Suggested Crops</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.headerButton} 
          onPress={() => setShowChosenCrops(true)}
        >
          <Text style={styles.headerButtonText}>My Crops</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={crops}
        renderItem={renderCropItem}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No crops available.</Text>
        }
      />

      {/* Deploy Modal */}
      <Modal
        visible={deployModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeployModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedCrop?.crop}</Text>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <>
                <CropDetails />
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={handleStartExecution}
                >
                  <Text style={styles.actionButtonText}>Start Execution</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setDeployModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* View Modal */}
      <Modal
        visible={viewModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setViewModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedCrop?.crop}</Text>
            <Text style={styles.irrigationText}>
              Irrigation happens in 3hrs 30min...
            </Text>
            <View style={styles.pumpContainer}>
              <Text style={styles.pumpText}>Pump</Text>
              <Switch
                value={pumpActive}
                onValueChange={setPumpActive}
              />
            </View>
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" />
            ) : (
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleRemoveCrop}
              >
                <Text style={styles.actionButtonText}>Remove Crop</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setViewModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Description Modal */}
      <Modal
        visible={descriptionModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDescriptionModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Description</Text>
            <Text style={styles.descriptionText}>
              {selectedCrop?.description}
            </Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setDescriptionModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
    </SafeAreaView>
  )
}

export default Automation

const styles = StyleSheet.create({
    main:{
    flex:1,
    backgroundColor:'#a2d9ce'
    },
    // container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: "#fff" },
      container: {
      flex: 1,
      backgroundColor: '#a2d9ce',
    },
    header: {
      flexDirection: 'row',
      padding: 10,
      backgroundColor: '#a2d9ce',
    },
    headerButton: {
      padding: 10,
      marginRight: 10,
      backgroundColor: '#16a085',
      borderRadius: 5,
    },
    headerButtonText: {
      color: '#000',
    },
    cropRow: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
      backgroundColor: '#fff',
    },
    cropName: {
      flex: 1,
      fontWeight: 'bold',
    },
    description: {
      flex: 1,
      color: '#666',
      alignSelf:'center'
    },
    button: {
      flex:1,
      backgroundColor: '#007AFF',
      padding: 8,
      borderRadius: 5,
      maxWidth:100,
      alignItems: 'center',
    },
    chosenButton: {
      backgroundColor: '#34C759',
    },
    buttonText: {
      color: '#fff',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 20,
      width: '90%',
      maxHeight: '80%',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 15,
    },
    detailsContainer: {
      marginVertical: 15,
    },
    detailRow: {
      marginVertical: 5,
    },
    actionButton: {
      backgroundColor: '#007AFF',
      padding: 12,
      borderRadius: 5,
      alignItems: 'center',
      marginVertical: 10,
    },
    actionButtonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    closeButton: {
      marginTop: 10,
      padding: 10,
      alignItems: 'center',
    },
    closeButtonText: {
      color: '#007AFF',
    },
    emptyText: {
      textAlign: 'center',
      marginTop: 20,
      color: '#666',
    },
    pumpContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginVertical: 15,
    },
    pumpText: {
      fontSize: 16,
    },
    irrigationText: {
      marginVertical: 10,
      color: '#666',
    },
    descriptionText: {
      lineHeight: 20,
      color: '#333',
    },
  

})