import React from "react";
import { ScrollView, StyleSheet, View, Button, Text } from "react-native";
import Modal from "react-native-modal";

import TransactionsList from "../components/TransactionsList";
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
    const { transactions } = this.state;

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
          <Modal
            isVisible={this.state.isModalVisible}
            backdropOpacity={0.95}
            backdropColor="#fff"
            animationInTiming={50}
            backdropTransitionInTiming={50}
            style={styles.transactionModal}
          >
            <Text>{this.state.selectedTransaction.name}</Text>
            <Text>{this.state.selectedTransaction.amount}</Text>
            <Text>{this.state.selectedTransaction.category}</Text>
            <Text>{this.state.selectedTransaction.date}</Text>
            <Button title="Go Back" onPress={this.toggleModal} />
          </Modal>
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
  },
  transactionModal: {
    alignItems: "center"
  }
});
