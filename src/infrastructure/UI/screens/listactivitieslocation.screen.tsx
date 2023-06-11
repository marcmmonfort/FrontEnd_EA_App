import { SessionService } from "../../services/user/session.service";
import { UserEntity } from "../../../domain/user/user.entity";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { CRUDService } from "../../services/user/CRUD.service";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRef } from "react";
import { Platform } from "react-native";
import { ImageBackground} from 'react-native';
import { Callout, Marker } from "react-native-maps";
import MapView from 'react-native-maps';
import { LocationEntity } from "../../../domain/location/location.entity";
import SearchBar from "../components/searchbar/searchbar";
import * as Font from 'expo-font';
import * as Location from 'expo-location';
import { LocationService } from "../../../infrastructure/services/location/location.service";
import { ActivityService } from "../../../infrastructure/services/activity/activity.service";
import { ActivityEntity } from "../../../domain/activity/activity.entity";

interface RouteParams {
    uuid?: string;
}

async function loadFonts() {
    await Font.loadAsync({
      'Rafaella': require('../../../../assets/fonts/Rafaella.ttf'),
      'SFNS': require('../../../../assets/fonts/SFNS.otf'),
    });
  }

export default function ActivitiesLocationList() {
    const navigation = useNavigation();
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const route = useRoute();
    const {
        uuid
      }: RouteParams = route.params || {};
    const [activities, setActivities] = useState<ActivityEntity[]>([]);

    const obtainActivitiesLocation = async () => {
        if (uuid){
            try {
                const response = await ActivityService.getActivitiesOfALocation(uuid);
                if (response) {
                  const activities = response.data as ActivityEntity[];
                  setActivities(activities);
                } else {
                  console.error('Error fetching activities: Response is undefined');
                }
            } catch (error) {
            console.error('Error fetching activities:', error);
            }
        }
    };

    useEffect(() => {
        obtainActivitiesLocation();
        loadFonts().then(() => {
          setFontsLoaded(true);
        });
      }, []);
    
      const titleFont = Platform.select({
        ios: 'Rafaella',
        android: 'Rafaella',
      });
      const bodyFont = Platform.select({
        ios: 'SFNS',
        android: 'SFNS',
      });

    React.useLayoutEffect(() => {
        navigation.setOptions({
        headerTitle: 'List of Activities',
          headerStyle: { backgroundColor: '#000000', borderBottomWidth: 0, shadowOpacity: 0 }, 
          headerTitleStyle: { color: '#66fcf1', fontSize: 30 }
        });
      }, [navigation]);

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "transparent",
        alignItems: "center",
        justifyContent: "center",
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    text_activity_name: {
        color: 'white',
        fontFamily: titleFont,
        fontSize: 24,
        paddingTop: 6,
        marginBottom: 0,
    },
    });

    return (
        <ImageBackground source={require('../../../../assets/visualcontent/background_8.png')} style={styles.backgroundImage}>
            <View style={styles.container}>
            {activities.length > 0 ? (
                activities.map((activity) => (
                <View key={activity.uuid}>
                    <Text style={styles.text_activity_name}>{activity.nameActivity}</Text>
                    <Text>{activity.descriptionActivity}</Text>
                    <Text>{activity.dateActivity}</Text>
                    <Text>From {activity.hoursActivity[0]} to {activity.hoursActivity[1]}</Text>
                    <Text>{activity.participantsActivity}</Text>
                </View>
                ))
            ) : (
                <Text>No activities found</Text>
            )}
            </View>
        </ImageBackground>
      );
};


