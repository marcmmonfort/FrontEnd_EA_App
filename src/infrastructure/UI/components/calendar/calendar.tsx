import React, { useState } from "react";
import { View, StyleSheet, Text, Dimensions, TouchableOpacity } from "react-native";
import { Agenda, AgendaEntry, Calendar } from "react-native-calendars";
import { format, parseISO } from 'date-fns';
import { Card } from "react-native-paper";
import ActivityDetailsModal from "../activityDetails/activityModal";
import { Activity } from "../../../../domain/activity/activity.entity";

const windowWidth = Dimensions.get("window").width;

interface CalendarProps {
  activities: Activity[];
  uuid: string;
}

interface CustomAgendaSchedule {
  [date: string]: AgendaEntry[];
}

const CalendarScreen = ({ activities, uuid }: CalendarProps) => {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const handleDayPress = (date: { dateString: string }) => {
    const clickedActivity = activities.find(
      (activity) => format(parseISO(activity.dateActivity.toDateString()), 'yyyy-MM-dd') === date.dateString
    );
    if (clickedActivity) {
      setSelectedActivity(clickedActivity);
    } else {
      setSelectedActivity(null);
    }
  };
  

  const renderItem = (reservation: AgendaEntry, isFirst: boolean) => {
    const item: Activity | undefined = activities.find(
      (activity) => format(activity.dateActivity, 'yyyy-MM-dd') === reservation.day
    );
  
    if (item) {
      console.log("item found");
      return (
        <TouchableOpacity style={styles.item} onPress={() => setSelectedActivity(item)}>
          <Card>
            <Card.Content>
              <View>
                <Text>{item.nameActivity}</Text>
              </View>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      );
    }
    console.log("item found");
    return <View style={styles.item}>No hay actividades</View>;
  };
  

  const convertedAgendaItems = activities.reduce((items, activity) => {
    const formattedDate = format(parseISO(activity.dateActivity.toDateString()), 'yyyy-MM-dd');

    console.log(formattedDate);
    if (items[formattedDate]) {
      items[formattedDate].push({
        name: activity.nameActivity,
        height: 0,
        day: formattedDate,
      });
    } else {
      items[formattedDate] = [{
        name: activity.nameActivity,
        height: 0,
        day: formattedDate,
      }];
    }

    return items;
  }, {} as CustomAgendaSchedule);

  return (
    <View style={styles.container}>
      <Agenda
        items={convertedAgendaItems}
        renderItem={renderItem}
        onDayPress={handleDayPress}
        showClosingKnob={true}
        refreshing={false}
        style={styles.agenda}
      />

      {selectedActivity && (
        <ActivityDetailsModal
          activity={selectedActivity}
          onClose={() => setSelectedActivity(null)}
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
  agenda: {
    width: windowWidth,
  },
  item: {
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
});

export default CalendarScreen;
