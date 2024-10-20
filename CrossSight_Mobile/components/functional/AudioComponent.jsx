import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";

import { Audio } from "expo-av";

const AudioComponent = () => {
  const [audioPermissionResponse, requestAudioPermission] =
    Audio.usePermissions();
  const [recording, setRecording] = useState();
  const [transcription, setTranscription] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  async function startRecording() {
    try {
      if (audioPermissionResponse.status !== "granted") {
        console.log("Requesting audio permission..");
        await requestAudioPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.LOW_QUALITY
      );
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    console.log("Stopping recording..");
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    console.log("Recording stopped and stored at", uri);
    await sendAudioToServer(uri);
  }

  async function sendAudioToServer(uri) {
    setIsTranscribing(true);
    setTranscription("");
    const serverUrl = "http://192.168.86.184:5001/transcribe"; // Update this

    try {
      console.log("Preparing to send audio file:", uri);

      const formData = new FormData();
      formData.append("file", {
        uri: uri,
        type: "audio/wav",
        name: "audio.wav",
      });

      console.log("Sending request to server:", serverUrl);

      const response = await fetch(serverUrl, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseText = await response.text();
      console.log("Raw server response:", responseText);

      let result;
      try {
        result = JSON.parse(responseText);
        console.log("Parsed server response:", result);
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        throw new Error("Invalid JSON response from server");
      }

      if (result !== undefined) {
        console.log("Transcription:", result);
        setTranscription(result);
        console.log("Transcription set");
      } else {
        setTranscription("Error: Unable to transcribe audio");
      }
    } catch (error) {
      console.error("Detailed error:", error);
      setTranscription(`Error: ${error.message}`);
    } finally {
      setIsTranscribing(false);
    }
  }
  return (
    <TouchableOpacity
      style={{ position: "absolute", zIndex: 100 }}
      onPress={recording ? stopRecording : startRecording}
    >
      <Image
        source={require("@/assets/images/camera.png")}
        style={styles.cameraOverlay}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cameraOverlay: {
    alignSelf: "center",
    height: 320,
    width: 320,
    // position: "absolute",
    top: 242,
    left: "10.1%",
    right: 0,
    // translateX: "100%",
    zIndex: 1000000,
  },
});

export default AudioComponent;
