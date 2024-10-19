import React, { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import * as Speech from "expo-speech";
import { Audio } from "expo-av";

const CrossTalk = () => {
  const soundObject = new Audio.Sound();

  const SERVER_PREFIX = "http://";
  const SERVER_IP_ADDRESS = "192.168.50.17";
  const SERVER_PORT = "5000";

  const ASK_ADDRESS =
    SERVER_PREFIX +
    SERVER_IP_ADDRESS +
    ":" +
    SERVER_PORT +
    "/get_crosswalk_data";

  const speak = async () => {
    const text = "Q";
    Speech.speak(text, {
      language: "en-US",
      pitch: 0.7,
      rate: 1.0,
    });
  };

  useEffect(() => {
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
    });
    soundObject.loadAsync(require("@/assets/silent.mp3"));
    soundObject.playAsync();
    const intervalId = setInterval(() => {
      speak();
    }, 2000);
    return () => clearInterval(intervalId);
  }, []);

  return <View></View>;
};

export default CrossTalk;
