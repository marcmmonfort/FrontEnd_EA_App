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
  const navigation = useNavigation();

  const handleGoToScreenRegisterD = async() => {
    if (!photoUser) {
      Alert.alert("Hello", "You must complete all the fields");
    } else {
      
      navigation.navigate("ScreenRegisterD", {
        appUser,
        nameUser,
        surnameUser,
        mailUser,
        passwordUser,
        photoUser,
      });
    }
  };
  
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);
    console.log(photoUser)

    if (!result.canceled) {
      setPhotoUser(result.assets[0].uri);
    }
  };

  const takeImage=async()=>{
    let result =await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })
    console.log(result);
    console.log(photoUser)

    if (!result.canceled) {
      setPhotoUser(result.assets[0].uri);
    }
  }
  const handleGoBack = () => {
    navigation.navigate("ScreenRegisterB");
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      <Button title="Take a picture" onPress={takeImage} />
      {photoUser && <Image source={{ uri: photoUser }} style={{ width: 200, height: 200,borderRadius:200/2 }} />}
      <Button title="Next" onPress={handleGoToScreenRegisterD} />
      <Button title="Back" onPress={handleGoBack} />
    </View>
    
  );
}
