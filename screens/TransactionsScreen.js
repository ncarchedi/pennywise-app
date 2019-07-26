import React from "react";
import { ScrollView, StyleSheet, Text, View, SectionList } from "react-native";

import TransactionsList from "../components/TransactionsList";

export default class TransactionsScreen extends React.Component {
  state = {
    transactions: {
      new: [
        { date: "Thursday, July 25", data: ["Amazon.com"] },
        {
          date: "Wednesday, July 24",
          data: ["Union Square Cafe", "ACME, Inc.", "The Corner Store"]
        },
        { date: "Tuesday, July 23", data: ["Ace Hardware"] }
      ],
      categorized: [
        { date: "Monday, July 22", data: ["Whole Foods"] },
        {
          date: "Saturday, July 20",
          data: ["Netflix", "Tequila Sunrise"]
        }
      ]
    }
  };

  render() {
    const { transactions } = this.state;

    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <TransactionsList header="New" transactions={transactions.new} />
          <TransactionsList
            header="Categorized"
            transactions={transactions.categorized}
          />
        </ScrollView>
      </View>
    );
  }
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
    paddingBottom: 30
  }
});
