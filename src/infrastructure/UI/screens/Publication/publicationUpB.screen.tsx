import React, { useState, useEffect } from "react";
import { View, Text, Button, Image, ActivityIndicator } from "react-native";
import { UserEntity } from "../../../../domain/user/user.entity";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { SessionService } from "../../../services/user/session.service";
import { CRUDService } from "../../../services/user/CRUD.service";
import { PublicationEntity } from "../../../../domain/publication/publication.entity";
import { TextInput } from "react-native-gesture-handler";
import StyledTextInputs from "../../components/inputs/StyledTextInputs";
import { PublicationService } from "../../../services/publication/publication.service";

interface RouteParams {
  photoPublication?: string;
}

export default function ScreenPublicationUpB() {
  const [currentUser, setCurrentUser] = useState<UserEntity | null>(null);
  const [textPublication, setTextPublication] = useState("");
  const [loading, setLoading] = useState(true);

  const route = useRoute();
  const navigation = useNavigation();
  const { photoPublication }: RouteParams = route.params || {};

  useEffect(() => {
    setLoading(true);
    const loadPhoto = async () => {
      // Simulating image loading delay
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    };
    loadPhoto();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const getUser = async () => {
        const userId = await SessionService.getCurrentUser();
        if (userId) {
          try {
            await CRUDService.getUser(userId).then((response) => {
              setCurrentUser(response?.data);
            });
          } catch (error) {}
        }
      };
      getUser();
    }, [])
  );

  const handlePublication = async () => {
    const formData: PublicationEntity = {
      idUser: currentUser?.uuid ?? "",
      textPublication: textPublication ?? "",
      photoPublication: photoPublication ?? "",
    };
    console.log("FORM DATA:   " + JSON.stringify(formData));
    PublicationService.uploadPublication(formData)
      .then((response) => {
        console.log("QQQ" + response);
        if (response.status === 200) {
          console.log(response.data);
        } else {
          console.log("STATUS:    " + response.status);
        }
      })
      .catch((error) => {
        console.error("error: " + error);
        console.log("error.response: " + error.response);
        switch (error.response.status) {
          case 403:
            // Poner aquí el alert ...
            console.log("Error");
            break;
          case 404:
            // Poner aquí el alert ...
            console.log("Error2");
            break;
        }
      });
    navigation.navigate("HomeScreen" as never);
  };

  return (
    <View>
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <>
          <Image
            source={{ uri: photoPublication }}
            style={{ width: 200, height: 200 }}
          />
          <StyledTextInputs
            placeholder="Text Publication"
            value={textPublication}
            onChangeText={(value: React.SetStateAction<string>) =>
              setTextPublication(value)
            }
          />
          <Button title="Upload Foto" onPress={handlePublication} />
        </>
      )}
    </View>
  );
}
