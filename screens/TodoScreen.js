import React from "react";
import { ScrollView, StyleSheet, View, TouchableOpacity } from "react-native";

import TransactionsList from "../components/TransactionsList";
import EditTransactionModal from "../components/EditTransactionModal";
import { Ionicons } from "@expo/vector-icons";
import _ from "lodash";

import {
  withGlobalContext,
  addTransaction,
  updateTransaction
} from "../GlobalContext";

class TodoScreen extends React.Component {
  static navigationOptions = {
    title: "To Do"
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

  handleAddNewTransaction = () => {
    const { addTransaction } = this.props.global;
    this.handleTransactionPress(addTransaction());
  };

  handleExitModal = () => {
    const { updateTransaction } = this.props.global;
    const { selectedTransaction } = this.state;

    updateTransaction(selectedTransaction);
    this.toggleModal();
  };

  handleChangeTransaction = (key, value) => {
    const { selectedTransaction } = this.state;
    const newSelectedTransaction = { ...selectedTransaction, [key]: value };

    this.setState({ selectedTransaction: newSelectedTransaction });
  };

  render() {
    console.log("rendering todo screen...");

    const { transactions } = this.props.global;
    const { selectedTransaction, isModalVisible } = this.state;

    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <TransactionsList
            transactions={transactions}
            onTransactionPress={this.handleTransactionPress}
            categorized={false}
          />
          <EditTransactionModal
            transaction={selectedTransaction}
            isVisible={isModalVisible}
            onExitModal={this.handleExitModal}
            onChangeTransaction={this.handleChangeTransaction}
          />
        </ScrollView>
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            onPress={this.handleAddNewTransaction}
            style={styles.newTransactionButton}
          >
            <Ionicons name="ios-add" size={40} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default withGlobalContext(TodoScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  contentContainer: {
    // marginVertical: 10
  },
  newTransactionButton: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    borderRadius: 30
  }
});
