import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Dimensions, TouchableOpacity } from "react-native";
import { Agenda, AgendaEntry, Calendar } from "react-native-calendars";
import { endOfWeek, format, isWithinInterval, parseISO, startOfWeek } from 'date-fns';
import { Card } from "react-native-paper";
import ActivityDetailsModal from "../activityDetails/activityModal";
import { Activity } from "../../../../domain/activity/activity.entity";
import { RefreshControl } from "react-native";

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
  
  useEffect(() => {
    loadItems();
  }, []);

  const handleDayPress = (date: { dateString: string }) => {
    console.log("handleDayPress");
    const selectedDate = date.dateString;
    console.log("selectedDate", selectedDate);
    const activitiesOfWeek = activities.filter((activity) => {
      const formattedDate = format(new Date(activity.dateActivity), 'yyyy-MM-dd');
      const selectedWeekStart = startOfWeek(new Date(selectedDate));
      const selectedWeekEnd = endOfWeek(new Date(selectedDate));
      const activityDate = new Date(formattedDate);
      console.log("selectedWeekEnd", selectedWeekEnd);
      return isWithinInterval(activityDate, { start: selectedWeekStart, end: selectedWeekEnd });
    });
  
    setSelectedActivity(activitiesOfWeek.length > 0 ? activitiesOfWeek[0] : null);
  };
  
  
  const loadItems = () => {
    setTimeout(() => {
      const newItems: { [key: string]: AgendaEntry[] } = {};
      
      activities.forEach((activity) => {
        const formattedDate = format(new Date(activity.dateActivity), 'yyyy-MM-dd');
        
        if (!newItems[formattedDate]) {
          newItems[formattedDate] = [];
        }
        
        newItems[formattedDate].push({
          name: activity.nameActivity,
          height: 0,
          day: formattedDate,
        });
      });
      
      setItems(newItems);
      setIsLoading(false);
    }, 1000);
  };
  


  const renderItem = (item) => {
    console.log("renderItem", items);
   
      return (
        <TouchableOpacity style={styles.item} onPress={() => setSelectedActivity(activities[0])}>
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
        <Text>Cargando...</Text> // Mostrar indicador de carga o mensaje
      ) : (
        <Agenda
          items={items}
          loadItemsForMonth={loadItems}
          renderItem={renderItem}
          //selected={'2023-06-20'}
          showOnlySelectedDayItems={true}
          refreshControl={<RefreshControl refreshing={false} />} 
          showClosingKnob={true}
          refreshing={false}
          //onDayPress={handleDayPress}
          style={styles.agenda}
        />
      )}
      

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
