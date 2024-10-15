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

const CameraComponent = () => {
  const cameraRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [base64Image, setBase64Image] = useState("");

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
          quality: 0.05,
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

      const response = await fetch(
        "http://10.18.91.61:5000/crosswalk_detection",
        {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        }
      );
      const result = await response.json();

      setBase64Image(result["annotated_img"]);
      setHasResult(true);
    } catch (error) {
      console.error("ERROR [Processing Image]:", error);
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
    }, 200);
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

      <View style={styles.overlay}>
        <TouchableOpacity style={styles.captureButton} onPress={() => {}}>
          <Text style={styles.buttonText}>Capture</Text>
        </TouchableOpacity>
      </View>
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
