import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function TodoScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.todoContainer}>
          <Text style={styles.todoText}>
            This will show all new transactions.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

TodoScreen.navigationOptions = {
  title: "To Do"
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  contentContainer: {
    paddingTop: 30,
    paddingHorizontal: 20
  },
  todoContainer: {
    alignItems: "center"
  },
  todoText: {
    fontSize: 17,
    color: "rgba(96, 100, 109, 1)",
    lineHeight: 24
  }
});
