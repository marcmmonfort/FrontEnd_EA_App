import { SessionService } from "../../services/user/session.service";
import { UserEntity } from "../../../domain/user/user.entity";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { CRUDService } from "../../services/user/CRUD.service";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";

interface RouteParams {
    userId?: string;
    mode?: string;
  }

  export default function UsersList() {
    const route = useRoute();
    const {
        userId, mode
      }: RouteParams = route.params || {};
    const [currentUser, setCurrentUser] = useState<UserEntity | null>(null);
    const [userList, setUserList] = useState([]);
    const [numPage, setNumPage] = useState(1); // Variable para el número de página
    const navigation = useNavigation();

    const isFollowersMode = mode === "followers";
    const title = isFollowersMode ? "Followers" : "Following";

  useEffect(() => {
    if (userId) {
      loadUserList();
      loadUser();
    }

    return () => {
      // Restaurar el estilo de fondo al salir del componente
      document.body.style.backgroundImage = "";
    };
  }, [numPage]);

  const loadUser = async () => {
    try {
      const response = await CRUDService.getUser(userId ?? 'NoID');
      console.log(userId)
      setCurrentUser(response?.data);
      console.log("Obtenemos los datos del otro usuario: exito");
    } catch (error) {
      navigation.navigate("ProfileScreen" as never);
      console.log("Obtenemos los datos del otro usuario: mal");
      console.error(error);
    }
  };

  const loadUserList = () => {
    // Obtener la lista de usuarios según el modo y el número de página
    if (isFollowersMode) {
      CRUDService.getFollowers(userId, numPage.toString())
        .then(response => {
          console.log(response);
          console.log(response?.data);
          setUserList(prevUserList => [...prevUserList, ...response?.data] as never);
        })
        .catch(error => {
            navigation.navigate("ProfileScreen" as never);
        });
    } else {
        CRUDService.getFollowed(userId, numPage.toString())
        .then(response => {
          console.log(response);
          console.log(response?.data);
          setUserList(prevUserList => [...prevUserList, ...response?.data] as never);
        })
        .catch(error => {
          navigation.navigate("ProfileScreen" as never);
        });
    }
  };

  const handleLoadMore = () => {
    console.log("entro al load more");
    setNumPage(prevNumPage => prevNumPage + 1); // Aumentar el número de página al hacer clic en "Obtener más"
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.userList}>
        {userList.length > 0 ? (
          <ScrollView>
            {userList.map((user:UserEntity) => (
              <TouchableOpacity key={user.uuid} style={styles.userCard} onPress={() => navigation.navigate("UserScreen" as never, {userId: user.uuid} as never)}>
                {user.photoUser ? (
                        <Image
                          source={{ uri: user.photoUser }}
                          style={styles.profileImage}
                        />
                      ) : (
                        <Image
                          source={{ uri: "https://pbs.twimg.com/profile_images/1354463303486025733/Bn-iEeUO_400x400.jpg" }}
                          style={styles.profileImage}
                        />
                      )}
                <View style={styles.userInfo}>
                  <Text style={styles.userName}> {user.nameUser} {user.surnameUser} </Text>
                  <Text style={styles.username}>@{user.appUser}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.notFoundText}>User Not Found</Text>
        )}
        {currentUser?.followersUser?.length !== undefined && currentUser.followersUser.length > numPage * 2 ? (
          <TouchableOpacity style={styles.loadMoreButton} onPress={handleLoadMore}>
            <Text style={styles.loadMoreButtonText}>Load More</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.loadMoreButtonDisabled} disabled>
            <Text style={styles.loadMoreButtonText}>Load More</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
    header: {
      marginBottom: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: "#000",
    },
    userList: {
      flex: 1,
    },
    userCard: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },
    profileImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginRight: 8,
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: 16,
      fontWeight: "bold",
    },
    username: {
      fontSize: 14,
      color: "#888",
    },
    notFoundText: {
      fontSize: 16,
      color: "#888",
      textAlign: "center",
    },
    loadMoreButton: {
      backgroundColor: "#66fcf1",
      borderRadius: 20,
      paddingVertical: 8,
      paddingHorizontal: 16,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
    },
    loadMoreButtonText: {
      color: "#000",
      fontSize: 14,
    },
    loadMoreButtonDisabled: {
      backgroundColor: "#ccc",
      borderRadius: 20,
      paddingVertical: 8,
      paddingHorizontal: 16,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 16,
    },
  });
