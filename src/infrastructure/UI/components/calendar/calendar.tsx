import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";
import ActivityDetailsModal from "../activityDetails/activityModal";
import { Activity } from "../../../../domain/activity/activity.entity";

const CalendarScreen = () => {
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [listActivity, setListActivity] = useState<Activity[]>([]);

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

  return (
    <View style={styles.container}>
      <Calendar onDayPress={handleDayPress} />
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
});

export default CalendarScreen;
