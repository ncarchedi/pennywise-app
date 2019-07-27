import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function AnalyticsScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.analyticsContainer}>
          <Text style={styles.analyticsText}>
            This will show some spending analytics.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

AnalyticsScreen.navigationOptions = {
  title: "Analytics"
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
  analyticsContainer: {
    alignItems: "center"
  },
  analyticsText: {
    fontSize: 17,
    color: "rgba(96, 100, 109, 1)",
    lineHeight: 24
  }
});
