import { SessionService } from "../../services/user/session.service";
import { Link } from "react-router-dom";
import { UserEntity } from "../../../domain/user/user.entity";
import { useFocusEffect } from "@react-navigation/native";
import { CRUDService } from "../../services/user/CRUD.service";
import React, { useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
export default function ProfileScreen() {
  const [currentUser, setCurrentUser] = useState<UserEntity | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      const getUser = async () => {
        const userId = SessionService.getCurrentUser();

        if (userId) {
          CRUDService.getUser(await userId)
            .then((response) => {
              console.log(response);
              console.log(response.data);
              setCurrentUser(response.data);
            })
            .catch((error) => {});
        }
      };
      getUser();
    }, [])
  );
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleSection}>Profile</Text>
      </View>
      <View style={styles.profileContour}>
        {currentUser && (
          <View style={styles.profileContainer}>
            <View style={styles.profile}>
              <Text style={styles.profileUserName}>{currentUser.appUser}</Text>
              <View style={styles.profileImage}>
                <Image
                  source={{ uri: currentUser.photoUser }}
                  style={styles.profileImgCard}
                />
              </View>
              <View style={styles.profileUserButtons}>
                <Link to="/profile/edituser" style={styles.buttonProfile}>
                  Edit Profile
                </Link>
                <Link to="/profile/settings" style={styles.buttonProfile}>
                  Settings
                </Link>
              </View>
              <View style={styles.profileStats}>
                <Text style={styles.profileTitle}>Followers</Text>
                <Text style={styles.profileStatCount}>
                  {currentUser.followersUser?.length}
                </Text>
                <Text style={styles.profileTitle}>Following</Text>
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
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
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
