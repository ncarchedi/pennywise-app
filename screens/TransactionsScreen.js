import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import TransactionsList from "../components/TransactionsList";
import EditTransactionModal from "../components/EditTransactionModal";

import { withGlobalContext } from '../GlobalContext';

class TransactionsScreen extends React.Component {
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

  render() {
    const transactions = this.props.global.transactions;
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
            categorized={true}
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

export default withGlobalContext(TransactionsScreen);

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
