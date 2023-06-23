import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, Image, FlatList } from "react-native";
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { ActivityService } from "../../services/activity/activity.service";
import { Activity } from "../../../domain/activity/activity.entity";
import { SessionService } from "../../services/user/session.service";
import CalendarScreen from "../components/calendar/calendar";
import { UserEntity } from "../../../domain/user/user.entity";
import { CRUDService } from "../../services/user/CRUD.service";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "react-native-vector-icons/Icon";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import SearchBar from "../components/searchbar/searchbar";



function CalendarEventsScreen() {
  const navigation = useNavigation();
  const [listActivities, setListActivities] = useState<Activity[]>([]);
  const [uuid, setUuid] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<UserEntity | null>(null);
  const [otherUser, setOtherUser] = useState<UserEntity | null>(null);
  const [selectedTimetable, setSelectedTimetable] = useState("My Timetable");
  const [currentPage, setCurrentPage] = useState(1);
  const [recargar, setRecargar] = useState(false);
  const [userList, setUserList] = useState<UserEntity[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<UserEntity | null>(null);
  

  useEffect(() => {
    //Obtenemos el usuario que ha iniciado sesión en la app
    const currentDate = new Date;
    currentDate.setHours(0, 0, 0, 0);
    console.log(currentDate);
    const date = currentDate.toString();
    console.log("currentDate", date);
    const fetchData = async () => {
      const userId = await SessionService.getCurrentUser();
      setUuid(userId);
      console.log("userId",userId);
      try{
        const response = await CRUDService.getPerson(userId);
        const user = response.data;
        setCurrentUser(user);
        if(selectedTimetable === "My Timetable"){
          const myScheduleResponse = await ActivityService.getMySchedule(userId, date);
          console.log("My schedule",myScheduleResponse.data);
          setListActivities(myScheduleResponse.data);
          console.log("My Activities set", user.uuid);
        }else {
          console.log("Feed de horarios de seguidores");
          console.log("Page", currentPage);
          const numPage = currentPage.toString();
          if (selectedUser && selectedUser.uuid) {
            const selectedUserActivities = await ActivityService.getMySchedule(selectedUser.uuid, date);
            setListActivities(selectedUserActivities.data);
            setCurrentPage(1);
          }else {
            const otherScheduleResponse = await ActivityService.getOtherSchedule(userId, numPage, date);
            console.log(otherScheduleResponse);
            console.log(otherScheduleResponse.data);
            setListActivities(otherScheduleResponse.data.activities);
            const response = await CRUDService.getPerson(otherScheduleResponse.data.uuid);
            const user = response.data;
            setOtherUser(user);
            console.log("Other Activities set", user.uuid);
          }          
        }        
        
      } catch (error){
        navigation.navigate("NotFoundScreen" as never); 
      }
    }
    fetchData();
  }, [selectedTimetable, currentPage, recargar, selectedUser]);
  
  const handleTimetableChange = (timetable: string) => {
    setSelectedTimetable(timetable);
  };

  const handlePageChange = (increment: number) => {
    setCurrentPage((prevPage) => prevPage + increment);
  };
  
  const handleSearchWrapper = (searchText: string) => {
    handleSearch(searchText, setUserList);
  };

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

  const handleGoToScreenUser = (uuid:string) => {
    navigation.navigate("UserScreen" as never, {uuid} as never);
    setRecargar(false);
  };

  return (
    <ImageBackground source={require('../../../../assets/visualcontent/background_8.png')} style={styles.backgroundImage}>
      <SafeAreaView style={styles.container}>
        <View style={styles.buttonsCalendar}>
          <TouchableOpacity
            style={selectedTimetable === 'My Timetable' ? styles.activeButton : styles.button}
            onPress={() => { handleTimetableChange('My Timetable'); setSelectedUser(null); }}
          >
            <Text>Own</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={selectedTimetable === 'Timetable Feed' ? styles.activeButton : styles.button}
            onPress={() => { handleTimetableChange('Timetable Feed'); setSelectedUser(null); }}
          >
            <Text>Friends</Text>
          </TouchableOpacity>
        </View>
  
        {selectedTimetable === 'My Timetable' && currentUser &&(
          <View style={styles.userCalendarContainer}>
            <TouchableOpacity onPress={() => { navigation.navigate("Profile" as never); }}>
              <View style={styles.userCalendarContainer}>
                <Image source={{ uri: currentUser.photoUser }} style={styles.image} />
                <View style={styles.user_info}>
                  <Text style={styles.user_ns}>{currentUser.nameUser} {currentUser.surnameUser}</Text>
                  <Text style={styles.user_un}>@{currentUser.appUser}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
  
        {selectedTimetable === 'Timetable Feed' && otherUser && (
          <>
            <View>
              <SearchBar onSearch={handleSearchWrapper} />
              <View>
                {userList && userList.length > 0 ? (
                  <FlatList style={styles.searchedUsersContainer}
                    data={userList}
                    renderItem={({ item }) => (
                      <TouchableOpacity style={styles.searchedUserContainer} onPress={() => handleGoToScreenUser(item.uuid)}>
                        <View style={styles.pictureAndUser}>
                          <Image
                            source={{ uri: item.photoUser }}
                            style={styles.postProfileImg}
                            resizeMode="cover"
                          />
                          <View>
                            <Text style={styles.searchedUsername}>@{item.appUser}</Text>
                            <Text style={styles.searchedNameSurname}>{item.nameUser} {item.surnameUser}</Text>
                            <Text style={styles.searchedDescription}>{item.descriptionUser}</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.uuid.toString()}
                  />
                ) : (
                  <Text style={styles.notFound}>Usuario no encontrado</Text>
                )}
              </View>
            </View>
  
            <View style={styles.userCalendarContainer}>
              {selectedUser ? (
                <TouchableOpacity onPress={() => handleGoToScreenUser(otherUser.uuid)} style={styles.userLink}>
                  <View style={styles.userCalendarContainer}>
                    <Image source={{ uri: selectedUser.photoUser }} style={styles.image} />
                    <View style={styles.userLink}>
                      <Text style={styles.user_ns}>{selectedUser.nameUser} {selectedUser.surnameUser}</Text>
                      <Text style={styles.user_un}>@{selectedUser.appUser}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => handleGoToScreenUser(otherUser.uuid)} style={styles.userLink}>
                  <View style={styles.userCalendarContainer}>
                    <Image source={{ uri: otherUser.photoUser }} style={styles.image} />
                    <View style={styles.user_info}>
                      <Text style={styles.user_ns}>{otherUser.nameUser} {otherUser.surnameUser}</Text>
                      <Text style={styles.user_un}>@{otherUser.appUser}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </>
        )}

        <View style={styles.buttonsCalendar}>
          {selectedTimetable === 'My Timetable' && (
            <TouchableOpacity onPress={() => { navigation.navigate("CreateActivity" as never); }}>
              <MaterialCommunityIcons style={{ marginLeft: 4 }} name="plus" size={28} color="#66fcf1" />
            </TouchableOpacity>
          )}
          {currentUser && currentUser.followedUser && selectedTimetable === "Timetable Feed" && currentPage > 1 && (
            <TouchableOpacity style={styles.nextPlanButton} onPress={() => { handlePageChange(-1); setSelectedUser(null); }}>
              <Text>{("Previous")}</Text>
            </TouchableOpacity>
          )}
          {currentUser && currentUser.followedUser && selectedTimetable === "Timetable Feed" && currentUser.followedUser?.length > currentPage && (
            <TouchableOpacity style={styles.nextPlanButton} onPress={() => { handlePageChange(1); setSelectedUser(null); }}>
              <Text>{("Next")}</Text>
            </TouchableOpacity>
          )}
        </View>

        <CalendarScreen activities={listActivities} uuid={uuid} />
  
        
  
      </SafeAreaView>
    </ImageBackground>
  );
  
};


const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
  },
  eventoContainer: {
    backgroundColor: 'lightblue',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  eventoText: {
    fontSize: 16,
  },
  button: {
    padding: 6,
    backgroundColor: '#66fcf1',
    borderRadius: 20,
    cursor: 'pointer',
    marginRight: 10,
    fontSize: 14,
    width: 140,
    //fontFamily: 'SFNS',
    color: 'black',
  },
  activeButton: {
    padding: 6,
    backgroundColor: 'white',
    borderRadius: 20,
    cursor: 'pointer',
    marginRight: 10,
    fontSize: 14,
    width: 140,
    //fontFamily: 'SFNS',
    color: 'black',
  },
  nextPlanButton: {
    //fontFamily: 'SFNS',
    marginTop: 6,
    paddingVertical: 6,
    backgroundColor: 'transparent',
    borderWidth: 0,
    borderRadius: 20,
    color: 'yellow',
    fontSize: 14,
    cursor: 'pointer',
    textAlign: 'center',
    alignSelf: 'center',
    marginBottom: 10,
  },
  buttonsCalendar: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  userCalendarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    height: 50,
    borderRadius: 40,
  },
  user_profileImg: {
    width: 20,
    height: 20,
    borderRadius: 20,
    marginLeft: 0,
  },
  user_calendar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0,
    height: 100,
    marginTop: 0,
    marginBottom: 0,
  },
  calendar: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 0,
    marginTop:0,
  },
  userLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchedUsername: {
    color: 'yellow',
    fontSize: 18,
    marginTop: 0,
    marginBottom: 0,
  },
  searchedNameSurname: {
    color: 'white',
    fontSize: 18,
    marginTop: 0,
    marginBottom: 0,
  },
  searchedDescription: {
    color: '#66fcf1',
    fontSize: 14,
    marginTop: 0,
    marginBottom: 0,
  },
  searchedUserContainer: {
    marginBottom: 20,
  },
  searchedUsersContainer: {
    marginLeft: 20,
    marginTop: -10,
    height: '100%',
  },
  postProfileImg: {
    width: 50,
    height: 50,
    resizeMode: 'cover',
    marginRight: 10,
    borderRadius: 50,
  },
  pictureAndUser: {
    flexDirection: 'row',
  },
  notFound: {
    color: 'white',
    fontSize: 16,
    marginTop: -10,
    marginBottom: 0,
    textAlign: 'center',
  },
  user_ns: {
    //fontFamily: 'SFNS',
    color: 'black',
    fontSize: 16,
    marginTop: 0,
    marginBottom: 0,
  },
  user_un: {
    //fontFamily: 'SFNS',
    color: 'black',
    fontSize: 14,
    marginTop: 0,
    marginBottom: 0,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 75,
    marginTop: 0,
    marginBottom: 0,
  },
  user_info: {
    flex: 1,
    fontSize: 18,
    textAlign: 'left',
    color: 'black',
    fontFamily: 'SFNS',
    marginTop: 0,
    marginLeft: 8,
    marginBottom: 2,
  },
});


export default CalendarEventsScreen;
