import { Feather } from "@expo/vector-icons";
import React, { useState, useRef } from "react";
import { 
  Pressable, 
  TouchableWithoutFeedback,
  View, 
  Text, 
  TextInput, 
  Image, 
  Button, 
  StyleSheet,
  Modal,
  FlatList,
  Animated,
  Platform
} from "react-native";
import { api } from "./Axios";
import { useAuth } from "./AuthProvider";
import * as ImagePicker from 'expo-image-picker';




export default function Settings(props) {
  const { overlay, setOverlay,setAlert,setAlertData } = props;
  const [active, setActive] = useState('1');
  const {dataList, setDataList,savedLocation,setSavedLocation} = useAuth()

  const [locations, setLocation] = useState({
    country: '',
    county: '',
    sub_county: ''
  });
  const [sideBarData, updateData] = useState({ 
    username: '',
    profileImage:null
  });
  const [imagePickerVisible, setImagePickerVisible] = useState(false);

  const [isedit, enableEdit] = useState({
    profile: false,
    location: false,
  });
  console.log('holoooo',savedLocation)
  // Dropdown states
  const [selectedCountry, setSelectedCountry] = useState(savedLocation.Country||null);
  const [selectedCounty, setSelectedCounty] = useState(savedLocation.County||null);
  const [selectedSubCounty, setSelectedSubCounty] = useState(savedLocation.Sub_county||null);
  const [dropdownType, setDropdownType] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const {userInfo,setUserInfo}=useAuth()
  
  const rotateAnimation = useRef(new Animated.Value(0)).current;

  const locationOptions = [
    {
      id: '1',
      key: 'Kenya',
      sublocations: [
        {
          id: '1',
          key: 'Nairobi',
          sublocations: [
            { id: '1', key: 'Westlands' },
            { id: '2', key: 'Kibra' },
            // { id: '3', key: 'Mathare' }
          ]
        },
       
        {
          id: '2',
          key: 'Machakos',
          sublocations: [
            { id: '1', key: 'kathiani' },
            { id: '2', key: 'Kangundo' },
          ]
        }
      ],
    }
  ];

  function handleBtn(id) {
    setActive(id);
    enableEdit({
      profile: false,
      location: false,
    });
  }

 async function save(id){
    if(id==2){
     
     
      enableEdit(prev=>({...prev,['location']:false}))
    
try{
    const res = await api.post('locationData/', {
      country: selectedCountry.key,
      county: selectedCounty.key,
      sub_county: selectedSubCounty.key
    });
    setDataList(res);
    setSavedLocation({
      Country: selectedCountry.key,
      County: selectedCounty.key,
      Sub_county: selectedSubCounty.key
    })
  }catch(error){
    if(!error.response){
      setAlert(true)
      setAlertData(
          {
              title:'Error',
              message:'Network Error, Check your Internet connection'
          }
      )
      console.log(error)
      return;
  }else{
      setAlert(true)
      setAlertData(
          {
              title:'Error',
              message:'Server Error ,Please try again later'
          }
      )
      console.log(error)
      return;
  } 
  }
  }}
  function Discard(id){
    if(id==2){
      setSelectedCountry({key:savedLocation.Country})
      setSelectedCounty({key:savedLocation.County})
      setSelectedSubCounty({key:savedLocation.Sub_county})
      enableEdit(prev=>({...prev,['location']:false}))
    }else{
      updateData(prev=>({...prev,['username:']:''}))
      enableEdit(prev=>({...prev,['profile']:false}))
    }
  }
  
  async function handleChange() {
    try {
      const res = await api.patch(`api/user/update/`, { 'username': sideBarData.username });
      setUserInfo(prev => ({ ...prev, ['username']: sideBarData.username }));
      updateData(prev => ({ ...prev, ['username:']: '' }))
      enableEdit(prev => ({ ...prev, ['profile']: false }))
    } catch(error) {
      if (!error.response) {
        setAlert(true)
        setAlertData({
          title: 'Error',
          message: 'Network Error, Check your Internet connection'
        })
        console.log(error)
        return;
      } else {
        setAlert(true)
        setAlertData({
          title: 'Error',
          message: 'Server Error, Please try again later'
        })
        console.log(error)
        return;
      }
    } // Add this closing bracket
  }

  const toggleDropdown = (type) => {
    setDropdownType(type);
    setIsDropdownOpen(!isDropdownOpen);
    Animated.timing(rotateAnimation, {
      toValue: isDropdownOpen ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const rotate = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const handleLocationSelect = (item) => {
    switch (dropdownType) {
      case 'country':
        setSelectedCountry(item);
        setSelectedCounty(null);
        setSelectedSubCounty(null);
        break;
      case 'county':
        setSelectedCounty(item);
        setSelectedSubCounty(null);
        break;
      case 'subcounty':
        setSelectedSubCounty(item);
        break;
    }
    setIsDropdownOpen(false);
  };

  const getDropdownOptions = () => {
    switch (dropdownType) {
      case 'country':
        return locationOptions;
      case 'county':
        return selectedCountry ? selectedCountry.sublocations : [];
      case 'subcounty':
        return selectedCounty ? selectedCounty.sublocations : [];
      default:
        return [];
    }
  };

  const pickImage = async () => {
    // Request permission
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        updateData(prev => ({
          ...prev,
          profileImage: result.assets[0].uri
        }));

        setUserInfo(prev => ({ ...prev, ['profilePic']: result.assets[0].uri }));

      }

      
    } catch (error) {
   
      setAlert(true)
      setAlertData(
          {
              title:'Error',
              message:'Allow permission to access gallery'
          }
      )
      console.log(error)
      return;
  
  }};

  const handleEdit=()=>{
    if (active==='1'){
      enableEdit(prev => ({ ...prev, ['profile']: true }))
    }else if(active==='2'){
      enableEdit(prev => ({ ...prev, ['location']: true }))
      setSelectedCountry({key:null})
      setSelectedCounty({key:null})
      setSelectedSubCounty({key:null});

    }
  }

  return (
    <TouchableWithoutFeedback onPress={() => setOverlay(false)}>
      <View style={[styles.overlay, overlay ? styles.addOverlay : styles.removeOverlay]}>
        <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
          <View style={styles.settingsContainer}>
            <View style={styles.sidebar}>
              <Pressable 
                style={active === '1' ? styles.activeButton : styles.inactiveButton} 
                onPress={() => handleBtn('1')}
              >
                <Text>Edit Profile</Text>
              </Pressable>
              <Pressable 
                style={active === '2' ? styles.activeButton : styles.inactiveButton} 
                onPress={() => handleBtn('2')}
              >
                <Text>Location</Text>
              </Pressable>
              <Pressable 
                style={active === '3' ? styles.activeButton : styles.inactiveButton} 
                onPress={() => handleBtn('3')}
              >
                <Text>User Data</Text>
              </Pressable>
            </View>

            {active === '1' && (
              <View style={styles.content}>
                  {isedit.profile==true?
                <Pressable 
                 onPress={()=>Discard(1)}
                  style={[styles.editParent,{backgroundColor:'red',width:65,borderRadius:5,alignSelf:'end'}]} 
                >
                  <Text style={[{margin:10,color:'white'}]}>Discard</Text>
                </Pressable>
                :
                <Pressable style={styles.editParent}>
                  <Feather 
                    name="edit" 
                    size={19} 
                    style={styles.edit} 
                    onPress={handleEdit}
                  />
                </Pressable>
}
                <View style={styles.profileSection}>
                  <Image 
                    source={userInfo.profilePic ?{ uri: userInfo.profilePic }:{ uri: '/assets/images/edited boy.png' }} 
                    style={styles.profilePic} 
                  />
                  {isedit.profile && (
                    <Button 
                      color={'#2ecc71'} 
                      title="Change Profile" 
                      onPress={pickImage} 
                    />
                  )}
                  <TextInput
                    style={[styles.input,{fontWeight:'500'}]}
                    placeholder={`UserName:  ${userInfo.username}`}
                    editable={isedit.profile}
                    value={sideBarData.username}
                    onChangeText={(text) => updateData({ ...sideBarData, username: text })}
                  />
                  {isedit.profile && (
                    <Button 
                      color={'#2ecc71'} 
                      title="Save username" 
                      onPress={handleChange} 
                    />
                  )}
                </View>
              </View>
            )}

            {active === '2' && (
              <View style={styles.content}>

               
                  {isedit.location==true?
                <Pressable 
                className=""
                onPress={()=>save(2)}
                  style={[styles.editParent,{backgroundColor:'#2ecc71',width:40,padding:10,paddingLeft:40,marginBottom:15,borderRadius:5,alignSelf:'flex-end'}]} 
                >
                  <Text style={[{marginLeft:10}]}>Save</Text>
                </Pressable>
:
                <Pressable 
                  style={[styles.editParent,{width:40,alignSelf:'end',marginBottom:3}]} 
                  onPress={handleEdit}
                >
                  <Feather name="edit" size={19} style={styles.edit} />
                </Pressable>
}
                 
                <View style={styles.locationSection}>
                  {/* Country Dropdown */}
                  <Pressable 
                    style={styles.dropdownButton}
                    onPress={() => toggleDropdown('country')}
                    disabled={!isedit.location}
                  >
                    <Text style={styles.buttonText}>
                      {selectedCountry ? selectedCountry.key : 'Select Country'}
                    </Text>
                    <Animated.Text style={[styles.arrow, { transform: [{ rotate }] }]}>
                      ▼
                    </Animated.Text>
                  </Pressable>

                  {/* County Dropdown */}
                  <Pressable 
                    style={[styles.dropdownButton, { marginTop: 10 }]}
                    onPress={() => toggleDropdown('county')}
                    disabled={!selectedCountry || !isedit.location}
                  >
                    <Text style={styles.buttonText}>
                      {selectedCounty ? selectedCounty.key : 'Select County'}
                    </Text>
                    <Animated.Text style={[styles.arrow, { transform: [{ rotate }] }]}>
                      ▼
                    </Animated.Text>
                  </Pressable>

                  {/* Sub-County Dropdown */}
                  <Pressable 
                    style={[styles.dropdownButton, { marginTop: 10 }]}
                    onPress={() => toggleDropdown('subcounty')}
                    disabled={!selectedCounty || !isedit.location}
                  >
                    <Text style={styles.buttonText}>
                      {selectedSubCounty ? selectedSubCounty.key : 'Select Sub-County'}
                    </Text>
                    <Animated.Text style={[styles.arrow, { transform: [{ rotate }] }]}>
                      ▼
                    </Animated.Text>
                  </Pressable>

                  <Modal
                    visible={isDropdownOpen}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setIsDropdownOpen(false)}
                  >
                    <Pressable
                      style={styles.modalOverlay}
                      activeOpacity={1}
                      onPress={() => setIsDropdownOpen(false)}
                    >
                      <View style={styles.modalContent}>
                        <FlatList
                          data={getDropdownOptions()}
                          keyExtractor={(item) => item.id}
                          renderItem={({ item }) => (
                            <Pressable
                              style={styles.option}
                              onPress={() => handleLocationSelect(item)}
                            >
                              <Text style={styles.optionText}>{item.key}</Text>
                            </Pressable>
                          )}
                        />
                      </View>
                    </Pressable>
                  </Modal>
                </View>
                {isedit.location==true&&
                <Pressable 
                 onPress={()=>Discard(2)}
                  style={[styles.editParent,{backgroundColor:'red',width:65,marginTop:10,marginBottom:15,borderRadius:5,alignSelf:'end'}]} 
                >
                  <Text style={[{margin:10,color:'white'}]}>Discard</Text>
                </Pressable>
                }
              </View>
              
            )}

            {active === '3' && (
              <View style={styles.content}>
                <Pressable style={styles.editParent}>
                  <Feather name="edit" size={19} style={styles.edit} />
                </Pressable>
                {/* Add your content here */}
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(108, 122, 137, 0.8)',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  settingsContainer: {
    width: '90%',
    backgroundColor: '#16a085',
    borderRadius: 10,
    flexDirection: 'row',
    padding: 20,
    minHeight: '60%',
  },
  sidebar: {
    width: '25%',
  },
  activeButton: {
    backgroundColor: '#FFFDF6',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  inactiveButton: {
    backgroundColor: '#2ecc71',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  content: {
    flex: 1,
    paddingLeft: 20,
  },
  profileSection: {
    alignItems: 'center',
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 10,
    width: '100%',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  locationSection: {
    width: '100%',
  },
  editParent: {
    alignItems: 'flex-end',
  },
  addOverlay: {
    display: 'flex',
  },
  removeOverlay: {
    display: 'none',
  },
  dropdownButton: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  buttonText: {
    fontSize: 16,
    color: '#333',
  },
  arrow: {
    fontSize: 16,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 5,
    width: '80%',
    maxHeight: '50%',
  },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    fontSize: 16,
    color:'#333',
  }
});