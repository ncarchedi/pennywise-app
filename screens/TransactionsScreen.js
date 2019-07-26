import React from "react";
import { ScrollView, StyleSheet, Text, View, SectionList } from "react-native";

import TransactionsList from "../components/TransactionsList";

export default class TransactionsScreen extends React.Component {
  state = {
    transactions: {
      new: [
        { title: "Thursday, July 25", data: ["Amazon.com"] },
        {
          title: "Wednesday, July 24",
          data: ["Union Square Cafe", "ACME, Inc.", "The Corner Store"]
        },
        { title: "Tuesday, July 23", data: ["Ace Hardware"] }
      ],
      categorized: [
        { title: "Monday, July 22", data: ["Whole Foods"] },
        {
          title: "Saturday, July 20",
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
          <Text style={styles.transactionsListHeader}>New</Text>
          <TransactionsList transactions={transactions.new} />
          <Text style={[styles.transactionsListHeader, { marginTop: 20 }]}>
            Categorized
          </Text>
          <TransactionsList transactions={transactions.categorized} />
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
    paddingTop: 30,
    paddingHorizontal: 20
  },
  transactionsListHeader: {
    fontSize: 34,
    marginBottom: 10,
    backgroundColor: "lightgrey"
  },
  transactionsDateHeader: {
    fontSize: 22,
    marginTop: 10
  },
  transactionsListItem: {
    fontSize: 17,
    color: "rgba(96, 100, 109, 1)",
    marginVertical: 15
  }
});
