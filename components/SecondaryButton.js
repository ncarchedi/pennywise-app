import React from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

export default function SecondaryButton({ buttonText, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.secondaryButton}>
      <Text style={styles.secondaryButtonText}>{buttonText}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  secondaryButton: {
    alignItems: "center",
    marginVertical: 6,
    paddingVertical: 10
  },
  secondaryButtonText: {
    fontSize: 17,
    textAlign: "center"
  }
});
