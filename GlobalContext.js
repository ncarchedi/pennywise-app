import React from "react";
import { AsyncStorage } from "react-native";
import transactionsData from "./transactions.json";
import categoriesData from "./categories.json";
import { createNewTransaction, convertToISO } from "./utils/TransactionUtils";

const GlobalContext = React.createContext({});

const BACKEND_DEV = 'http://localhost:5001/conscious-spending-backend/us-central1/getPlaidTransactions'
const BACKEND_PROD = 'https://us-central1-conscious-spending-backend.cloudfunctions.net/getPlaidTransactions'

const BACKEND_URL = BACKEND_PROD

export class GlobalContextProvider extends React.Component {
  state = {
    transactions: [],
    categories: [],
    access_token: ''
  };

  componentDidMount = async () => {
    try {
      const transactions = JSON.parse(
        await AsyncStorage.getItem("transactions")
      );

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
  }

  getAccessTokenFromPublicToken = (publicToken) => {
    console.log('public token');
    console.log(publicToken);
    
    return fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        public_token: publicToken,
      }),
    }).then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      return responseJson;
    })
    .catch((error) => {
      console.error(error);
    });
  }

  // We should make methods to update the state like this:
  // switchToOnline = () => {
  //   this.setState({ isOnline: true });
  // }

  updateTransaction = async attrs => {
    const { transactions } = this.state;

    const updatedTransactions = transactions.map(transaction => {
      if (transaction.id === attrs.id) {
        const { name, amount, category, date } = attrs;
        const dateString = convertToISO(date);

        const updatedTransaction = {
          ...transaction,
          name: name,
          amount: amount,
          category: category,
          date: dateString
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

    try {
      await AsyncStorage.setItem(
        "transactions",
        JSON.stringify(transactionsData)
      );
    } catch (error) {
      console.log(error.message);
    }

    this.setState({ transactions: transactionsData });
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
          loadDummyData: this.loadDummyData,
          getAccessTokenFromPublicToken: this.getAccessTokenFromPublicToken
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
