import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Dimensions, TouchableOpacity } from "react-native";
import { Agenda, AgendaEntry, Calendar } from "react-native-calendars";
import { endOfWeek, format, isWithinInterval, parseISO, startOfWeek } from 'date-fns';
import { Card } from "react-native-paper";
import ActivityDetailsModal from "../activityDetails/activityModal";
import { Activity } from "../../../../domain/activity/activity.entity";
import { RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";

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
  const [items, setItems] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();
  
  useEffect(() => {
    loadItems();
  }, [activities]);
  

  const sortActivitiesByStartTime = (activities: Activity[]) => {
    return activities.sort((a, b) => {
      const startTimeA = a.hoursActivity[0].split(":");
      const startTimeB = b.hoursActivity[0].split(":");
  
      const hourA = parseInt(startTimeA[0]);
      const hourB = parseInt(startTimeB[0]);
  
      if (hourA !== hourB) {
        return hourA - hourB;
      }
  
      const minuteA = parseInt(startTimeA[1]);
      const minuteB = parseInt(startTimeB[1]);
  
      return minuteA - minuteB;
    });
  };
  
  
  const loadItems = () => {
    setTimeout(() => {
      const newItems: { [key: string]: AgendaEntry[] } = {};

      const sortedActivities = sortActivitiesByStartTime(activities);
      console.log(sortedActivities);
      
      sortedActivities.forEach((activity) => {
        const formattedDate = format(new Date(activity.dateActivity), 'yyyy-MM-dd');
        
        if (!newItems[formattedDate]) {
          newItems[formattedDate] = [];
        }
        const name = activity.nameActivity + "\n" + activity.hoursActivity[0].toString() + " - " + activity.hoursActivity[1].toString();
        
        newItems[formattedDate].push({
          name: name,
          height: 0,
          day: formattedDate,
        });
      });
      

      setItems(newItems);
      setIsLoading(false);
    }, 1000);
  };
  
  const handleActivityPress = (uuid: string) => {
    console.log("activity id", uuid);
    navigation.navigate("Activity" as never, {uuid} as never)
  };


  const renderItem = (item: AgendaEntry) => {

    const nameParts = item.name.split("\n");
    const activityName = nameParts[0];
    const matchingActivity = activities.find(activity => activity.nameActivity === activityName);

    
      return (
        <TouchableOpacity style={styles.item} onPress={() => handleActivityPress(matchingActivity.uuid)}>
          <Card>
            <Card.Content>
              <View>
                <Text>{item.name}</Text>
              </View>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      );
  }
  
  return (
    <View style={styles.container}>
      {isLoading ? ( // Verificar isLoading
        <Text>Loading...</Text> // Mostrar indicador de carga o mensaje
      ) : (
        <React.Fragment>
          {items ? (
            <View style={styles.container}>
              <Agenda
                items={items}
                loadItemsForMonth={loadItems}
                renderItem={renderItem}
                showOnlySelectedDayItems={true}
                refreshControl={<RefreshControl refreshing={false} />}
                showClosingKnob={true}
                refreshing={false}
                renderEmptyData={() => (
                  <View style={styles.emptyDataContainer}>
                    <Text>No activities...</Text>
                  </View>
                )}
                style={styles.agenda}
              />
 
              {selectedActivity && (
                <ActivityDetailsModal
                  activity={selectedActivity}
                  onClose={() => setSelectedActivity(null)}
                />
              )}
            </View>
          ) : (
            <Text>No hay actividades</Text>
          )}
        </React.Fragment>
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
  emptyDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
 
export default CalendarScreen;
