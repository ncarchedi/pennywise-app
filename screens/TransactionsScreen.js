import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import _ from "lodash";

import TransactionsList from "../components/TransactionsList";

import { withGlobalContext } from "../GlobalContext";

class TransactionsScreen extends React.Component {
  static navigationOptions = {
    title: "Transactions"
  };

  handleTransactionPress = transaction => {
    this.props.navigation.navigate("EditModalTransactions", { transaction });
  };

  handleDeleteTransaction = transaction => {
    const { deleteTransaction } = this.props.global;
    const  id  = transaction.id;
    this.props.navigation.goBack();
    deleteTransaction(id);
    };

  render() {
    // console.log("rendering transactions screen...");

    const { categories } = this.props.global;
    const transactions = this.props.global.listTransactions();

    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          <TransactionsList
            transactions={transactions}
            categories={categories}
            onTransactionEdit={this.handleTransactionPress}
            onRightClick={this.handleDeleteTransaction}
            categorized={true}
          />
        </ScrollView>
      </View>
    );
  }
}

export default withGlobalContext(TransactionsScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  contentContainer: {}
});
