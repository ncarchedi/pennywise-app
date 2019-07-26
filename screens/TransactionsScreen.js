import React from "react";
import { ScrollView, StyleSheet, Text, View, SectionList } from "react-native";

import TransactionsList from "../components/TransactionsList";

export default class TransactionsScreen extends React.Component {
  state = {
    transactions: {
      new: [
        {
          date: "Thursday, July 25",
          data: [{ name: "Amazon.com", amount: "84.33" }]
        },
        {
          date: "Wednesday, July 24",
          data: [
            { name: "Union Square Cafe", amount: "104.00" },
            { name: "ACME, Inc.", amount: "21.99" },
            { name: "The Corner Store", amount: "9.95" }
          ]
        },
        {
          date: "Tuesday, July 23",
          data: [{ name: "Ace Hardware", amount: "25.99" }]
        }
      ],
      categorized: [
        {
          date: "Monday, July 22",
          data: [{ name: "Whole Foods", amount: "49.45" }]
        },
        {
          date: "Saturday, July 20",
          data: [
            { name: "Netflix", amount: "14.99" },
            { name: "Tequila Sunrise", amount: "75.25" }
          ]
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
