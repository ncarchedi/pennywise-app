import React from "react";
import { AsyncStorage } from "react-native";
import hash from "object-hash";
import _ from "lodash";
import hoistNonReactStatic from "hoist-non-react-statics";

import transactionsData from "./transactions.json";
import categoriesData from "./categories.json";
import { createNewTransaction } from "./utils/TransactionUtils";

const GlobalContext = React.createContext({});

const BACKEND_DEV =
  "http://localhost:5001/conscious-spending-backend/us-central1/";
const BACKEND_PROD =
  "https://us-central1-conscious-spending-backend.cloudfunctions.net/";

const BACKEND_URL = BACKEND_PROD;

const ACCESS_TOKEN_URL = BACKEND_URL + "getAccessTokenFromPublicToken";
const TRANSACTIONS_URL = BACKEND_URL + "getPlaidTransactions";

export class GlobalContextProvider extends React.Component {
  state = {
    transactions: [],
    categories: [],
    access_token: ""
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

    try {
      const access_token = JSON.parse(
        await AsyncStorage.getItem("access_token")
      );

      this.setState({ access_token });
    } catch (error) {
      console.log(error.message);
    }

    this.setState({ categories: categoriesData });
  };

  addTransaction = async (transaction = {}) => {
    return (await this.addTransactions([transaction]))[0];
  };

  addTransactions = async newTransactionsData => {
    const { transactions } = this.state;

    let newTransactions = newTransactionsData.map(item =>
      createNewTransaction(item)
    );

    // Only add transactions we don't have already
    // Reason for not using 'unionBy' is that you can't control with that method from which
    // array to pick in case of duplicates.
    let updatedTransactionsList = _.uniqBy(
      _.concat(transactions, newTransactions),
      "hash_id"
    );

    try {
      await AsyncStorage.setItem(
        "transactions",
        JSON.stringify(updatedTransactionsList)
      );
    } catch (error) {
      console.log(error.message);
    }

    this.setState({
      transactions: updatedTransactionsList
    });

    return newTransactions;
  };

  setAccessToken = async accessToken => {
    try {
      await AsyncStorage.setItem("access_token", JSON.stringify(accessToken));
    } catch (error) {
      console.log(error.message);
    }

    this.setState({
      access_token: accessToken
    });
  };

  getAccessTokenFromPublicToken = publicToken => {
    console.log("public token");
    console.log(publicToken);

    return fetch(ACCESS_TOKEN_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        public_token: publicToken
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        console.log("access token response");
        console.log(responseJson);

        this.setAccessToken(responseJson.access_token);

        return responseJson;
      })
      .catch(error => {
        console.error(error);
      });
  };

  getPlaidTransactions = () => {
    const accessToken = this.state.access_token;

    return fetch(TRANSACTIONS_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        access_token: accessToken,
        nb_days: 3
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        plaidTransactions = responseJson.transactions.transactions;

        if (plaidTransactions) {
          let newTransactions = [];

          for (let plaidTransaction of plaidTransactions) {
            const { name, amount, date } = plaidTransaction;
            // Copy the part of the plaidTransaction that we want to use for hasing in hashTransactionProperties
            const {
              account_id,
              category_id,
              pending_transaction_id,
              transaction_id,
              ...hashTransactionProperties
            } = plaidTransaction;

            let transaction = {
              hash_id: hash(hashTransactionProperties),
              name,
              amount,
              date
            };

            newTransactions = [...newTransactions, transaction];
          }

          // Todo: deal with the situation where we have two identical transactions, e.g. when you buy
          // the same taco twice.
          if (
            _.uniqBy(newTransactions, "hash_id").length !==
            newTransactions.length
          ) {
            console.log(
              "Identical transactions detected. Todo: deal with this situation."
            );
          }

          this.addTransactions(newTransactions);
        }

        return responseJson;
      })
      .catch(error => {
        console.error(error);
      });
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

  deleteTransaction = async id => {
    const { transactions } = this.state;

    const updatedTransactions = transactions.filter(t => t.id !== id);

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
          deleteTransaction: this.deleteTransaction,
          clearAllTransactions: this.clearAllTransactions,
          loadDummyData: this.loadDummyData,
          getAccessTokenFromPublicToken: this.getAccessTokenFromPublicToken,
          getPlaidTransactions: this.getPlaidTransactions,
          setAccessToken: this.setAccessToken
        }}
      >
        {this.props.children}
      </GlobalContext.Provider>
    );
  }
}

export const withGlobalContext = ChildComponent => {
  ComponentWithContext = props => (
    <GlobalContext.Consumer>
      {context => <ChildComponent {...props} global={context} />}
    </GlobalContext.Consumer>
  );
  // necessary for retaining static properties (e.g. header titles)
  hoistNonReactStatic(ComponentWithContext, ChildComponent);
  return ComponentWithContext;
};
