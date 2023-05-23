import { SessionService } from "../../services/user/session.service";
import { UserEntity } from "../../../domain/user/user.entity";
import { useFocusEffect } from "@react-navigation/native";
import { CRUDService } from "../../services/user/CRUD.service";
import React, { useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
export default function ProfileScreen() {
  const [currentUser, setCurrentUser] = useState<UserEntity | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      const getUser = async () => {
        const userId = await SessionService.getCurrentUser();
        console.log("BBBBBBBBBBBB:  "+userId);
        if (userId) {
          try {
            await CRUDService.getUser(userId)
            .then((response) => {
              console.log("Punto 1:"+response);
              console.log(response?.data.response);
              setCurrentUser(response?.data.response);
            })
          } catch (error) {
            console.log("Encontre el id pero no va")
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
              <Text style={styles.profileUserName}>{currentUser.appUser} Hola</Text>
              <View style={styles.profileImage}>
                <Image
                  source={{ uri: currentUser.photoUser }}
                  style={styles.profileImgCard}
                />
              </View>
              <View style={styles.profileUserButtons}>
                <TouchableOpacity
                  onPress={() => {
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
                <Text style={styles.profileStatCount}>
                  {currentUser.followersUser?.length}
                </Text>
                <Text style={styles.text}>Following</Text>
                <Text style={styles.profileStatCount}>
                  {currentUser.followedUser?.length}
                </Text>
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
  titleContainer: {},
  titleSection: {},
  profileContour: {},
  profileContainer: {},
  profile: {},
  profileUserName: {},
  profileImage: {},
  profileImgCard: {},
  profileUserButton: {},
  profileUserButtons: {},
  buttonProfile: {},
  profileStats: {},
  profileTitle: {},
  profileStatCount: {},
  profileBio: {},
  profileRealName: {},
});
