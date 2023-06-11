import { View, Text, ImageBackground, StyleSheet } from "react-native";
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { ActivityService } from "../../services/activity/activity.service";
import { Activity } from "../../../domain/activity/activity.entity";
import { SessionService } from "../../services/user/session.service";
import React from "react";
import Agenda from "../components/calendar/calendar";


function CalendarEventsScreen() {
  const [actividades, setActividades] = useState<Activity[]>([]);
  const [currentUser, setCurrentUser] = useState<string>(""); 

  useEffect(() => {
    //Obtenemos el usuario que ha iniciado sesión en la app
    const fetchData = async () => {
      setCurrentUser(await SessionService.getCurrentUser());

      //Pedimos el horario de la semana del usuario logeado
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      console.log(currentDate);
      const date = currentDate.toString();
      const myScheduleResponse = await ActivityService.getMySchedule(currentUser, date);
      if(myScheduleResponse){
        setActividades(myScheduleResponse.data);
      }
    }
    fetchData();
    
  }, []);
  

  return (
    <ImageBackground source={require('../../../../assets/visualcontent/background_8.png')} style={styles.backgroundImage}>
      <SafeAreaView style={styles.container}>
        <Agenda></Agenda>
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
