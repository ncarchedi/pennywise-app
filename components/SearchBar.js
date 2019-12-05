import React from "react";
import { TextInput, StyleSheet } from "react-native";

import Colors from "../constants/Colors";

export default SearchBar = ({ placeholder, onChangeText, style, ...props }) => {
  return (
    <TextInput
      placeholder={placeholder}
      onChangeText={onChangeText}
      style={[styles.searchBar, { ...style }]}
      autoCorrect={false}
      clearButtonMode="while-editing"
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  searchBar: {
    height: 40,
    padding: 10,
    marginTop: 10,
    marginBottom: 5,
    borderColor: Colors.veryLightGrey,
    borderRadius: 5,
    borderWidth: 1
  }
});
