import React from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  RefreshControl,
  Alert
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

  state = {
    refreshing: false,
    statusMessage: null
  };

  componentDidMount() {
    // necessary for parameterizing the header bar button. See:
    // https://reactnavigation.org/docs/en/header-buttons.html#adding-a-button-to-the-header
    this.props.navigation.setParams({
      addTransaction: this.handleAddNewTransaction
    });

    // When the Todoscreen is shown for the first time in a session, refresh
    this.handleRefresh();
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
    const result = await getPlaidTransactions();
    this.setState({ refreshing: false });

    if (result.error) {
      Alert.alert("Error while downloading transactions", result.message, {
        cancelable: false
      });
    } else if (result.transactions.length === 0) {
      this.setState({ statusMessage: "No new transactions available." });
    }
  };

  handleAddNewTransaction = async () => {
    const { addTransaction } = this.props.global;

    this.handleTransactionPress(await addTransaction());
  };

  render() {
    const { transactions, categories } = this.props.global;
    const { refreshing, statusMessage } = this.state;

    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
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
            statusMessage={statusMessage}
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
