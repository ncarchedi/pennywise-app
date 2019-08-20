import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import _ from "lodash";

import TransactionsList from "../components/TransactionsList";

import { withGlobalContext } from "../GlobalContext";

class TransactionsScreen extends React.Component {
  static navigationOptions = {
    title: "Transactions"
  };

  state = {
    selectedTransaction: {}
  };

  handleTransactionPress = transaction => {
    this.setState(
      {
        selectedTransaction: transaction
      },
      // open modal after state is set
      () =>
        this.props.navigation.navigate("EditModalTransactions", {
          transaction: this.state.selectedTransaction,
          onExitModal: this.handleExitModal,
          onChangeTransaction: this.handleChangeTransaction,
          onDeleteTransaction: this.handleDeleteTransaction
        })
    );
  };

  handleChangeTransaction = (key, value) => {
    const { selectedTransaction } = this.state;
    const newSelectedTransaction = { ...selectedTransaction, [key]: value };

    this.setState({ selectedTransaction: newSelectedTransaction });
  };

  handleDeleteTransaction = id => {
    const { deleteTransaction } = this.props.global;

    this.props.navigation.navigate("Transactions");
    deleteTransaction(id);
  };

  handleExitModal = () => {
    const { updateTransaction } = this.props.global;
    const { selectedTransaction } = this.state;

    updateTransaction(selectedTransaction);
    this.props.navigation.navigate("Transactions");
  };

  render() {
    console.log("rendering transactions screen...");

    const { transactions, categories } = this.props.global;

    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <TransactionsList
            transactions={transactions}
            categories={categories}
            onTransactionPress={this.handleTransactionPress}
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
