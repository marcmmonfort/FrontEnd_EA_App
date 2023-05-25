import React, { useState } from 'react';
import { View, Button, Image, TouchableOpacity, Alert } from 'react-native';
import StyledTextInputs from '../components/inputs/StyledTextInputs';
import { CRUDService } from '../../services/user/CRUD.service';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { SessionService } from '../../services/user/session.service';
import { UserAuthEntity } from '../../../domain/user/user.entity';
import { UserAuthValue } from '../../../domain/user/user.value';
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

export default function EditUserScreen() {
  const navigation = useNavigation();
  const [photoUser, setPhotoUser] = useState("");
  const [auxPhotoUser, setAux] = useState("");
  const [loading, setLoading] = useState(false);
  const [cam, setCam] = useState(false);
  let CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/diuyzbt14/upload";
  const [userData, setUserData] = useState({
    uuid: '',
    appUser: '',
    nameUser: '',
    surnameUser: '',
    mailUser: '',
    passwordUser: '',
    photoUser: '',
    birthdateUser: new Date(),
    genderUser: 'male',
    ocupationUser: '',
    descriptionUser: '',
    roleUser: 'common',
    privacyUser: false,
    deletedUser: false,
    followersUser: [],
    followedUser: [],
  });

  useFocusEffect(
    React.useCallback(() => {
      const getUser = async () => {
        const userId = await SessionService.getCurrentUser();
        if (userId) {
          try {
            await CRUDService.getUser(userId).then((response) => {
              setUserData(response?.data);
            });
          } catch (error) {
            console.error("Error retrieving user:", error);
          }
        }
      };
      getUser();
    }, [])
  );
  const convertImageToBase64 = async (imageUri:any) => {
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return `data:image/jpg;base64,${base64}`;
  };
  const handleGalleryPress = async () => {
    setCam(false);
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });
    console.log(result);

    if (!result.canceled) {
      setAux(result.assets[0].uri);
      setLoading(true);
      const base64Image = await convertImageToBase64(result.assets[0].uri);
      setPhotoUser(base64Image);

      let data = {
        file: base64Image,
        upload_preset: "publication",
      };
      fetch(CLOUDINARY_URL, {
        body: JSON.stringify(data),
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
      })
        .then(async (r) => {
          let data = await r.json();

          setPhotoUser(data.url);
          console.log("PH:  " + photoUser)
          console.log('Hey')
          console.log('How')
          //setPhotoUser(data.url);
          handleUpload(data.url); // Pass the updated value directly
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    }
  };
  
  const handleUpload = (url:any) => {
    if (!url) {
      Alert.alert("Hello", "You must complete all the fields");
    } else {
      const auxiliar=userData.photoUser;
      userData.photoUser=url;
      console.log(url);
      
    }
  };

  const handleChange = (key: any, value: any) => {
    setUserData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleSubmit = () => {
    try {
      console.log("AAAAAAA")
      CRUDService.editUser(userData).then((response) => {
        console.log("BBBBBB")
        console.log(response?.data);
        navigation.navigate('Profile' as never);
      });
    } catch (error) {
      console.error("Error editing user:", error);
    }
    console.log(userData);
  };

  return (
    <View>
      <TouchableOpacity onPress={() => {handleGalleryPress}}>
        <Image
          source={{ uri: userData.photoUser }}
          style={{ width: 200, height: 200, borderRadius: 200 / 2 }}
        />
      </TouchableOpacity>
      <StyledTextInputs
        placeholder="Username"
        value={userData.appUser}
        editable={false}
        onChangeText={(value: string) => handleChange('appUser', value)}
      />
      <StyledTextInputs
        placeholder="Name"
        value={userData.nameUser}
        onChangeText={(value: string) => handleChange('nameUser', value)}
      />
      <StyledTextInputs
        placeholder="Surname"
        value={userData.surnameUser}
        onChangeText={(value: string) => handleChange('surnameUser', value)}
      />
      <StyledTextInputs
        placeholder="Email"
        value={userData.mailUser}
        editable={false}
        onChangeText={(value: string) => handleChange('mailUser', value)}
      />
      <StyledTextInputs
        placeholder="Description"
        value={userData.descriptionUser}
        onChangeText={(value: string) => handleChange('descriptionUser', value)}
      />
      <Button title="Save" onPress={handleSubmit} />
      <Button title="edit image" onPress={handleGalleryPress}/>
    </View>
  );
}
