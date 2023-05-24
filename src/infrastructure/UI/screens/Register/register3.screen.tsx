import React, { useState, useEffect } from 'react';
import { Button, Image, View, Platform, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';


interface RouteParams {
  appUser?: any;
  nameUser?: string;
  surnameUser?: string;
  mailUser?: string;
  passwordUser?: string;
}
export default function ScreenRegisterC() {
  const route = useRoute()
  const { appUser, nameUser, surnameUser,mailUser,passwordUser}: RouteParams = route.params || {};
  const [photoUser, setPhotoUser] = useState('');
  const [auxPhotoUser,setAux]=useState('');
  const navigation = useNavigation();
  let CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/diuyzbt14/upload'  
  const handleGoToScreenRegisterD = async() => {
    if (!photoUser) {
      Alert.alert("Hello", "You must complete all the fields");
    } else {
      navigation.navigate("ScreenRegisterD" as never, {
        appUser,
        nameUser,
        surnameUser,
        mailUser,
        passwordUser,
        photoUser,
      }as never);
    }
  };


  
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      //mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true
    });


    

    if (!result.canceled) {
      setAux(result.assets[0].uri);
      setPhotoUser(result.assets[0].uri);
      const base64Image = await convertImageToBase64(result.assets[0].uri);
      setPhotoUser(base64Image);

      let data = {
        "file": base64Image,
        "upload_preset": "photoUser",
      }
      fetch(CLOUDINARY_URL, {
        body: JSON.stringify(data),
        headers: {
          'content-type': 'application/json'
        },
        method: 'POST',
      }).then(async r => {
        let data = await r.json()
  
    //Here I'm using another hook to set State for the photo that we get back //from Cloudinary
  
       setPhotoUser(data.url);
      }).catch(err => console.log(err))
    }
  };
  const convertImageToBase64 = async (imageUri: string) => {
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return `data:image/jpg;base64,${base64}`;
  };
  const takeImage=async()=>{
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    let result =await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })


    if (!result.canceled) {
      setAux(result.assets[0].uri);
      setPhotoUser(result.assets[0].uri);
      const base64Image = await convertImageToBase64(result.assets[0].uri);
      setPhotoUser(base64Image);


      let data = {
        "file": base64Image,
        "upload_preset": "photoUser",
      }
      fetch(CLOUDINARY_URL, {
        body: JSON.stringify(data),
        headers: {
          'content-type': 'application/json'
        },
        method: 'POST',
      }).then(async r => {
        let data = await r.json()

  
    //Here I'm using another hook to set State for the photo that we get back //from Cloudinary
  
       setPhotoUser(data.url);
      }).catch(err => console.log(err))
    }
  }
  const handleGoBack = () => {
    navigation.navigate("ScreenRegisterB"as never);
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      <Button title="Take a picture" onPress={takeImage} />
      {auxPhotoUser && <Image source={{ uri: auxPhotoUser }} style={{ width: 200, height: 200,borderRadius:200/2 }} />}
      <Button title="Next" onPress={handleGoToScreenRegisterD} />
      <Button title="Back" onPress={handleGoBack} />
    </View>
    
  );
}
