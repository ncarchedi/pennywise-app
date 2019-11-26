import React from "react";
import { Text } from "react-native";

import Colors from "../constants/Colors";

export default function TabBarLabel(props) {
  return (
    <Text
      style={{
        fontSize: 11,
        marginBottom: 2,
        color: props.focused ? Colors.tabIconSelected : Colors.tabIconDefault
      }}
    >
      {props.label}
    </Text>
  );
}
