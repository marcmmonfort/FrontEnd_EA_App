import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, Image, FlatList } from "react-native";
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { ActivityService } from "../../services/activity/activity.service";
import { Activity } from "../../../domain/activity/activity.entity";
import { SessionService } from "../../services/user/session.service";
import CalendarScreen from "../components/calendar/calendar";
import { UserEntity } from "../../../domain/user/user.entity";
import { CRUDService } from "../../services/user/CRUD.service";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "react-native-vector-icons/Icon";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import SearchBar from "../components/searchbar/searchbar";


const CreateActivity = () => {
  
  return (
    <Text>Working on it ...</Text>
  );
};

export default CreateActivity;
