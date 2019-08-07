import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import _ from "lodash";

import TransactionsList from "../components/TransactionsList";
import EditTransactionModal from "../components/EditTransactionModal";

import { withGlobalContext, updateTransaction } from "../GlobalContext";

class TransactionsScreen extends React.Component {
  static navigationOptions = {
    title: "Transactions"
  };

  state = {
    selectedTransaction: {},
    isModalVisible: false
  };

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  handleTransactionPress = transaction => {
    this.setState(
      {
        selectedTransaction: transaction
      },
      // open modal after state is set
      () => this.toggleModal()
    );
  };

  handleChangeTransaction = (key, value) => {
    const { selectedTransaction } = this.state;
    const newSelectedTransaction = { ...selectedTransaction, [key]: value };

    this.setState({ selectedTransaction: newSelectedTransaction });
  };

  handleExitModal = () => {
    const { updateTransaction } = this.props.global;
    const { selectedTransaction } = this.state;

    updateTransaction(selectedTransaction);
    this.toggleModal();
  };

  render() {
    console.log("rendering transactions screen...");

    const { transactions } = this.props.global;
    const { selectedTransaction, isModalVisible } = this.state;

    const transactionsByDate = _(transactions)
      .groupBy("date")
      .map((transactions, date) => ({
        date: date,
        data: transactions
      }))
      .sortBy("date")
      .value();

    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <TransactionsList
            transactions={transactionsByDate}
            onTransactionPress={this.handleTransactionPress}
            categorized={true}
          />
          <EditTransactionModal
            transaction={selectedTransaction}
            isVisible={isModalVisible}
            onExitModal={this.handleExitModal}
            onChangeTransaction={this.handleChangeTransaction}
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
  contentContainer: {
    // marginVertical: 10
  }
});
