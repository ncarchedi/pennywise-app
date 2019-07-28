import React from "react";
import { ScrollView, StyleSheet, View, Button, Text } from "react-native";
import Modal from "react-native-modal";

import TransactionsList from "../components/TransactionsList";
import transactionsData from "../transactions.json";

export default class TransactionsScreen extends React.Component {
  state = {
    transactions: [],
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

  render() {
    const { transactions } = this.state;

    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <TransactionsList transactions={transactions} />
          <Button title="Edit Transaction" onPress={this.toggleModal} />
          <Modal
            isVisible={this.state.isModalVisible}
            backdropOpacity={1}
            backdropColor="#fff"
            style={styles.transactionModal}
          >
            <View style={styles.transactionModalText}>
              <Text>This is where you will edit a transaction.</Text>
              <Button title="Go Back" onPress={this.toggleModal} />
            </View>
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
    paddingTop: 30,
    paddingHorizontal: 20,
    alignItems: "center"
  },
  transactionModalText: {
    fontSize: 17,
    color: "rgba(96, 100, 109, 1)",
    lineHeight: 24
  }
});
