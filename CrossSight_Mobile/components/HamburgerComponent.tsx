import React, { useState } from "react";

import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { EllipsisVerticalIcon } from "react-native-heroicons/solid";

// @ts-ignore
export default function Hamburger({ setMapVisible }) {
  const [visible, setVisible] = useState(false);
  const toggleMenu = () => setVisible(!visible);
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TouchableOpacity
        style={styles.buttonCircle}
        onPress={() => toggleMenu()}
      >
        <EllipsisVerticalIcon
          color="white"
          size={20}
          onPress={() => console.log("back")}
        />
      </TouchableOpacity>
      <View>
        {visible && (
          <View
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              paddingVertical: 20,
              position: "absolute",
              borderRadius: 20,
              width: 164,
              marginTop: 18,
              right: 0,
              zIndex: 100,
            }}
          >
            <TouchableOpacity
              style={{
                display: "flex",
                flexDirection: "row",
                paddingHorizontal: 10,
                alignItems: "center",
                // justifyContent: "center",
                gap: 5,
                borderColor: "white",
                borderWidth: 1,
                paddingVertical: 4,
                zIndex: 100,
              }}
              // onPress={() => flipCamera()}
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
                  📷
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>Flip</Text>
                <Text style={{ fontSize: 12, color: "#616161" }}>
                  Switch to front
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                display: "flex",
                flexDirection: "row",
                paddingHorizontal: 10,
                alignItems: "center",
                gap: 5,
                borderColor: "white",
                borderWidth: 1,
                paddingVertical: 4,
                zIndex: 100,
              }}
              onPress={() => setMapVisible(true)}
            >
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 20,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#3E8BE6",
                  zIndex: 100,
                }}
              >
                <Text
                  style={{
                    fontSize: 32,
                  }}
                >
                  🗺
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>Maps</Text>
                <Text style={{ fontSize: 12, color: "#616161" }}>
                  start route
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonCircle: {
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
