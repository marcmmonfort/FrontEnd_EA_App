import { View, Text, ImageBackground, StyleSheet } from "react-native";
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { ActivityService } from "../../services/activity/activity.service";
import { Activity } from "../../../domain/activity/activity.entity";
import { SessionService } from "../../services/user/session.service";
import React from "react";
import Agenda from "../components/calendar/calendar";
import CalendarScreen from "../components/calendar/calendar";


function CalendarEventsScreen() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentUser, setCurrentUser] = useState<string>(""); 

  useEffect(() => {
    //Obtenemos el usuario que ha iniciado sesión en la app
    
    const fetchData = async () => {
      const userId = await SessionService.getCurrentUser();
      setCurrentUser(userId);
      
      if(userId){
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        console.log(currentDate);
        const date = currentDate.toString();
        const myScheduleResponse = await ActivityService.getMySchedule(userId, date);
        console.log(myScheduleResponse);
        if(myScheduleResponse){
          setActivities(myScheduleResponse.data);
        }
      }
      
    }
    fetchData();
    
  }, []);
  

  return (
    <ImageBackground source={require('../../../../assets/visualcontent/background_8.png')} style={styles.backgroundImage}>
      <SafeAreaView style={styles.container}>
        <CalendarScreen activities={activities} uuid={currentUser}/>
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
});

export default CalendarEventsScreen;
