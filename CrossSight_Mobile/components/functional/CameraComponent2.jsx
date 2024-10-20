import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Button,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Camera, CameraView, useCameraPermissions } from "expo-camera";
import { captureRef } from "react-native-view-shot";

const CameraComponent = () => {
  const SERVER_PREFIX = "http://";
  const SERVER_IP_ADDRESS = "192.168.50.17";
  const SERVER_PORT = "5000";

  const ASK_ADDRESS =
    SERVER_PREFIX + SERVER_IP_ADDRESS + ":" + SERVER_PORT + "/";

  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [hasResult, setHasResult] = useState(false);

  const onCameraReady = () => {
    setIsCameraReady(true);
  };
  const [base64Image, setBase64Image] = useState("");

  const sendPhotoToServer = async (uri) => {
    try {
      const formData = new FormData();
      formData.append("raw_img", {
        uri: uri,
        name: "raw_img.jpg",
        type: "image/jpeg",
      });

      fetch(ASK_ADDRESS + "upload", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const response = await fetch(ASK_ADDRESS + "get_annotated", {
        method: "GET",
      });
      const result = await response.json();

      setBase64Image(result["annotated_img"]);
      setHasResult(true);
    } catch (error) {
      setHasResult(false);
      console.error("ERROR [Processing Image]:", error);
      console.log(ASK_ADDRESS);
    }
  };

  const takePicture = useCallback(async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.05,
        });

        // await sendPhotoToServer(photo);
      } catch (error) {
        console.error("ERROR [Capture]", error);
      }
    } else {
      console.log("CAMERA NOT READY");
    }
  }, []);

  useEffect(() => {
    const intervalId = setInterval(takePicture, 200);
    return () => clearInterval(intervalId);
  }, []);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          Grant permission to access the camera...
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {hasResult ? (
        <Image source={{ uri: base64Image }} style={{ height: "50%" }} />
      ) : (
        <View></View>
      )}

      <View style={{ width: "100%", height: "100%" }}>
        <CameraView
          style={styles.camera}
          onCameraReady={onCameraReady}
          ref={cameraRef}
          mute={true}
        >
          <Text style={{ color: "white" }}>qqq</Text>
        </CameraView>
      </View>

      <View style={styles.overlay}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    justifyContent: "flex-end",
  },
  overlay: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  captureButton: {
    backgroundColor: "#ff6347",
    padding: 15,
    borderRadius: 50,
    width: 100,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default CameraComponent;
