import React, { useState, useEffect, Fragment } from 'react';
import { View, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import axios from 'axios';
import uuid from 'uuid';
import personMarker from '../../assets/person.png';
import wifiMarker from '../../assets/marker.png';

const initialState = {
  latitude: -30.034876,
  longitude: -51.229583,
  latitudeDelta: 0.0143,
  longitudeDelta: 0.0143
};

const Map = () => {
  const [currentPosition, setCurrentPosition] = useState(initialState);
  const [wifiPositions, setWifiPositions] = useState([]);

  useEffect(() => {
    const getWifiLocations = async () => {
      const wifiLocations = await axios.get('http://www.portoalegrelivre.com.br/php/services/WSPoaLivreRedes.php');
      setWifiPositions(wifiLocations.data);
    };

    getWifiLocations();

    const getPosition = async () => {
      try {
        navigator.geolocation.getCurrentPosition(
          ({ coords: { latitude, longitude } }) => {
            setCurrentPosition({
              latitude,
              longitude,
              latitudeDelta: 0.0143,
              longitudeDelta: 0.0143
            });
          },
          (error) => console.info('Trying to get current location: ', error.message),
          {
            timeout: 2000,
            enableHighAccuracy: true,
            maximinAge: 1000,
          }
        );
      } catch (error) {
        console.info('Trying to use navigator not initialized');
      }
    };
    getPosition();
  }, [currentPosition]);

  return currentPosition.latitude ? (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        region={{ ...currentPosition }}
        showsUserLocation
        loadingEnabled
      >
        <>
          <Marker coordinate={currentPosition} anchor={{ x: 0, y: 0 }} image={personMarker} />
          {wifiPositions.map((wifi) => (
            <Marker
              key={wifi.Empresa + uuid.v1()}
              coordinate={{
                latitude: Number(wifi.Latitude),
                longitude: Number(wifi.Longitude),
                latitudeDelta: 0.0143,
                longitudeDelta: 0.0143
              }}
              anchor={{ x: 0, y: 0 }}
              image={wifiMarker}
            />
          ))}
        </>
      </MapView>
    </View>
  ) : <ActivityIndicator style={{ flex: 1 }} animating size="large" />;
};

export default Map;
