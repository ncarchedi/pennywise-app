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
import { Ionicons } from "@expo/vector-icons";
import _ from "lodash";

import { withGlobalContext } from "../GlobalContext";

class TodoScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "To Do",
      headerRight: (
        <TouchableOpacity
          onPress={navigation.getParam("addTransaction")}
          style={{ marginRight: 20 }}
        >
          <Ionicons name="ios-add" size={40} />
        </TouchableOpacity>
      )
    };
  };

  state = {
    selectedTransaction: {},
    isPlaidLinkVisible: false,
    refreshing: false
  };

  componentDidMount() {
    // necessary for parameterizing the header bar button. See:
    // https://reactnavigation.org/docs/en/header-buttons.html#adding-a-button-to-the-header
    this.props.navigation.setParams({
      addTransaction: this.handleAddNewTransaction
    });
  }

  togglePlaidLinkModal = () => {
    this.setState({ isPlaidLinkVisible: !this.state.isPlaidLinkVisible });
  };

  handleTransactionPress = transaction => {
    this.setState(
      {
        selectedTransaction: transaction
      },
      // open modal after state is set
      () =>
        this.props.navigation.navigate("EditModalTodo", {
          transaction: this.state.selectedTransaction,
          onExitModal: this.handleExitModal,
          onChangeTransaction: this.handleChangeTransaction,
          onDeleteTransaction: this.handleDeleteTransaction
        })
    );
  };

  handleRefresh = async () => {
    const { getPlaidTransactions, scheduleNotifications } = this.props.global;

    // We should probably do this somewhere else, but for now it's good enough
    // Goal: make sure people that use the app get notifications by scheduling them for the next 7 days
    scheduleNotifications();

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
    this.props.navigation.navigate("Todo");
  };

  handleChangeTransaction = (key, value) => {
    const { selectedTransaction } = this.state;
    const newSelectedTransaction = { ...selectedTransaction, [key]: value };

    this.setState({ selectedTransaction: newSelectedTransaction });
  };

  handleDeleteTransaction = id => {
    const { deleteTransaction } = this.props.global;

    this.props.navigation.navigate("Todo");
    deleteTransaction(id);
  };

  render() {
    console.log("rendering todo screen...");

    const { transactions, categories } = this.props.global;
    const { isPlaidLinkVisible, refreshing } = this.state;

    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
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
          <PlaidLinkModal
            isVisible={isPlaidLinkVisible}
            onExitModal={this.togglePlaidLinkModal}
          />
        </ScrollView>
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
  contentContainer: {}
});
