import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Image, Platform, LogBox } from "react-native";
LogBox.ignoreAllLogs();

import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

import { View, TouchableOpacity, Text } from "react-native";

import CrossTalk from "@/components/functional/CrossTalk";
import CameraComponent from "@/components/functional/CameraComponent";
import AudioComponent from "@/components/functional/AudioComponent";

// import Map from "@/components/MapComponent";
import Hamburger from "@/components/HamburgerComponent";
import BottomPopUp from "@/components/BottomPopUp";

import {
  ChevronLeftIcon,
  EllipsisVerticalIcon,
} from "react-native-heroicons/solid";

export default function TabTwoScreen() {
  const [mapVisible, setMapVisible] = useState(false);

  return (
    <View style={{ height: "100%" }}>
      <BottomPopUp />
      <View style={styles.topButtons}>
        <TouchableOpacity
          style={styles.buttonCircle}
          onPress={() => console.log("back")}
        >
          <ChevronLeftIcon color="white" size={20} />
        </TouchableOpacity>
        <Text style={styles.title}>Visualizer</Text>
        <Hamburger setMapVisible={setMapVisible} />
      </View>
      {/* {mapVisible && <Map />} */}
      <CameraComponent></CameraComponent>
      <CrossTalk></CrossTalk>
      <AudioComponent></AudioComponent>
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    alignSelf: "center",
    height: 320,
    width: 320,
    position: "absolute",
    top: 242,
  },
  topGradient: {
    position: "absolute",
    width: "120%",
    height: 100,
    top: 0,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    justifyContent: "space-around",
    alignItems: "flex-end",
    marginBottom: 20,
  },
  button: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    padding: 10,
    borderRadius: 5,
  },
  text: {
    fontSize: 18,
    color: "white",
  },
  topButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    marginTop: 4,
    position: "absolute",
    top: 50,
    zIndex: 100,
    width: "100%",
  },
  buttonCircle: {
    width: 40,
    height: 40,
    borderRadius: 200,
    backgroundColor: "rgba(255, 255, 255, 0.40)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },
  transcriptionContainer: {
    position: "absolute",
    bottom: 80,
    left: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 10,
    borderRadius: 5,
  },
  transcriptionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  transcriptionText: {
    fontSize: 16,
  },
});
