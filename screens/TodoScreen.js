import React from "react";
import { ScrollView, StyleSheet, View, TouchableOpacity } from "react-native";

import TransactionsList from "../components/TransactionsList";
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

  handleAddNewTransaction = () => {
    const newTransaction = {
      name: "",
      amount: null,
      category: "No Category",
      date: new Date(_.now())
    };
    this.handleTransactionPress(newTransaction);
  };

  render() {
    transactions = this.props.global.transactions;
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
            categorized={false}
          />
          <EditTransactionModal
            transaction={selectedTransaction}
            isVisible={isModalVisible}
            onExitModal={this.toggleModal}
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
