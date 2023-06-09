import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, TouchableOpacity, TextInput, Text, Button } from "react-native";
import MapView, { Callout } from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";
import { Marker } from "react-native-maps";

const customIcon = require("./path/to/custom-icon.png");

const MapScreen = () => {
  const [locations, setLocationList] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState("");

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
