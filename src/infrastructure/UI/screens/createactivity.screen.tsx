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
import StyledTextInputs from "../components/inputs/StyledTextInputs";
import { Picker } from "@react-native-picker/picker";
import ButtonGradientBirthdate from "../components/buttons/Button_Type_Birthdate";
import DateTimePicker from "@react-native-community/datetimepicker";

interface RouteParams {
    uuid?: string;
}

async function loadFonts() {
    await Font.loadAsync({
      'Rafaella': require('../../../../assets/fonts/Rafaella.ttf'),
      'SFNS': require('../../../../assets/fonts/SFNS.otf'),
    });
}

export default function CreateActivityScreen() {
    const navigation = useNavigation();
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const route = useRoute();
    const {
        uuid
      }: RouteParams = route.params || {};

    useEffect(() => {
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
        headerTitle: 'Create an Activity',
          headerStyle: { backgroundColor: '#000000', borderBottomWidth: 0, shadowOpacity: 0 }, 
          headerTitleStyle: { color: '#66fcf1', fontSize: 30 }
        });
    }, [navigation]);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            width: '100%',
            backgroundColor: "transparent",
            alignItems: "center",
        },
        scroll_style: {
            flex: 1,
        },
        backgroundImage: {
            flex: 1,
            resizeMode: 'cover',
        },
        input: {
            width: 300,
            height: 40,
        },
        picker_left: {
            color: "black",
            fontWeight:'bold',
            backgroundColor: "#66fcf1",
            borderWidth: 1,
            borderColor: "transparent",
            borderRadius: 14,
            marginTop: 20,
            marginBottom: 0,
            width: 140,
            height: 62,
            marginRight: 20,
        },
        picker_right: {
            color: "black",
            fontWeight:'bold',
            backgroundColor: "#66fcf1",
            borderWidth: 1,
            borderColor: "transparent",
            borderRadius: 14,
            marginTop: 20,
            marginBottom: 0,
            width: 140,
            height: 62,
        },
        pickerItem: {
            fontSize: 14,
            color: "black",
            fontFamily: bodyFont,
            height: 60,
        },
        picker_row: {
            flexDirection: "row",
        },
        title: {
            color: 'yellow',
            fontFamily: titleFont,
            fontSize: 28,
            paddingTop: 8,
            marginTop: 20,
        },
        buttonContainerB: {
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 20,
        },
        dateTimePicker: {
            backgroundColor: 'transparent',
            width: 68,
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
            marginTop:4,
        },
        map: {
            width: 300,
            height: 300,
        },
        map_container: {
            alignContent: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            width: 300,
            height: 300,
            display: 'flex',
            marginTop: 20,
            borderRadius: 20,
        },
    });

    const createNewActivity = async () => {
        try {
            const newActivity = {
                nameActivity: 'Nombre de la actividad',
                creatorActivity: 'Creador de la actividad',
                participantsActivity: ['Participante 1', 'Participante 2'],
                publicationActivity: ['Publicación 1', 'Publicación 2'],
                dateActivity: 'Fecha de la actividad',
                hoursActivity: ['Hora 1', 'Hora 2'],
                idLocation: 'ID de la ubicación',
                descriptionActivity: 'Descripción de la actividad',
                privacyActivity: true,
                roleActivity: 'verificado' as const, // Asigna uno de los valores permitidos: 'common', 'verificado' o 'empresa'
              };
      
            const response = await ActivityService.createActivity(newActivity);
      
            if (response) {
                navigation.navigate('ActivitiesLocation' as never);
            } else {
                console.error('Error creating a new activity!');
            }

        } catch (error) {
            console.error('Error creating a new activity: ', error);
        }
      };

    /*
    nameActivity: string; ---> TEXT INPUT
    creatorActivity: string;
    dateActivity: string;
    hoursActivity: string[];
    idLocation?: string; ---> LO SACAMOS DEL uuid QUE SE NOS PASA.
    descriptionActivity?: string; ---> TEXT INPUT
    privacyActivity: boolean; ---> PICKER
    roleActivity: "verificado" | "common" | "empresa"; ---> PICKER
    */

    const handleShowDatePicker = () => {
        setShowDatePicker(true);
    };

    const handleDateChange = (event: any, selectedDate: any) => {
        setShowDatePicker(false);
        if (selectedDate) {
          setSelectedDate(selectedDate);
          setBirthdateUser(selectedDate.toISOString());
        }
    };

    const [endHourOptions, setEndHourOptions] = useState([]);
    const [nameActivity, setNameActivity] = useState("");
    const [dateActivity, setDateActivity] = useState("");
    const [startHour, setStartHour] = useState("");
    const [endHour, setEndHour] = useState("");
    const [locationId, setLocationId] = useState("");
    const [descriptionActivity, setDescriptionActivity] = useState("");
    const [privacyActivity, setPrivacyActivity] = useState("");
    const [roleActivity, setRoleActivity] = useState("");
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [birthdateUser, setBirthdateUser] = useState("");
    const mapRef = useRef<MapView>(null);

    useEffect(() => {
        const getCurrentLocation = async () => {
            try {
                if (uuid){
                    const response = await LocationService.getLocation(uuid.toString());
                    if (response){
                        const activityLocation = response.data as LocationEntity;
                        const latitude = parseFloat(activityLocation.latLocation);
                        const longitude = parseFloat(activityLocation.lonLocation);
                        const region = {
                        latitude,
                        longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                        };

                        mapRef.current?.animateToRegion(region);
                    } 
                }
            } catch (error) {
                console.log("Error al obtener la ubicación: ", error);
            }
        };
        getCurrentLocation();
    }, []);

    return (
        <ImageBackground source={require('../../../../assets/visualcontent/background_8.png')} style={styles.backgroundImage}>
        <ScrollView style={styles.scroll_style}>
            <View style={styles.container}>
                <Text style={styles.title}>New Acitivity</Text>
                <StyledTextInputs style={styles.input} placeholder="Name of the Activity" value={nameActivity} onChangeText={setNameActivity}/>
                <StyledTextInputs style={styles.input} placeholder="Description" value={descriptionActivity} onChangeText={setDescriptionActivity}/>
                <View style={styles.picker_row}>
                    <Picker selectedValue={roleActivity} style={styles.picker_left} itemStyle={styles.pickerItem} onValueChange={(roleActivity) => setRoleActivity(roleActivity)}>
                        <Picker.Item label="Verified" value="verificado" />
                        <Picker.Item label="Common" value="common" />
                        <Picker.Item label="Business" value="empresa" />
                    </Picker>
                    <Picker selectedValue={privacyActivity} style={styles.picker_right} itemStyle={styles.pickerItem} onValueChange={(privacyActivity) => setPrivacyActivity(privacyActivity)}>
                        <Picker.Item label="Private" value="true" />
                        <Picker.Item label="Public" value="false" />
                    </Picker>
                </View>
                <View style={styles.buttonContainerB}>
                    <ButtonGradientBirthdate onPress={handleShowDatePicker}/>
                </View>
                {showDatePicker && (
                    <DateTimePicker value={selectedDate} mode="date" display="default" style={styles.dateTimePicker} onChange={handleDateChange}/>
                )}
                <View style={styles.picker_row}>
                    <Picker selectedValue={startHour} style={styles.picker_left} itemStyle={styles.pickerItem} onValueChange={(startHour) => setStartHour(startHour)}>
                        <Picker.Item label="00:00" value="00:00" />
                        <Picker.Item label="00:30" value="00:30" />
                        <Picker.Item label="01:00" value="01:00" />
                        <Picker.Item label="01:30" value="01:30" />
                        <Picker.Item label="02:00" value="02:00" />
                        <Picker.Item label="02:30" value="02:30" />
                        <Picker.Item label="03:00" value="03:00" />
                        <Picker.Item label="03:30" value="03:30" />
                        <Picker.Item label="04:00" value="04:00" />
                        <Picker.Item label="04:30" value="04:30" />
                        <Picker.Item label="05:00" value="05:00" />
                        <Picker.Item label="05:30" value="05:30" />
                        <Picker.Item label="06:00" value="06:00" />
                        <Picker.Item label="06:30" value="06:30" />
                        <Picker.Item label="07:00" value="07:00" />
                        <Picker.Item label="07:30" value="07:30" />
                        <Picker.Item label="08:00" value="08:00" />
                        <Picker.Item label="08:30" value="08:30" />
                        <Picker.Item label="09:00" value="09:00" />
                        <Picker.Item label="09:30" value="09:30" />
                        <Picker.Item label="10:00" value="10:00" />
                        <Picker.Item label="10:30" value="10:30" />
                        <Picker.Item label="11:00" value="11:00" />
                        <Picker.Item label="11:30" value="11:30" />
                        <Picker.Item label="12:00" value="12:00" />
                        <Picker.Item label="12:30" value="12:30" />
                        <Picker.Item label="13:00" value="13:00" />
                        <Picker.Item label="13:30" value="13:30" />
                        <Picker.Item label="14:00" value="14:00" />
                        <Picker.Item label="14:30" value="14:30" />
                        <Picker.Item label="15:00" value="15:00" />
                        <Picker.Item label="15:30" value="15:30" />
                        <Picker.Item label="16:00" value="16:00" />
                        <Picker.Item label="16:30" value="16:30" />
                        <Picker.Item label="17:00" value="17:00" />
                        <Picker.Item label="17:30" value="17:30" />
                        <Picker.Item label="18:00" value="18:00" />
                        <Picker.Item label="18:30" value="18:30" />
                        <Picker.Item label="19:00" value="19:00" />
                        <Picker.Item label="19:30" value="19:30" />
                        <Picker.Item label="20:00" value="20:00" />
                        <Picker.Item label="20:30" value="20:30" />
                        <Picker.Item label="21:00" value="21:00" />
                        <Picker.Item label="21:30" value="21:30" />
                        <Picker.Item label="22:00" value="22:00" />
                        <Picker.Item label="22:30" value="22:30" />
                        <Picker.Item label="23:00" value="23:00" />
                        <Picker.Item label="23:30" value="23:30" />
                    </Picker>
                    <Picker selectedValue={endHour} style={styles.picker_right} itemStyle={styles.pickerItem} onValueChange={(endHour) => setEndHour(endHour)}>
                        <Picker.Item label="00:00" value="00:00" />
                        <Picker.Item label="00:30" value="00:30" />
                        <Picker.Item label="01:00" value="01:00" />
                        <Picker.Item label="01:30" value="01:30" />
                        <Picker.Item label="02:00" value="02:00" />
                        <Picker.Item label="02:30" value="02:30" />
                        <Picker.Item label="03:00" value="03:00" />
                        <Picker.Item label="03:30" value="03:30" />
                        <Picker.Item label="04:00" value="04:00" />
                        <Picker.Item label="04:30" value="04:30" />
                        <Picker.Item label="05:00" value="05:00" />
                        <Picker.Item label="05:30" value="05:30" />
                        <Picker.Item label="06:00" value="06:00" />
                        <Picker.Item label="06:30" value="06:30" />
                        <Picker.Item label="07:00" value="07:00" />
                        <Picker.Item label="07:30" value="07:30" />
                        <Picker.Item label="08:00" value="08:00" />
                        <Picker.Item label="08:30" value="08:30" />
                        <Picker.Item label="09:00" value="09:00" />
                        <Picker.Item label="09:30" value="09:30" />
                        <Picker.Item label="10:00" value="10:00" />
                        <Picker.Item label="10:30" value="10:30" />
                        <Picker.Item label="11:00" value="11:00" />
                        <Picker.Item label="11:30" value="11:30" />
                        <Picker.Item label="12:00" value="12:00" />
                        <Picker.Item label="12:30" value="12:30" />
                        <Picker.Item label="13:00" value="13:00" />
                        <Picker.Item label="13:30" value="13:30" />
                        <Picker.Item label="14:00" value="14:00" />
                        <Picker.Item label="14:30" value="14:30" />
                        <Picker.Item label="15:00" value="15:00" />
                        <Picker.Item label="15:30" value="15:30" />
                        <Picker.Item label="16:00" value="16:00" />
                        <Picker.Item label="16:30" value="16:30" />
                        <Picker.Item label="17:00" value="17:00" />
                        <Picker.Item label="17:30" value="17:30" />
                        <Picker.Item label="18:00" value="18:00" />
                        <Picker.Item label="18:30" value="18:30" />
                        <Picker.Item label="19:00" value="19:00" />
                        <Picker.Item label="19:30" value="19:30" />
                        <Picker.Item label="20:00" value="20:00" />
                        <Picker.Item label="20:30" value="20:30" />
                        <Picker.Item label="21:00" value="21:00" />
                        <Picker.Item label="21:30" value="21:30" />
                        <Picker.Item label="22:00" value="22:00" />
                        <Picker.Item label="22:30" value="22:30" />
                        <Picker.Item label="23:00" value="23:00" />
                        <Picker.Item label="23:30" value="23:30" />
                    </Picker>
                </View>
                <View style={styles.map_container}>
                    <MapView style={styles.map} ref={mapRef}>
                    </MapView>
                </View>
            </View>
        </ScrollView>
        </ImageBackground>
    );
}

