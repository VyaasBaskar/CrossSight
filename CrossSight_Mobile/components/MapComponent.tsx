import React from "react";
import MapView from "react-native-maps";

import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";

export default function Map() { 
    return (
      <>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 37.78825,
            longitude: -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      </>
    );
}

const styles = StyleSheet.create({
    map: {
        width: "100%",
        height: 430,
        position: "absolute",
        bottom: -430 / 2,
        borderRadius: 200,
        left: 0,
        right: 0,
    },
    
})
