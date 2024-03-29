import React from "react";
import { StyleSheet, View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Colors from "../constants/Colors";

export default TextInputWithIcon = ({
  icon,
  fakeTheInput,
  fakeValue,
  ...props
}) => {
  return (
    <View style={styles.inputContainer}>
      <View style={styles.inputIcon}>
        <Ionicons name={icon} size={25} />
      </View>
      {fakeTheInput ? (
        <TouchableOpacity style={styles.textInput} {...props}>
          {fakeValue}
        </TouchableOpacity>
      ) : (
        <TextInput
          clearButtonMode="while-editing"
          style={styles.textInput}
          {...props}
        ></TextInput>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: Colors.veryLightGrey,
    borderRadius: 5,
    borderWidth: 1,
    marginVertical: 5
  },
  inputIcon: {
    marginHorizontal: 10,
    minWidth: 25,
    alignItems: "center"
  },
  textInput: {
    padding: 10,
    height: 40,
    flex: 1,
    borderLeftWidth: 1,
    borderColor: Colors.veryLightGrey
  }
});
