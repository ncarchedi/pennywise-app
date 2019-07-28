import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import TransactionsList from "../components/TransactionsList";
import EditTransactionModal from "../components/EditTransactionModal";
import transactionsData from "../transactions.json";

export default class TransactionsScreen extends React.Component {
  state = {
    transactions: [],
    selectedTransaction: {},
    isModalVisible: false
  };

  componentDidMount() {
    this.setState({
      transactions: transactionsData
    });
  }

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
    const { transactions, selectedTransaction, isModalVisible } = this.state;

    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <TransactionsList
            transactions={transactions}
            onTransactionPress={this.handleTransactionPress}
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
