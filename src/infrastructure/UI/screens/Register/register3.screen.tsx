import React, { useState, useEffect } from "react";
import { Button, Image, View, Platform, Alert, ActivityIndicator, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as FileSystem from "expo-file-system";
import { StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import ButtonGradientBack from "../../components/buttons/Button_Type_2";
import ButtonGradientBack2 from "../../components/buttons/Button_Type_3";
import SubTitle from "../../components/texts/Subtitle";


interface RouteParams {
  appUser?: any;
  nameUser?: string;
  surnameUser?: string;
  mailUser?: string;
  passwordUser?: string;
}
export default function ScreenRegisterC() {
  const route = useRoute();
  const {
    appUser,
    nameUser,
    surnameUser,
    mailUser,
    passwordUser,
  }: RouteParams = route.params || {};
  const [photoUser, setPhotoUser] = useState("");
  const [auxPhotoUser, setAux] = useState("");
  const [loading, setLoading] = useState(false);
  const [cam, setCam] = useState(false);
  const navigation = useNavigation();
  let CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/diuyzbt14/upload";
  
  const handleCameraPress = async () => {
    setCam(true);
    let permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permissions Denied", "Please allow camera access to proceed.");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });

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
          console.log(photoUser)

          console.log('Hey')
          console.log('How')
          //setPhotoUser(data.url);
          handleUpload(data.url); // Pass the updated value directly
        })
        .catch((err) => console.log(err))
        .finally(() => setLoading(false));
    }
  };

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
      console.log(appUser);
      console.log(nameUser);
      console.log(surnameUser);
      console.log(mailUser);
      console.log(passwordUser);
      console.log(url);
      navigation.navigate(
        "ScreenRegisterD" as never,
        {
            appUser,
            nameUser,
            surnameUser,
            mailUser,
            passwordUser,
            photoUser:url, // Use the updated value directly
        } as never
      );
    }
  };
  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: "black" }]}>
      <SubTitle style={styles.text}>Upload your profile photo</SubTitle>
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.buttonA, { backgroundColor: "black" }]} onPress={handleCameraPress}>
            <LinearGradient
              colors={["#66fcf1", "#66fcf1"]}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.gradient}
            >
              <Ionicons name="camera" size={32} color="black" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.buttonB, { backgroundColor: "black" }]} onPress={handleGalleryPress}>
            <LinearGradient
              colors={["#66fcf1", "#66fcf1"]}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.gradient}
            >
              <Ionicons name="image" size={32} color="black" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.buttonContainerB}>
        <ButtonGradientBack2 onPress={handleGoBack} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  text:{
    marginBottom:50,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  buttonContainerB: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 100,
    marginBottom:-100
    
    
  },
  buttonA: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  buttonB: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 20,
  },
  gradient: {
    width: "100%",
    height: "100%",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
