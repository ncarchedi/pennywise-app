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
            This will be some killer analytics.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

AnalyticsScreen.navigationOptions = {
  header: null
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  contentContainer: {
    paddingTop: 30,
    paddingHorizontal: 10
  },
  analyticsContainer: {
    alignItems: "center",
    marginTop: 40
  },
  analyticsText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    lineHeight: 24,
    textAlign: "center"
  }
});
