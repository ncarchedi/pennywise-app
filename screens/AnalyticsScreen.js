import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { withGlobalContext } from "../GlobalContext";

class AnalyticsScreen extends React.Component {
  static navigationOptions = {
    title: "Analytics"
  };

  render() {
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
}

export default withGlobalContext(AnalyticsScreen);

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
