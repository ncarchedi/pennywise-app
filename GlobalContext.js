import React from "react";
import { AsyncStorage } from "react-native";
import hash from "object-hash";
import _ from "lodash";
import moment from "moment";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import hoistNonReactStatic from "hoist-non-react-statics";

import transactionsData from "./data/transactions.json";
import categoriesData from "./data/categories.json";
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
    accessToken: "",
    notificationTime: {
      hours: 8,
      minutes: 0
    }
  };

  componentDidMount = async () => {
    try {
      const transactionsRaw = JSON.parse(
        await AsyncStorage.getItem("transactions")
      );

      const transactions = transactionsRaw.map(t => ({
        ...t,
        date: new Date(t.date)
      }));

      this.setState({ transactions });
    } catch (error) {
      console.log(error.message);
    }

    try {
      const accessToken = JSON.parse(await AsyncStorage.getItem("accessToken"));

      this.setState({ accessToken });
    } catch (error) {
      console.log(error.message);
    }

    try {
      let notificationTime = JSON.parse(
        await AsyncStorage.getItem("notificationTime")
      );

      if (!notificationTime) {
        notificationTime = this.state.notificationTime;
      }

      this.setState({ notificationTime });
    } catch (error) {
      console.log(error.message);
    }

    this.setState({ categories: categoriesData });
  };

  addTransaction = async (transaction = {}) => {
    // returns an array of length 1
    const result = await this.addTransactions([transaction]);
    // return the first element (an object of length 1)
    return result[0];
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
      await AsyncStorage.setItem("accessToken", JSON.stringify(accessToken));
    } catch (error) {
      console.log(error.message);
    }

    this.setState({
      accessToken: accessToken
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
    const accessToken = this.state.accessToken;
    let lastTransactionDate = this.getLastPlaidTransactionDate();

    let startDate;
    let endDate = moment().format("YYYY-MM-DD");

    if (lastTransactionDate) {
      startDate = moment(startDate).format("YYYY-MM-DD");
    } else {
      startDate = moment()
        .subtract(3, "days")
        .format("YYYY-MM-DD");
    }

    return fetch(TRANSACTIONS_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        access_token: accessToken,
        start_date: startDate,
        end_date: endDate
      })
    })
      .then(response => response.json())
      .then(responseJson => {
        plaidTransactions = responseJson.transactions.transactions;

        if (plaidTransactions) {
          let newTransactions = [];

          for (let plaidTransaction of plaidTransactions) {
            const { name, amount, date } = plaidTransaction;
            // Copy the part of the plaidTransaction that we want to use
            // for hashing in hashTransactionProperties
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
        const { name, amount, category, date, notes } = attrs;

        const updatedTransaction = {
          ...transaction,
          name,
          amount,
          category,
          date,
          notes
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
      hash_id: t.hash_id,
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

  getLastPlaidTransactionDate = () => {
    let lastTransaction = _(this.state.transactions)
      .filter(item => {
        return item.hash_id != null;
      })
      .sortBy("date")
      .last();

    if (lastTransaction) {
      return lastTransaction.date;
    } else {
      return null;
    }
  };

  setNotificationTime = async newNotificationTime => {
    try {
      await AsyncStorage.setItem(
        "notificationTime",
        JSON.stringify(newNotificationTime)
      );
    } catch (error) {
      console.log(error.message);
    }

    this.setState({ notificationTime: newNotificationTime });
  };

  /**
   * Schedules notifications for the next 7 days, based on the notificationTime of state.
   * Will ask permission to the user if that was not yet granted.
   */
  scheduleNotifications = async () => {
    // First cancel any already scheduled notifications
    this.cancelNotifications();

    // Ask permission to send notifications if needed
    // If permissions were not granted, the code below will just execute but not have any effect
    const notificationStatus = await Permissions.askAsync(
      Permissions.NOTIFICATIONS
    );
    console.log("notification permission status:");
    console.log(notificationStatus);

    // Calculate the time to send the next notification
    let notificationDate = moment(new Date())
      .hours(this.state.notificationTime.hours)
      .minutes(this.state.notificationTime.minutes);

    // Make sure this 'date' is after now
    if (moment(new Date()).diff(notificationDate) >= 0) {
      notificationDate.add(1, "days");
    }

    let notification = {
      title: "Ready to check your transactions?",
      body:
        "Categorize any new transactions now and stay on top of your expenses.",
      ios: {
        sound: true,
        _displayInForeground: true
      }
    };

    // Schedule the next 7 notifications
    // If the time specified above has passed already, only 6 notifications will be scheduled
    for (let i = 0; i < 7; i += 1) {
      const nextNotificationDate = notificationDate.add(i, "days");

      const response = await Notifications.scheduleLocalNotificationAsync(
        notification,
        {
          time: nextNotificationDate.toDate()
        }
      );

      console.log(response);
    }
  };

  cancelNotifications = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
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
          setAccessToken: this.setAccessToken,
          setNotificationTime: this.setNotificationTime,
          scheduleNotifications: this.scheduleNotifications,
          cancelNotifications: this.cancelNotifications
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
