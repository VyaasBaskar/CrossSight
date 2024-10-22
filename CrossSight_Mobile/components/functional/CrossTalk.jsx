import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import * as Speech from "expo-speech";
import { Audio } from "expo-av";

const CrossTalk = () => {
  const soundObject = new Audio.Sound();

  const SERVER_PREFIX = "http://";
  const SERVER_IP_ADDRESS = "10.18.92.135";
  const SERVER_PORT = "5000";

  const ASK_ADDRESS =
    SERVER_PREFIX + SERVER_IP_ADDRESS + ":" + SERVER_PORT + "/get_voice_cmd";

  const speak = async () => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      volume: 1.0,
    });
    soundObject.loadAsync(require("@/assets/silent.mp3"));
    soundObject.playAsync();
    const response = await fetch(ASK_ADDRESS, {
      method: "GET",
    });
    const result = await response.json();
    if (result["success"] == 1 || result["success"] == "1") {
      Speech.speak(result["text"], {
        language: "en-US",
        pitch: 0.7,
        rate: 1.0,
        volume: 1.0,
      });
      console.log(result["text"]);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      speak();
    }, 500);
    return () => clearInterval(intervalId);
  }, []);

  return <View></View>;
};

export default CrossTalk;
