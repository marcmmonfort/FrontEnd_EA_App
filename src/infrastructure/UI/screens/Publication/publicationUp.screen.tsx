import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Button } from "react-native-paper";

export default function PublicationUpScreenA() {
  const [photoPublication, setPhotoPublication] = useState("");
  const [auxPhotoPublication, setAux] = useState("");
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
      setPhotoPublication(base64Image);

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

          setPhotoPublication(data.url);
          console.log(photoPublication)

          console.log('Hey')
          console.log('How')
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
      setPhotoPublication(base64Image);

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

          setPhotoPublication(data.url);
          console.log("PH:  " + photoPublication)
          console.log('Hey')
          console.log('How')

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
      navigation.navigate(
        "ScreenPublicationUpB" as never,
        {
          photoPublication: url, // Use the updated value directly
        } as never
      );
    }
  };
  const handleButtonPress = () => {
    // Navegar hacia otra pantalla aquí
    navigation.navigate("ChatA" as never);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <>
          <TouchableOpacity style={styles.button} onPress={handleCameraPress}>
            <Ionicons name="camera" size={32} color="white" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleGalleryPress}>
            <Ionicons name="image" size={32} color="white" />
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity style={styles.bottomButton} onPress={handleButtonPress}>
        <Ionicons name="arrow-forward" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  bottomButton: {
    position: "absolute",
    bottom: 20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
  },
});
