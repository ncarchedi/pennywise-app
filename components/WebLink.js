import React from "react";
import { Text } from "react-native";
import * as WebBrowser from "expo-web-browser";

export default WebLink = ({ text, url }) => {
  return (
    <Text
      style={{ textDecorationLine: "underline" }}
      onPress={() => WebBrowser.openBrowserAsync(url)}
    >
      {text}
    </Text>
  );
};
