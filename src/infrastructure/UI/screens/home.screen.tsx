import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { MaterialIcons,AntDesign } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import FeedScreen from "./feed.screen";
import DiscoveryScreen from "./discovery.screen";
import CalendarEventsScreen from "./calendar.screen";
import ProfileScreen from "./profile.screen";
import PublicationUpScreenA from "./Publication/publicationUp.screen";

const Tab = createBottomTabNavigator();

export default function HomeScreen() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Crazy button"
        component={FeedScreen}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="gesture-tap-button"
              size={30}
              color="#66fcf1"
            />
          ),
        }}
      />
      <Tab.Screen
        name="Photo page"
        component={DiscoveryScreen}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarBadge: 3,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="photo-library" size={25} color="#66fcf1" />
          ),
        }}
      />
      <Tab.Screen
        name="Publication page"
        component={PublicationUpScreenA}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <Fontisto name="nav-icon-list-a" size={18} color="#66fcf1" />
          ),
        }}
      />
      <Tab.Screen
        name="CalendarEventsScreen"
        component={CalendarEventsScreen}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <Fontisto name="nav-icon-list-a" size={18} color="#66fcf1" />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size }) => (
            <Fontisto name="nav-icon-list-a" size={18} color="#66fcf1" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
