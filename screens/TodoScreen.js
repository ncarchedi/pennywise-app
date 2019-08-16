import React from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  RefreshControl
} from "react-native";

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
    isPlaidLinkVisible: false,
    refreshing: false
  };

  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };

  togglePlaidLinkModal = () => {
    this.setState({ isPlaidLinkVisible: !this.state.isPlaidLinkVisible });
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

  handleRefresh = async () => {
    const { getPlaidTransactions } = this.props.global;

    console.log("refreshing todo list");

    this.setState({ refreshing: true });
    await getPlaidTransactions();
    this.setState({ refreshing: false });
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

  handleDeleteTransaction = id => {
    const { deleteTransaction } = this.props.global;

    this.toggleModal();
    deleteTransaction(id);
  };

  render() {
    console.log("rendering todo screen...");

    const { transactions, categories } = this.props.global;
    const {
      selectedTransaction,
      isModalVisible,
      isPlaidLinkVisible,
      refreshing
    } = this.state;

    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.handleRefresh}
            />
          }
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
            onDeleteTransaction={this.handleDeleteTransaction}
          />
          <PlaidLinkModal
            isVisible={isPlaidLinkVisible}
            onExitModal={this.togglePlaidLinkModal}
          />
        </ScrollView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={this.handleAddNewTransaction}>
            <Ionicons name="ios-add" size={80} />
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
  buttonContainer: {
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "rgba(211, 211, 211, 0.7)",
    position: "absolute",
    bottom: 0,
    width: "100%"
  }
});
