import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Image, Platform } from "react-native";

import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

import { View } from "react-native";

import CrossTalk from "@/components/functional/CrossTalk";
import CameraComponent from "@/components/functional/CameraComponent";
import AudioComponent from "@/components/functional/AudioComponent";

export default function TabTwoScreen() {
  return (
    <View style={{ height: "100%" }}>
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
});
