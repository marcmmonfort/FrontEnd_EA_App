import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useState } from "react";
import { Alert, Button, View, Image } from "react-native";
import MainContainer from "../../components/containers/Main";
import { MediaType, ImagePickerResponse, launchCamera, launchImageLibrary } from 'react-native-image-picker';

interface RouteParams {
  appUser?: any;
  nameUser?: string;
  surnameUser?: string;
  mailUser?: string;
  passwordUser?: string;
}

export default function ScreenRegisterC() {
  const route = useRoute();
  const { appUser, nameUser, surnameUser, mailUser, passwordUser }: RouteParams = route.params || {};
  const [photoUser, setPhotoUser] = useState('https://via.placeholder.com/200');

  const navigation = useNavigation();

  const handleGoToScreenRegisterD = () => {
    /*if (!photoUser) {
      Alert.alert("Hello", "You must complete all the fields");
    } else {
      navigation.navigate("ScreenRegisterD", {
        appUser,
        nameUser,
        surnameUser,
        mailUser,
        password,
        photoUser,
      });
    }*/
    navigation.navigate("ScreenRegisterD", {
      appUser,
      nameUser,
      surnameUser,
      mailUser,
      passwordUser,
      photoUser,
    })
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const selectImage = () => {
    const options = {
      title: 'Select an image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      mediaType: 'photo' as MediaType,
      includeBase64: true,
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.errorCode) {
        console.log(response.errorCode);
      } else if (response.didCancel) {
        console.log('User cancelled');
      } else {
        const path = response.assets?.[0].uri ?? '';
        setPhotoUser(path);
      }
    });
  };

  const takePicture = () => {
    const options = {
      title: 'Take an image',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      mediaType: 'photo' as MediaType,
      includeBase64: true,
    };

    launchCamera(options, (response: ImagePickerResponse) => {
      if (response.errorCode) {
        console.log(response.errorMessage);
      } else if (response.didCancel) {
        console.log('User cancelled');
      } else {
        const path = response.assets?.[0].uri ?? '';
        setPhotoUser(path);
      }
    });
  };

  return (
    <MainContainer>
      <View>
        <Button title="Select Image" onPress={selectImage} />
        <Button title="Take picture" onPress={takePicture} />
        <Image
          style={{
            alignSelf: 'center',
            height: 200,
            width: 200,
          }}
          source={{ uri: photoUser }}
        />
      </View>
      <Button title="Next" onPress={handleGoToScreenRegisterD} />
      <Button title="Back" onPress={handleGoBack} />
    </MainContainer>
  );
}
