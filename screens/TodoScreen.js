import React from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  RefreshControl
} from "react-native";

import TransactionsList from "../components/TransactionsList";
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

  state = { refreshing: false };

  componentDidMount() {
    // necessary for parameterizing the header bar button. See:
    // https://reactnavigation.org/docs/en/header-buttons.html#adding-a-button-to-the-header
    this.props.navigation.setParams({
      addTransaction: this.handleAddNewTransaction
    });
  }

  handleTransactionPress = transaction => {
    this.props.navigation.navigate("EditModalTodo", { transaction });
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

  render() {
    console.log("rendering todo screen...");

    const { transactions, categories } = this.props.global;
    const { refreshing } = this.state;

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
