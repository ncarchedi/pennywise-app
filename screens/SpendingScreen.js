import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function LinksScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.spendingContainer}>
          <Text style={styles.spendingText}>
            This will show recent spending by category.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

LinksScreen.navigationOptions = {
  title: "Spending"
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
  spendingContainer: {
    // alignItems: "center"
  },
  spendingText: {
    fontSize: 17,
    color: "rgba(96, 100, 109, 1)",
    lineHeight: 24
  }
});
