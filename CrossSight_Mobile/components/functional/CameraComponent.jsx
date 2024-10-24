import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Button,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Camera } from "expo-camera/legacy";
import AudioComponent from "./AudioComponent";

const CameraComponent = () => {
  const SERVER_PREFIX = "http://";
  const SERVER_IP_ADDRESS = "192.168.86.184";
  const SERVER_PORT = "5001";

  const ASK_ADDRESS =
    SERVER_PREFIX + SERVER_IP_ADDRESS + ":" + SERVER_PORT + "/";

  const cameraRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [base64Image, setBase64Image] = useState("");
  const [mapVisible, setMapVisible] = useState(false);

  useEffect(() => {
    const requestCameraPermission = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    };

    requestCameraPermission();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current && isCameraReady) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.1,
        });

        await sendPhotoToServer(photo.uri);
      } catch (error) {
        console.error("ERROR [Capture]", error);
      }
    } else {
      console.log("CAMERA NOT READY");
    }
  };

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

  const onCameraReady = () => {
    console.log("CAMERA READY");
    setIsCameraReady(true);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isCameraReady) {
        takePicture();
      }
    }, 450);
    return () => clearInterval(intervalId);
  }, [isCameraReady]);

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }

  if (hasPermission === false) {
    return <Text>Camera permission denied.</Text>;
  }

  return (
    <View style={styles.container}>
      {hasResult ? (
        <Image
          source={{ uri: `data:image/png;base64,${base64Image}` }}
          style={{ height: "50%" }}
        />
      ) : (
        <View></View>
      )}

      <Camera
        style={styles.camera}
        ref={cameraRef}
        onCameraReady={onCameraReady}
      ></Camera>
      {/* <View style={styles.overlay}>
        <TouchableOpacity style={styles.captureButton} onPress={() => {}}>
          <Text style={styles.buttonText}>Capture</Text>
        </TouchableOpacity>
      </View> */}
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
