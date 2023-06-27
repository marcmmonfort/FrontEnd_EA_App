import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { SessionService } from '../../services/user/session.service'; 
import { CRUDService } from '../../services/user/CRUD.service';
import { useTranslation } from 'react-i18next';
import { UserEntity } from '../../../domain/user/user.entity';
import { ActivityService } from '../../services/activity/activity.service';
import { PublicationService } from '../../services/publication/publication.service';
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { BarChart } from 'react-native-chart-kit';
import { Picker } from '@react-native-picker/picker';
import { ScrollView } from 'react-native-gesture-handler';

interface RouteParams {
  userId?: string;
}

const UserStats = () => {
  const route = useRoute();
  const { userId }: RouteParams = route.params || {};
  const [currentUser, setCurrentUser] = useState<UserEntity | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [myId, setMyId] = useState<string>('1234');
  const [participatedActivities, setParticipatedActivities] = useState<number>(0);
  const [createdActivities, setCreatedActivities] = useState<number>(0);
  const [publications, setPublications] = useState<number>(0);
  const [numActivitiesWeek, setNumActivitiesWeek] = useState<number>(0);
  const [numActivitiesMonth, setNumActivitiesMonth] = useState<number>(0);
  const [selectedMonth, setSelectedMonth] = useState<string>('6');
  const [selectedYear, setSelectedYear] = useState<string>('2023');
  const [chartData, setChartData] = useState<number[]>([]);
  const [chartLabels, setChartLabels] = useState<string[]>([]);
  const [chartData2, setChartData2] = useState<number[]>([]);
  const [recargar, setRecargar] = useState<boolean>(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      const myUserId = await SessionService.getCurrentUser();
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      const date = currentDate.toString();

      if (myUserId) {
        setMyId(await myUserId);
        console.log("Obtenemos los datos del otro usuario");
        //Obtenemos el usuario
        getById(myUserId);

        const thisMonth = currentDate.getMonth();
        const currentMonth = (thisMonth + 1).toString();
        const currentYear = currentDate.getFullYear().toString();

        setSelectedMonth(currentMonth);
        setSelectedYear(currentYear);

        const fetchActivitiesParticipated = async () => {
          try {
            const participated = await activitiesParticipated(myUserId);
            setParticipatedActivities(participated);
            const created = await activitiesCreated(myUserId);
            setCreatedActivities(created);
            const numPublications = await publicationsMade(myUserId);
            setPublications(numPublications);
            const numWeek = await activitiesWeek(myUserId, date);
            console.log("numWeek", numWeek)
            setNumActivitiesWeek(numWeek);
            const numMonth = await activitiesMonth(myUserId, date);
            setNumActivitiesMonth(numMonth);
            const data = await last6Weeks(myUserId);
            const labelDays = daysOfWeek();
            setChartData(data);
            setChartLabels(labelDays);

          } catch (error) {
            console.error('Error al obtener las actividades participadas:', error);
          }
        };
        fetchActivitiesParticipated();
      }
    }
    fetchData();

  }, []);

  const getById = async (myUserId: string) => {
    if (myUserId) {
      console.log('Obtenemos los datos del otro usuario:', myUserId);
      try {
        const response = await CRUDService.getPerson(myUserId);
        setCurrentUser(response.data);
        console.log('Obtenemos los datos del otro usuario: exito');
      } catch (error) {
        navigation.navigate('NotFoundScreen' as never);
        console.error(error);
      }
    } else {
      navigation.navigate('NotFoundScreen' as never);
    }
  };


  const activitiesParticipated = async (myUserId: string) => {
    const response = await ActivityService.getAllActivitiesParticipatedByUser(myUserId);
    console.log(userId);
    console.log(response.data.length);
    return response.data.length;
  }

  const activitiesCreated = async (myUserId: string) => {
    const response = await ActivityService.getAllActivitiesCreatedByUser(myUserId);
    console.log(userId);
    console.log(response.data.length);
    return response.data.length;
  }

  const publicationsMade = async (myUserId: string) => {
    const response = await PublicationService.getAllPublicationByUser(myUserId);
    console.log(userId);
    console.log(response.data.length);
    return response.data.length;
  }

  const activitiesWeek = async (myUserId: string, date: string) => {
    const response = await ActivityService.getMySchedule(myUserId, date);
    console.log(userId);
    console.log(response.data.length);
    return response.data.length;
  }

  const activitiesMonth = async (myUserId: string, date: string) => {
    const response = await ActivityService.getActivitiesLastMonthByUser(myUserId, date);
    console.log(userId);
    console.log(response.data.length);
    return response.data.length;
  }

  const last6Weeks = async (myUserId: string) => {
    const response = await ActivityService.getActivitiesLast6Weeks(myUserId);
    console.log(userId);
    console.log(response.data);
    return response.data;
  }

  const daysOfWeek = () => {
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const dayOfWeek = currentDate.getDay();
    console.log("dayofWeek", dayOfWeek);
    // Ajustar el día de la semana
    const adjustedDayOfWeek = (dayOfWeek + 6) % 7; // Convertir domingo (0) a 6 y desplazar los demás días
    // Obtener el primer día (lunes) de la semana
    currentDate.setDate(currentDate.getDate() - adjustedDayOfWeek); //ponemos la currentDate a Lunes de la semana actual
    console.log("start of week", currentDate);
    const days: string[] = [];
    for (let i = 0; i < 6; i++) {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(startOfWeek.getDate() - i * 7); // Restar i semanas a la fecha actual
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);
      const startString = `${startOfWeek.getDate()} / ${startOfWeek.getMonth() + 1}`;
      const endString = `${endOfWeek.getDate()} / ${endOfWeek.getMonth() + 1}`;

      const weekRange = `${startString} - ${endString}`;
      days.push(weekRange);
    }
    return days;
  }

  useEffect(() => {
    const fetchData = async () => {
        const myUserId = await SessionService.getCurrentUser();
        if(myUserId){
          const fetchActivitiesByMonthAndYear = async () => {
            try {
              const response = await ActivityService.getActivitiesByMonthAndYear(myUserId, selectedMonth, selectedYear);
              console.log(response.data);
      
              setChartData2(response.data);
            } catch (error) {
              console.error('Error al obtener las actividades por mes y año:', error);
            }
          };
          fetchActivitiesByMonthAndYear();
        }
    }
    fetchData();
    
  }, [recargar]);

  const handleMonthSelect = (month: string) => {
    setSelectedMonth(month);
  };
  
  const handleYearSelect = (year: string) => {
    setSelectedYear(year);
  };

  const handleMonthSubmit = () => {
    setRecargar(prevState => !prevState);
  };

  return (
    <ScrollView>
    <View style={styles.container}>
      <View>
        <Text>{currentUser ? currentUser.appUser : 'Loading'}</Text>
        <View style={styles.profileStats}>

          {currentUser && (
            <View>
              <Text>Followers</Text>
              <TouchableOpacity style={styles.profileStatCountLeft} onPress={() => { navigation.navigate("UsersList" as never, { userId: currentUser.uuid, mode: "followers" } as never); }}>
                <Text>{currentUser.followersUser?.length}</Text>
              </TouchableOpacity>
              <Text>Following</Text>
              <TouchableOpacity style={styles.profileStatCountRight} onPress={() => { navigation.navigate("UsersList" as never, { userId: currentUser.uuid, mode: "following" } as never); }}>
                <Text>{currentUser.followedUser?.length}</Text>
              </TouchableOpacity>
            </View>

          )
          }
          <View style={styles.textContainer}>
            <Text style={styles.statText}>Created Activities: {createdActivities}</Text>
            <Text style={styles.statText}>Activities you participated: {participatedActivities}</Text>
            <Text style={styles.statText}>Publications made: {publications}</Text>
            <Text style={styles.statText}>Activities this week: {numActivitiesWeek}</Text>
            <Text style={styles.statText}>Activities last month: {numActivitiesMonth}</Text>
         </View>
        </View>
      </View>
      <View style={styles.chartContainer}>
        <Text>Plans Last 6 weeks: </Text>
        <BarChart
            data={{
            labels: [chartLabels[0], chartLabels[1], chartLabels[2], chartLabels[3], chartLabels[4], chartLabels[5]],
            datasets: [
                {
                data: chartData,
                },
            ],
            }}
            width={300}
            height={200}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
                borderRadius: 16,
            },
            verticalLabelRotation: 45, 
            }}
            style={{
            marginVertical: 8,
            borderRadius: 16,
            }}
        />
        </View>
        <View>
        <View style={styles.selectMonthContainer}>
        <Picker
          selectedValue={selectedMonth}
          onValueChange={handleMonthSelect}
          style={styles.picker_left} 
          itemStyle={styles.pickerItem}
        >
          <Picker.Item label="Enero" value="1" />
          <Picker.Item label="Febrero" value="2" />
          <Picker.Item label="Marzo" value="3" />
          <Picker.Item label="Abril" value="4" />
          <Picker.Item label="Mayo" value="5" />
          <Picker.Item label="Junio" value="6" />
          <Picker.Item label="Julio" value="7" />
          <Picker.Item label="Agosto" value="8" />
          <Picker.Item label="Septiembre" value="9" />
          <Picker.Item label="Octubre" value="10" />
          <Picker.Item label="Noviembre" value="11" />
          <Picker.Item label="Diciembre" value="12" />
        </Picker>
        <Picker
          selectedValue={selectedYear}
          onValueChange={handleYearSelect}
          style={styles.picker_left} 
          itemStyle={styles.pickerItem}
        >
          <Picker.Item label="2021" value="2021" />
          <Picker.Item label="2022" value="2022" />
          <Picker.Item label="2023" value="2023" />
          <Picker.Item label="2024" value="2024" />
          <Picker.Item label="2025" value="2025" />
        </Picker>
        <Button title="Select" onPress={handleMonthSubmit} />
      </View>
      {chartData2 && (
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>
            Activities Participated in {selectedMonth}/{selectedYear}
          </Text>
          <BarChart
            data={{
            labels: ["1st week", "2nd week", "3rd week", "4th week"],
            datasets: [
                {
                data: chartData2,
                },
            ],
            }}
            width={300}
            height={200}
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
                borderRadius: 16,
            },
            verticalLabelRotation: 45, 
            }}
            style={{
            marginVertical: 8,
            borderRadius: 16,
            }}
        />
        
        </View>
      )}
        </View>
        
      
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "transparent",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 32,
    },
    titleContainer: {
      marginBottom: 20,
    },
    profileContainer: {
      alignItems: "center",
      justifyContent: "center",
    },
    profile: {
      alignItems: "center",
      justifyContent: "center",
    },
    profileStats: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: 20,
    },
    profileTitle: {
      fontSize: 12,
      marginBottom: -10,
    },
    profileStatCountLeft: {
      marginRight: 20,
      alignItems: "center",
      justifyContent: "center",
    },
    profileStatCountRight: {
      alignItems: "center",
      justifyContent: "center",
    },
    textContainer: {
      marginTop: 40,
    },
    statText: {
      marginBottom: 10,
    },
    chartContainer: {
      alignItems: 'center',
      marginTop: 20,
    },
    selectMonthContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    picker: {
      width: 150,
    },
    chartTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
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
    pickerItem: {
      fontSize: 14,
      color: "black",
      //fontFamily: bodyFont,
      height: 60,
    },
  });
   
export default UserStats;
