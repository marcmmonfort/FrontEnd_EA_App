import { SessionService } from "../../services/user/session.service";

import { useFocusEffect } from "@react-navigation/native";
import { CRUDService } from "../../services/user/CRUD.service";
import React, { useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, Button, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserEntity } from "../../../domain/user/user.entity";
import SearchBar from "../components/searchbar/searchbar";

export default function DiscoveryScreen() {

  const navigation = useNavigation();
  const [currentUser, setCurrentUser] = useState<UserEntity | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [userList, setUserList] = useState<UserEntity[] | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      const getUser = async () => {
        const userId = await SessionService.getCurrentUser();
        console.log("ID of the Logged User:" + userId);
        if (userId) {
          try {
            await CRUDService.getUser(userId)
            .then((response) => {
              console.log("Punto 1: " + response);
              console.log(response?.data);
              setCurrentUser(response?.data);
            })
          } catch (error) {
            console.log("Error: " + error);
          }
        }
      };
      getUser();
    }, [])
  );

  const handleSearch = async (query: string, setUserList: (users: UserEntity[]) => void) => {
    console.log('He entrado en handleSearch.');
    if (query.length > 0) {
      try {
        const response = await CRUDService.searchUsers(query);
        console.log(response);
        setUserList(response?.data);
        console.log('He hecho el servicio de handleSearch.');
        console.log('>> Lista de usuarios: ' + userList);
      } catch (error) {
        console.error(error);
      }
    } else {
      try {
        const response = await CRUDService.getUsers();
        setUserList(response?.data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleSearchWrapper = (searchText: string) => {
    handleSearch(searchText, setUserList);
  };
  
  return (
    <View>
      <SearchBar onSearch={handleSearchWrapper} />

      <View style={styles.cardsUsers}>
        {userList && userList.length > 0 ? (
          <FlatList data={userList} renderItem={({ item }) => ( 
            <View>
              <Text>{item.nameUser} {item.surnameUser}</Text> 
              <Text>@{item.appUser}</Text> 
            </View> 
          )} keyExtractor={(item) => item.uuid.toString()} />
        ) : (
          <Text style={styles.usersNotFound}>User Not Found</Text>
        )}
      </View>
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
  cardsUsers: {},
  userLink: {},
  user: {},
  userProfileImg: {},
  profileImgCard: {},
  userInfo: {},
  userName: {},
  userUsername: {},
  usersNotFound: {},
});