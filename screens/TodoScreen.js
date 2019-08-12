import React from "react";
import { ScrollView, StyleSheet, View, TouchableOpacity } from "react-native";

import TransactionsList from "../components/TransactionsList";
import PlaidLinkModal from "../components/PlaidLinkModal";
import EditTransactionModal from "../components/EditTransactionModal";
import { Ionicons } from "@expo/vector-icons";
import _ from "lodash";

import { withGlobalContext } from "../GlobalContext";

class TodoScreen extends React.Component {
  static navigationOptions = {
    title: "To Do"
  };

  state = {
    selectedTransaction: {},
    isModalVisible: false,
    isPlaidLinkVisible: false
  };

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  togglePlaidLinkModal = () => {
    this.setState({ isPlaidLinkVisible: !this.state.isPlaidLinkVisible });
  };

  // handleTransactionPress = item => {
  //   this.setState({
  //     selectedTransaction: item
  //   });
  //   this.toggleModal();
  // };

  handlePlaidSyncPress = item => {
    this.props.global.getPlaidTransactions();
  };

  // handleAddNewTransaction = () => {
  //   const newTransaction = {
  //     name: "",
  //     amount: null,
  //     category: "No Category",
  //     date: new Date(_.now())
  //   };
  //   this.handleTransactionPress(newTransaction);
  // };

  handleTransactionPress = transaction => {
    this.setState(
      {
        selectedTransaction: transaction
      },
      // open modal after state is set
      () => this.toggleModal()
    );
  };

  handleAddNewTransaction = async () => {
    const { addTransaction } = this.props.global;
    this.handleTransactionPress(await addTransaction());
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

    const { transactions, categories } = this.props.global;
    const {
      selectedTransaction,
      isModalVisible,
      isPlaidLinkVisible
    } = this.state;

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
            categorized={false}
          />
          <EditTransactionModal
            transaction={selectedTransaction}
            isVisible={isModalVisible}
            onExitModal={this.handleExitModal}
            onChangeTransaction={this.handleChangeTransaction}
          />
          <PlaidLinkModal
            isVisible={isPlaidLinkVisible}
            onExitModal={this.togglePlaidLinkModal}
          />
        </ScrollView>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center"
          }}
        >
          <TouchableOpacity
            onPress={this.handleAddNewTransaction}
            style={styles.newTransactionButton}
          >
            <Ionicons name="ios-add" size={80} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.handlePlaidSyncPress}
            style={styles.syncTransactionsButton}
          >
            <Ionicons name="ios-sync" size={50} />
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
  contentContainer: {},
  newTransactionButton: {},
  syncTransactionsButton: {}
});
