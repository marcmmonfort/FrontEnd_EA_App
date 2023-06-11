import React, { useState } from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import { Agenda, AgendaEntry, AgendaSchedule, Calendar } from "react-native-calendars";
import ActivityDetailsModal from "../activityDetails/activityModal";
import { Activity, ActivityEntity } from "../../../../domain/activity/activity.entity";

const windowWidth = Dimensions.get("window").width;

interface CalendarProps {
  activities: Activity[];
  uuid: string; 
}


const CalendarScreen = ({activities, uuid}: CalendarProps) => {
  
  
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [listActivity, setListActivity] = useState<Activity[]>(activities);
  console.log("estamos en la componente:", listActivity)

  const handleDayPress = (date: { dateString: string }) => {
    const clickedActivity = listActivity.find(
      (activity) => activity.dateActivity.toISOString().split("T")[0] === date.dateString
    );
    if (clickedActivity) {
      setSelectedActivity(clickedActivity);
    } else {
      setSelectedActivity(null);
    }
  };
  

  const closeActivityDetails = () => {
    setSelectedActivity(null);
  };

  const agendaItems: { [date: string]: Activity[] } = {};
  activities.forEach((activity) => {
    const dateKey = activity.dateActivity.toISOString().split("T")[0];
    if (!agendaItems[dateKey]) {
      agendaItems[dateKey] = [];
    }
    agendaItems[dateKey].push(activity);
  });

  const convertToAgendaEntry = (activities: Activity[]): AgendaEntry[] => {
    return activities.map((activity) => ({
      day: activity.dateActivity.toISOString().split("T")[0],
      name: activity.nameActivity,
      height: 50, // Ajusta la altura según tus necesidades
      // Otros campos necesarios en la estructura de AgendaEntry
    }));
  };

  const convertedAgendaItems: AgendaSchedule = {};
  Object.entries(agendaItems).forEach(([date, activities]) => {
    convertedAgendaItems[date] = convertToAgendaEntry(activities);
  });


  const renderItem = (reservation: AgendaEntry, isFirst: boolean) => {
    return (
      <View style={styles.activityItem}>
        {/* Aquí puedes personalizar cómo se muestra cada actividad dentro del calendario */}
        {/* Ejemplo */}
        <Text>{reservation.name}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Agenda
        items={convertedAgendaItems} // Aquí puedes proporcionar los datos de tus actividades en el formato requerido por el componente Agenda
        renderItem={renderItem}
        onDayPress={handleDayPress}
        style={styles.agenda}
        // Aquí puedes personalizar los estilos y configuraciones del calendario
      />
      
      {selectedActivity && (
        <ActivityDetailsModal
          activity={selectedActivity}
          onClose={closeActivityDetails}
        />
      )}
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
  activityItem: {
    marginBottom: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "lightblue",
    borderRadius: 5,
  },
  agenda: {
    width: windowWidth,
  }
});

export default CalendarScreen;
