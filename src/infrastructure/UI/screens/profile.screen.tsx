import { SessionService } from "../../services/user/session.service";
import { UserEntity } from "../../../domain/user/user.entity";
import { useFocusEffect } from "@react-navigation/native";
import { CRUDService } from "../../services/user/CRUD.service";
import React, { useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function ProfileScreen() {
  const [currentUser, setCurrentUser] = useState<UserEntity | null>(null);
  const navigation = useNavigation();
  useFocusEffect(
    React.useCallback(() => {
      const getUser = async () => {
        const userId = await SessionService.getCurrentUser();
        //console.log("BBBBBBBBBBBB:  "+userId);
        if (userId) {
          try {
            await CRUDService.getUser(userId).then((response) => {
              //console.log("Punto 1:"+response);
              //console.log(response?.data);
              setCurrentUser(response?.data);
            });
          } catch (error) {
            //console.log("Encontre el id pero no va")
          }
        }
      };
      getUser();
    }, [])
  );
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.text}>Profile</Text>
      </View>
      <View style={styles.profileContour}>
        {currentUser && (
          <View style={styles.profileContainer}>
            <View style={styles.profile}>
              <Text style={styles.profileUserName}>
                {currentUser.appUser} Hola
              </Text>
              <View style={styles.profileImage}>
                <Image
                  source={{ uri: currentUser.photoUser }}
                  style={{width:200,height:200,borderRadius:200/2}}
                />
              </View>
              <View style={styles.profileUserButtons}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("EditUser" as never);
                    // Acción al presionar el botón de Editar perfil
                  }}
                  style={styles.buttonProfile}
                >
                  <Text style={styles.text}>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    // Acción al presionar el botón de Configuración
                  }}
                  style={styles.buttonProfile}
                >
                  <Text style={styles.text}>Settings</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.profileStats}>
                <Text style={styles.text}>Followers</Text>
                <TouchableOpacity
                  style={styles.profileStatCount}
                  onPress={() => {}}
                >
                  <Text>{currentUser.followersUser?.length}</Text>
                </TouchableOpacity>
                <Text style={styles.text}>Following</Text>
                <TouchableOpacity
                  style={styles.profileStatCount}
                  onPress={() => {}}
                >
                  <Text>{currentUser.followedUser?.length}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.profileBio}>
                <Text style={styles.profileTitle}>Name</Text>
                <Text>
                  <Text style={styles.profileRealName}>
                    {currentUser.nameUser}
                  </Text>
                </Text>
                <Text style={styles.profileTitle}>Description</Text>
                <Text>{currentUser.descriptionUser}</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },

  profileImgCard:{},
  titleContainer: {
    marginBottom: 20,
  },
  titleSection: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
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
    fontWeight: "bold",
    color: "#000",
    marginTop: 12,
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  profileUserButtons: {
    flexDirection: "row",
    marginBottom: 20,
  },
  buttonProfile: {
    margin: 4,
    padding: 6,
    backgroundColor: "#000",
    borderRadius: 20,
    color: "#66fcf1",
    fontSize: 14,
    width: 100,
    textAlign: "center",
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
  profileStatCount: {

  },
  profileBio: {
    alignItems: "center",
    justifyContent: "center",
  },
  profileRealName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
});