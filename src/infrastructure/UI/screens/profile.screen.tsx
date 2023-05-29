import { SessionService } from "../../services/user/session.service";
import { UserEntity } from "../../../domain/user/user.entity";
import { useFocusEffect } from "@react-navigation/native";
import { CRUDService } from "../../services/user/CRUD.service";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity,Button, ImageBackground, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

async function loadFonts() {
  await Font.loadAsync({
    'Rafaella': require('../../../../assets/fonts/Rafaella.ttf'),
    'SFNS': require('../../../../assets/fonts/SFNS.otf'),
  });
}

export default function ProfileScreen() {
  const [currentUser, setCurrentUser] = useState<UserEntity | null>(null);
  const [photoUser, setPhotoUser] = useState("");
  const [auxPhotoUser, setAux] = useState("");
  const [loading, setLoading] = useState(false);
  const [cam, setCam] = useState(false);
  let CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/diuyzbt14/upload";
  const navigation = useNavigation();

  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts().then(() => {
      setFontsLoaded(true);
    });
  }, []);

  const titleFont = Platform.select({
    ios: 'Rafaella',
    android: 'Rafaella',
  });
  const bodyFont = Platform.select({
    ios: 'SFNS',
    android: 'SFNS',
  });

  const logOutButtonFunction = async () => {
    try {
      const nothing = "";
      AsyncStorage.setItem('token', nothing);
      navigation.navigate('LoginScreen' as never);
    } catch (error) {
      console.error("Error deleting the token: ", error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const getUser = async () => {
        const userId = await SessionService.getCurrentUser();
        if (userId) {
          try {
            await CRUDService.getUser(userId).then((response) => {
              setCurrentUser(response?.data);
            });
          } catch (error) {
            console.error("Error retrieving user:", error);
          }
        }
      };
      getUser();
    }, [])
  );

  
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    marginBottom: 20,
  },
  profileContour: {
    alignItems: "center",
    justifyContent: "center",
  },
  profileContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  profile: {
    alignItems: "center",
    justifyContent: "center",
  },
  profileUserName: {
    fontSize: 28,
    textAlign: 'center',
    fontFamily: bodyFont,
    color: "#66fcf1",
    marginRight: 4,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginTop: 20,
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 75,
  },
  profileUserButtons: {
    marginBottom: 0,
    marginTop:20,
    flexDirection: "row",
  },
  buttonForChanges: {
    marginRight: 4,
    marginLeft: 4,
    padding: 6,
    backgroundColor: "#66fcf1",
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignSelf: "center",
    alignContent: "center",
    alignItems: 'center',
  },
  insideButtonForChanges: {
    flexDirection: "row",
  },
  buttonLogOut: {
    justifyContent: 'center',
    alignSelf: "center",
    marginTop:10,
  },
  buttonText: {
    textAlign: 'center',
    fontFamily: bodyFont,
    fontSize: 16,
    color: '#000',
    marginTop: 0,
    marginBottom: 0,
  },
  profileStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  profileTitle: {
    fontSize: 12,
    marginBottom: -10,
  },
  profileStatCountLeft: {
    marginRight: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  profileStatCountRight: {
    alignItems: "center",
    justifyContent: "center",
  },
  textFoll: {
    fontSize: 14,
    fontFamily: bodyFont,
    color: "yellow",
  },
  numFoll: {
    fontFamily: bodyFont,
    fontSize: 26,
    color: '#66fcf1',
  },
  titleNameDescription: {
    fontSize: 14,
    fontFamily: bodyFont,
    color: "white",
  },
  textNameDescription: {
    fontSize: 22,
    fontFamily: bodyFont,
    color: "#66fcf1",
    marginBottom: 10,
  },
  profileBio: {
    alignItems: "center",
    justifyContent: "center",
  },
  profileRealName: {
    fontSize: 16,
    fontFamily: bodyFont,
    marginBottom: 10,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  usernameAndVerified: {
    flexDirection: "row",
    alignItems: 'center',
  },
  iconVerified: {
    marginTop: 2,
  }
});
  
  return (
    <ImageBackground source={require('../../../../assets/visualcontent/background_8.png')} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.profileContour}>
          {currentUser && (
            <View style={styles.profileContainer}>
              <View style={styles.profile}>
                <View style={styles.usernameAndVerified}>
                  <Text style={styles.profileUserName}>{currentUser.appUser}</Text>
                  <MaterialCommunityIcons style={styles.iconVerified} color="#3897f0" name="check-circle" size={18} />
                </View>
                <View style={styles.profileUserButtons}>
                  <TouchableOpacity onPress={() => {navigation.navigate("Edit" as never);}} style={styles.buttonForChanges}>
                    <View style={styles.insideButtonForChanges}>
                      <MaterialCommunityIcons color="black" name="pencil" size={18} />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => {}} style={styles.buttonForChanges}>
                    <View style={styles.insideButtonForChanges}>
                      <MaterialCommunityIcons color="black" name="cog" size={18} />
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={styles.profileImage}>
                  <Image source={{ uri: currentUser.photoUser }} style={styles.image}/>
                </View>
                <View style={styles.profileStats}>
                  <TouchableOpacity style={styles.profileStatCountLeft} onPress={() => {navigation.navigate("UsersList" as never, { userId: currentUser.uuid, mode: "followers"} as never);}}>
                    <Text style={styles.numFoll}>{currentUser.followersUser?.length}</Text>
                    <Text style={styles.textFoll}>Followers</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.profileStatCountRight} onPress={() => {navigation.navigate("UsersList" as never, { userId: currentUser.uuid, mode: "following"} as never);}}>
                    <Text style={styles.numFoll}>{currentUser.followedUser?.length}</Text>
                    <Text style={styles.textFoll}>Following</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.profileBio}>
                  <Text style={styles.titleNameDescription}>Name</Text>
                  <Text style={styles.textNameDescription}>{currentUser.nameUser}</Text>
                  <Text style={styles.titleNameDescription}>Description</Text>
                  <Text style={styles.textNameDescription}>{currentUser.descriptionUser}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.buttonLogOut} onPress={logOutButtonFunction}>
                <MaterialCommunityIcons color="#3897f0" name="logout" size={24} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </ImageBackground>

  );
}

