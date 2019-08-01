import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import _ from "lodash";

import TransactionsList from "../components/TransactionsList";
import EditTransactionModal from "../components/EditTransactionModal";

import { withGlobalContext } from "../GlobalContext";

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

  handleTransactionPress = item => {
    this.setState({
      selectedTransaction: item
    });
    this.toggleModal();
  };

  render() {
    const transactions = this.props.global.transactions;
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
            onExitModal={this.toggleModal}
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
    paddingBottom: 30
  }
});
