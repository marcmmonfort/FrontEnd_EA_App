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
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

async function loadFonts() {
    await Font.loadAsync({
      'Rafaella': require('../../../../assets/fonts/Rafaella.ttf'),
      'SFNS': require('../../../../assets/fonts/SFNS.otf'),
    });
}

interface RouteParams {
    uuid?: string;
}

export default function ActivityInfo() {
    const navigation = useNavigation();
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const [activity, setActivity] = useState<ActivityEntity>();
    const route = useRoute();
    const {
        uuid
      }: RouteParams = route.params || {};

    const titleFont = Platform.select({
        ios: 'Rafaella',
        android: 'Rafaella',
    });
    const bodyFont = Platform.select({
        ios: 'SFNS',
        android: 'SFNS',
    });

    const obtainActivity = async () => {
        if (uuid){
            try {
                const response = await ActivityService.getActivityById(uuid);
                if (response) {
                  const activity = response.data as ActivityEntity;
                  setActivity(activity);
                } else {
                  console.error('Error fetching activities: Response is undefined');
                }
            } catch (error) {
            console.error('Error fetching activities:', error);
            }
        }
    };

    useEffect(() => {
        obtainActivity();
        loadFonts().then(() => {
          setFontsLoaded(true);
        });
      }, []);

    React.useLayoutEffect(() => {
        navigation.setOptions({
        headerTitle: 'Activity',
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
        inside_container: {
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
            color: 'yellow',
            fontFamily: titleFont,
            fontSize: 28,
            paddingTop: 8,
        },
        text_activity_description: {
          color: 'white',
          fontFamily: bodyFont,
          fontSize: 16,
          marginTop: 8,
        },
        text_activity_date: {
          color: "#66fcf1",
          fontFamily: bodyFont,
          fontSize: 14,
          marginTop: 8,
        },
        text_activity_time: {
          color: "#66fcf1",
          fontFamily: bodyFont,
          fontSize: 14,
          marginBottom: 8,
        },
        scroll_profiles: {
            paddingLeft: 10,
            width: 300,
            marginTop: 2,
            marginBottom: 2,
        },
        plus_icon: {
            width: 46,
            height: 46,
            justifyContent: "center",
            alignContent: "center",
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            alignItems: "center",
            borderRadius: 40,
            marginRight: 10,
        },
    });

    return (
        <ImageBackground source={require('../../../../assets/visualcontent/background_8.png')} style={styles.backgroundImage}>
          <View style={styles.container}>
          {activity && (
                <View style={styles.inside_container}>
                    <Text style={styles.text_activity_name}>{activity.nameActivity}</Text>
                    <Text style={styles.text_activity_description}>{activity.descriptionActivity}</Text>
                    <Text style={styles.text_activity_date}>
                        {new Date(activity.dateActivity).getDate()}.
                        {new Date(activity.dateActivity).getMonth() + 1}.
                        {new Date(activity.dateActivity).getFullYear()}
                    </Text>
                    <Text style={styles.text_activity_time}>{activity.hoursActivity[0]} - {activity.hoursActivity[1]}</Text>
                    <View style={styles.plus_icon}>
                        <MaterialCommunityIcons color="#66fcf1" name="plus" size={20} />
                    </View>
                </View>
            )}
          </View>
        </ImageBackground>
    );
}
    