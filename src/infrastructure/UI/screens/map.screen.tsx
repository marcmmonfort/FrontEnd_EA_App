import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, TextInput, Button } from "react-native";
import MapView from "react-native-leaflet-view";
import { LatLng, LeafletView } from 'react-native-leaflet-view';
import Geolocation from "@react-native-community/geolocation";

const customIcon = require("./path/to/custom-icon.png");

const MapPage = () => {
  const [locations, setLocationList] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setLocationList((prevLocations) =>
          prevLocations.map((location) => ({
            ...location,
            lat: latitude,
            lon: longitude,
          }))
        );
      },
      (error) => console.error("Error al obtener la posición:", error)
    );
  }, []);

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${searchValue}&format=json`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error("Error en la búsqueda:", error);
    }
  };

  const handleSearchResult = (result: {
    lat: any;
    lon: any;
    importance: any;
  }) => {
    const { lat, lon, importance } = result;
    const zoom = calculateZoom(importance);
    map.flyTo([parseFloat(lat), parseFloat(lon)], zoom);
  };

  const calculateZoom = (importance: number) => {
    return Math.floor(18 - Math.log2(importance));
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: searchResults[0]?.lat,
          longitude: searchResults[0]?.lon,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0922,
        }}
        zoomLevel={13}
      >
        {locations.map((location) => (
          <Marker
            key={location.uuid}
            coordinate={[
              parseFloat(location.latLocation),
              parseFloat(location.lonLocation),
            ]}
            icon={customIcon}
          >
            <Popup>{location.nameLocation}</Popup>
          </Marker>
        ))}
        {searchResults.map((result: any, index: number) => (
          <Marker
            key={result.lat}
            coordinate={[
              parseFloat(result.lat),
              parseFloat(result.lon),
            ]}
            eventHandlers={{
              click: () => handleSearchResult(result),
            }}
          >
            <Popup>{result.display_name}</Popup>
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

export default MapPage;
