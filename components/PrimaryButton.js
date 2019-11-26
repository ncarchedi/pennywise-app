import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

import Colors from "../constants/Colors";

export default function PrimaryButton({ buttonText, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.primaryButton}>
      <Text style={styles.primaryButtonText}>{buttonText}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primaryButton: {
    alignItems: "center",
    marginVertical: 6,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: Colors.darkGreen
  },
  primaryButtonText: {
    fontSize: 17,
    textAlign: "center",
    color: Colors.white,
    fontWeight: "bold"
  }
});
