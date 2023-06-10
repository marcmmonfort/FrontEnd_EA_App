
import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Callout, Marker } from "react-native-maps";
import MapView from 'react-native-maps';
import { LocationEntity } from "../../../domain/location/location.entity";
import SearchBar from "../components/searchbar/searchbar";
const customIcon = require('../../../../assets/location_apple.png');

import * as Location from 'expo-location';

const MapScreen = () => {
  const [locations, setLocationList] = useState<LocationEntity[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const mapRef = useRef<MapView>(null);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);

  useEffect(() => {
    const getCurrentLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status === "granted") {
          const location = await Location.getCurrentPositionAsync({});

          const { latitude, longitude } = location.coords;

          const region = {
            latitude,
            longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          };

          mapRef.current?.animateToRegion(region);
        }
      } catch (error) {
        console.log("Error al obtener la ubicación:", error);
      }
    };

    getCurrentLocation();
  }, []);

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

  const handleSearchWrapper = (searchText: string) => {
    // setSearchValue(searchText);
    handleSearch();
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${searchValue}&format=json`
      );
      console.log("SE ESTÁ BUSCANDO:", `https://nominatim.openstreetmap.org/search?q=${searchValue}&format=json`);
      const data = await response.json();
      const limitedResults = data.slice(0, 3);
      setSearchResults(limitedResults);
    } catch (error) {
      console.error("Error en la búsqueda:", error);
    }
  };

  useEffect(() => {
    console.log("RESPUESTA LOCATIONS:", searchResults);
  }, [searchResults]);

  const calculateZoom = (importance: number) => {
    return Math.floor(18 - Math.log2(importance));
  };

  const handleSearchResult = (result: any) => {
    setSelectedLocation(result);
    const { lat, lon, importance } = result;
    const zoom = calculateZoom(importance);
    const region = {
      latitude: parseFloat(lat),
      longitude: parseFloat(lon),
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0922,
    };
    mapRef.current?.animateToRegion(region, zoom);
  };

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    map: {
      width: '100%',
      height: '100%',
    },
    searchContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1,
      padding: 0,
    },
    locationList: {
      marginTop: 10,
      backgroundColor: '#fff',
      borderRadius: 5,
      padding: 10,
    },
    locationItem: {
      paddingVertical: 5,
    },
    selectedLocationItem: {
      backgroundColor: 'lightblue',
    },
  });

  return (
    <View style={styles.container}>
      <MapView style={styles.map} ref={mapRef}>
        {searchResults.map((result) => (
          <Marker
            key={result.place_id}
            coordinate={{
              latitude: parseFloat(result.lat),
              longitude: parseFloat(result.lon),
            }}
            title={result.display_name}
            description={result.address}
            onPress={() => handleSearchResult(result)}
            pinColor={result === selectedLocation ? "blue" : "red"} // Marcar la ubicación seleccionada con un color diferente
          />
        ))}
      </MapView>
      <View style={styles.searchContainer}>
        <SearchBar onSearch={handleSearchWrapper} />
        <View style={styles.locationList}>
          {searchResults.map((result) => (
            <TouchableOpacity
              key={result.place_id}
              style={[
                styles.locationItem,
                result === selectedLocation && styles.selectedLocationItem, // Resaltar la ubicación seleccionada
              ]}
              onPress={() => handleSearchResult(result)}
            >
              <Text>{result.display_name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

};

/*
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
*/

export default MapScreen;

/*

import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, TextInput, Text, Button } from "react-native";
import MapView, { Callout } from "react-native-maps";
import Geolocation from "react-native-geolocation-service";
import { Marker } from "react-native-maps";

const customIcon = require('../../../../assets/location_apple.png');

const MapScreen = () => {
  const [locations, setLocationList] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocationList((prevLocations) =>
          prevLocations.map((location) => ({...location, lat: latitude, lon: longitude}))
        );
      },
      (error) => console.error("Error al obtener la posición:", error)
    );
  }, []);


  const handleSearch = async () => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${searchValue}&format=json`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error en la búsqueda:", error);
    }
  };

  const mapRef = useRef<MapView>(null);

  const handleSearchResult = (result: {
    lat: any;
    lon: any;
    importance: any;
  }) => {
    const { lat, lon, importance } = result;
    const zoom = calculateZoom(importance);
    const region = {
      latitude: parseFloat(lat),
      longitude: parseFloat(lon),
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0922,
    };
    mapRef.current?.animateToRegion(region, zoom);
  };

  const calculateZoom = (importance: number) => {
    return Math.floor(18 - Math.log2(importance));
  };

  return (
    <View style={styles.container}>
      <MapView style={styles.map} initialRegion={{latitude: searchResults[0]?.lat, longitude: searchResults[0]?.lon, latitudeDelta: 0.0922, longitudeDelta: 0.0922}} maxZoomLevel={13} ref={mapRef}>
        {locations.map((location) => (
          <Marker key={location.uuid} coordinate={{ latitude: parseFloat(location.latLocation), longitude: parseFloat(location.lonLocation)}} icon={customIcon}>
            <Callout>
              <View>
                <Text>{location.nameLocation}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
        {searchResults.map((result: any, index: number) => (
          <Marker key={result.lat} coordinate={{latitude: parseFloat(result.lat), longitude: parseFloat(result.lon)}} onPress={() => handleSearchResult(result)}>
            <Callout>
              <View>
                <Text>{result.display_name}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
    
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

export default MapScreen;

*/

