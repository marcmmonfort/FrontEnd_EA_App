import React, { useState } from "react";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { UserEntity } from "../../../domain/user/user.entity";
import { CRUDService } from "../../services/user/CRUD.service";
import { SessionService } from "../../services/user/session.service";
import { StyleSheet, Text, View, Image, TouchableOpacity, Button, FlatList } from "react-native";

interface RouteParams {
    uuid: string
}

export default function UserScreen() {

    const [currentUser, setCurrentUser] = useState<UserEntity | null>(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [myId, setMyId] = useState("1234");
    const route = useRoute()
    const routeParams = route.params as RouteParams | undefined;
    const uuid = routeParams?.uuid;
    const navigation = useNavigation();

    useFocusEffect(
        React.useCallback(() => {
          console.log("Iniciamos feed");
          const fetchData = async () => {
            const userId = await SessionService.getCurrentUser();
            setMyId(userId);
            if (userId) {
              try {
                const response = await CRUDService.getUser(uuid??"");
                console.log("Punto 1:", response);
                console.log(response?.data);
                setCurrentUser(response?.data);
              } catch (error) {
                console.log("Encontre el id pero no va")
              }

              try {
                const response = await CRUDService.isFollowed(userId, uuid?? "");
                console.log("Punto 1:", response);
                console.log(response?.data);
                setIsFollowing(response?.data);
              } catch (error) {
                console.log("Encontre el id pero no va")
              }
            }
          };
          fetchData();
        }, [uuid])
    );

    const handleFollow = async () => {
        
        // Aquí implemento la lógica para seguir o dejar de seguir al usuario
        console.log("Este usuario es seguir tuyo?:" + isFollowing);
        if(isFollowing){
            try {
                const response = await CRUDService.removeFollowed(myId, uuid ?? 'NoID');
                console.log("Pedimos la relacion que tenemos con ese user:: exito");
                console.log(response);
                if(response){
                    setIsFollowing(false);
                }
                else{
                    alert("Algo ha ido mal al borrar el followed")
                }
                
            } catch (error) {
                console.log("Pedimos la relacion que tenemos con ese user:: mal");
                console.error(error);
            }
        }else{
            try {
                const response = await CRUDService.addFollowed(myId, uuid ?? 'NoID');
                console.log("Pedimos la relacion que tenemos con ese user:: exito");
                console.log(response);
                if(response){
                    setIsFollowing(true);
                }
                else{
                    alert("Algo ha ido mal al añadir el followed")
                }
            } catch (error) {
                console.log("Pedimos la relacion que tenemos con ese user:: mal");
                console.error(error);
            }
        }
    };


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
          <TouchableOpacity
                onPress={handleFollow}
                style={isFollowing ? styles.followingButton : styles.followButton}
            >
                <Text>{isFollowing ? "Following" : "Follow"}</Text>
            </TouchableOpacity>
        </View>
    );  

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#ffffff",
      alignItems: "center",
      justifyContent: "center",
    },
    text: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#000",
    },
    followingButton: {
        backgroundColor: "green",
        padding: 10,
        borderRadius: 5,
      },
    
      followButton: {
        backgroundColor: "blue",
        padding: 10,
        borderRadius: 5,
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
  })

