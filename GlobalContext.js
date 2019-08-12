import React from "react";
import { AsyncStorage } from "react-native";
import transactionsData from "./transactions.json";
import categoriesData from "./categories.json";
import { createNewTransaction } from "./utils/TransactionUtils";

const GlobalContext = React.createContext({});

export class GlobalContextProvider extends React.Component {
  state = {
    transactions: [],
    categories: []
  };

  componentDidMount = async () => {
    try {
      const transactionsRaw = JSON.parse(
        await AsyncStorage.getItem("transactions")
      );

      const transactions = transactionsRaw.map(t => ({
        id: t.id,
        name: t.name,
        amount: t.amount,
        category: t.category,
        date: new Date(t.date)
      }));

      this.setState({ transactions });
    } catch (error) {
      console.log(error.message);
    }

    this.setState({ categories: categoriesData });
  };

  addTransaction = async () => {
    const { transactions } = this.state;
    const newTransaction = createNewTransaction();

    const updatedTransactions = [...transactions, newTransaction];

    try {
      await AsyncStorage.setItem(
        "transactions",
        JSON.stringify(updatedTransactions)
      );
    } catch (error) {
      console.log(error.message);
    }

    this.setState({
      transactions: updatedTransactions
    });

    return newTransaction;
  };

  updateTransaction = async attrs => {
    const { transactions } = this.state;

    const updatedTransactions = transactions.map(transaction => {
      if (transaction.id === attrs.id) {
        const { name, amount, category, date } = attrs;

        const updatedTransaction = {
          ...transaction,
          name,
          amount,
          category,
          date
        };

        // if it's a match, then return the updated transaction
        return updatedTransaction;
      }

      //  else, return the original transaction
      return transaction;
    });

    try {
      await AsyncStorage.setItem(
        "transactions",
        JSON.stringify(updatedTransactions)
      );
    } catch (error) {
      console.log(error.message);
    }

    this.setState({ transactions: updatedTransactions });
  };

  clearAllTransactions = async () => {
    console.log("clearing all transactions...");

    try {
      await AsyncStorage.removeItem("transactions");
    } catch (error) {
      console.log(error.message);
    }

    this.setState({ transactions: [] });
  };

  loadDummyData = async () => {
    console.log("loading dummy data...");

    const dummyData = transactionsData.map(t => ({
      id: t.id,
      name: t.name,
      amount: t.amount,
      category: t.category,
      date: new Date(t.date)
    }));

    try {
      await AsyncStorage.setItem("transactions", JSON.stringify(dummyData));
    } catch (error) {
      console.log(error.message);
    }

    this.setState({ transactions: dummyData });
  };

  render() {
    return (
      <GlobalContext.Provider
        value={{
          ...this.state,
          // Every function to update the state should be listed here:
          addTransaction: this.addTransaction,
          updateTransaction: this.updateTransaction,
          clearAllTransactions: this.clearAllTransactions,
          loadDummyData: this.loadDummyData
        }}
      >
        {this.props.children}
      </GlobalContext.Provider>
    );
  }
}

// create the consumer as higher order component
export const withGlobalContext = ChildComponent => props => (
  <GlobalContext.Consumer>
    {context => <ChildComponent {...props} global={context} />}
  </GlobalContext.Consumer>
);
