import React from "react";
import { View, Text } from "react-native";

export default function BottomPopUp() {
  return (
    <View
      style={{
        position: "absolute",
        backgroundColor: "rgba(255, 255, 255, 0.70)",
        bottom: 20,
        left: "50%",
        width: 320,
        transform: [{ translateX: (320 / 2) * -1 }],
        height: 80,
        borderRadius: 20,
        zIndex: 1000,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          paddingHorizontal: 10,
          alignItems: "center",
          height: 80,
          //   justifyContent: "center",
          gap: 5,
          //   paddingVertical: 4,
          zIndex: 100,
        }}
      >
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 20,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#3E8BE6",
          }}
        >
          <Text
            style={{
              fontSize: 32,
            }}
          >
            🚧
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>Obstacle</Text>
          <Text style={{ fontSize: 12, color: "#616161" }}>
            10 meters ahead
          </Text>
        </View>
      </View>
    </View>
  );
}
