import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function TransactionsScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.transactionsContainer}>
          <Text style={styles.transactionsText}>
            This will be a list of all transactions.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

TransactionsScreen.navigationOptions = {
  title: "Transactions"
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
  transactionsContainer: {
    alignItems: "center"
  },
  transactionsText: {
    fontSize: 17,
    color: "rgba(96,100,109, 1)",
    lineHeight: 24,
    textAlign: "center"
  }
});
