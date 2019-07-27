import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import TransactionsList from "../components/TransactionsList";
import transactionsData from "../transactions.json";

export default class TransactionsScreen extends React.Component {
  state = {
    transactions: []
  };

  componentDidMount() {
    this.setState({
      transactions: transactionsData
    });
  }

  render() {
    const { transactions } = this.state;

    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <TransactionsList transactions={transactions} />
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
