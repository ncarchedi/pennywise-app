import React from "react";
import { AsyncStorage } from "react-native";
import _ from "lodash";
import moment from "moment";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import hoistNonReactStatic from "hoist-non-react-statics";

import defaultTransactions from "./data/transactions.json";
import defaultCategories from "./data/categories.json";
import {
  createNewTransaction,
  calculateHashForPlaidTransaction,
  handleDuplicateHashTransactionsFromPlaid
} from "./utils/TransactionUtils";

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/functions";

const GlobalContext = React.createContext({});

import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_DATABASE_URL,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID
} from "react-native-dotenv";

export class GlobalContextProvider extends React.Component {
  state = {
    transactions: [],
    categories: [],
    notificationTime: {
      hours: 8,
      minutes: 0
    }
  };

  constructor() {
    super();

    var firebaseConfig = {
      apiKey: FIREBASE_API_KEY,
      authDomain: FIREBASE_AUTH_DOMAIN,
      databaseURL: FIREBASE_DATABASE_URL,
      projectId: FIREBASE_PROJECT_ID,
      storageBucket: FIREBASE_STORAGE_BUCKET,
      messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
      appId: FIREBASE_APP_ID
    };

    firebase.initializeApp(firebaseConfig);
    firebase.functions();
  }

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
      const savedCategories = JSON.parse(
        await AsyncStorage.getItem("categories")
      );

      // if savedCategories is null, then use default categories
      const categories = savedCategories ? savedCategories : defaultCategories;
      this.setState({ categories });
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
      "id"
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

  getAccessTokenFromPublicToken = async publicToken => {
    try {
      const getAccessTokenFromPublicToken_v2 = firebase
        .functions()
        .httpsCallable("getAccessTokenFromPublicToken_v2");

      let result = await getAccessTokenFromPublicToken_v2({
        public_token: publicToken
      });
    } catch (error) {
      console.log(error);
    }
  };

  getPlaidTransactions = async () => {
    let lastTransactionDate = this.getLastPlaidTransactionDate();

    let startDate;
    let endDate = moment().format("YYYY-MM-DD");

    if (lastTransactionDate) {
      startDate = moment.utc(lastTransactionDate).format("YYYY-MM-DD");
    } else {
      startDate = moment()
        .subtract(5, "days")
        .format("YYYY-MM-DD");
    }

    try {
      const getPlaidTransactions_v2 = firebase
        .functions()
        .httpsCallable("getPlaidTransactions_v2");

      let result = await getPlaidTransactions_v2({
        start_date: startDate,
        end_date: endDate
      });

      if (result.data.error) {
        return {
          error: true,
          message: result.data.error
        };
      } else {
        plaidTransactions = result.data.transactions.transactions;

        let newTransactions = [];

        if (plaidTransactions) {
          for (let plaidTransaction of plaidTransactions) {
            const { name, amount, date, pending } = plaidTransaction;

            // Don't include pending transactions or income
            if (pending || amount < 0) {
              continue;
            } else {
              let transaction = {
                id: calculateHashForPlaidTransaction(plaidTransaction),
                source: "plaid",
                name,
                amount,
                date
              };

              newTransactions = [...newTransactions, transaction];
            }
          }

          // If the plaid output contains multiple transactions that are identical,
          // update their hashes to be different
          newTransactions = handleDuplicateHashTransactionsFromPlaid(
            newTransactions
          );

          this.addTransactions(newTransactions);
        }

        return {
          error: false,
          transactions: newTransactions
        };
      }
    } catch (error) {
      console.error(error);
      return {
        error: true,
        message: error
      };
    }
  };

  listTransactions = () => {
    return this.state.transactions.filter(
      transaction => !transaction.isRemoved
    );
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

    const updatedTransactions = transactions.map(transaction => {
      if (transaction.id === id) {
        return {
          ...transaction,
          isRemoved: true
        };
      } else {
        return transaction;
      }
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

    const dummyData = defaultTransactions.map(t => ({
      id: t.id,
      source: t.source,
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
        return item.source === "plaid";
      })
      .sortBy("date")
      .last();

    if (lastTransaction) {
      return lastTransaction.date;
    } else {
      return null;
    }
  };

  addCategory = async newCategory => {
    const { categories } = this.state;

    const updatedCategoriesList = [...categories, newCategory];

    try {
      await AsyncStorage.setItem(
        "categories",
        JSON.stringify(updatedCategoriesList)
      );
    } catch (error) {
      console.log(error.message);
    }

    this.setState({
      categories: updatedCategoriesList
    });

    return newCategory;
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

    // console.log("notification permission status:");
    // console.log(notificationStatus);

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

      // console.log(response);
    }
  };

  cancelNotifications = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
  };

  registerUser = async (user, password) => {
    try {
      const userCredential = await firebase
        .auth()
        .createUserWithEmailAndPassword(user, password);

      return {
        success: true,
        message: ""
      };
    } catch (error) {
      console.log(error.message);

      return {
        success: false,
        message: error.message
      };
    }
  };

  loginUser = async (user, password) => {
    try {
      const userCredential = await firebase
        .auth()
        .signInWithEmailAndPassword(user, password);

      return {
        success: true,
        message: ""
      };
    } catch (error) {
      console.log(error.message);

      return {
        success: false,
        message: error.message
      };
    }
  };

  logout = async () => {
    try {
      await firebase.auth().signOut();
    } catch (error) {
      console.error(error);
    }
  };

  isUserLoggedIn = async () => {
    try {
      let current_user = await this.getCurrentUser();
      return current_user ? true : false;
    } catch (error) {
      console.log(error.message);
      return false;
    }
  };

  // Get the current user, and wait for it if it was
  // not initilaized yet by firebase.
  // https://github.com/firebase/firebase-js-sdk/issues/462
  getCurrentUser = async () => {
    const user = new Promise((resolve, reject) => {
      const unsubscribe = firebase.auth().onAuthStateChanged(user => {
        unsubscribe();
        resolve(user);
      }, reject);
    });

    return user;
  };

  render() {
    return (
      <GlobalContext.Provider
        value={{
          ...this.state,
          // Every function to update the state should be listed here:
          listTransactions: this.listTransactions,
          addTransaction: this.addTransaction,
          updateTransaction: this.updateTransaction,
          deleteTransaction: this.deleteTransaction,
          clearAllTransactions: this.clearAllTransactions,
          loadDummyData: this.loadDummyData,
          getAccessTokenFromPublicToken: this.getAccessTokenFromPublicToken,
          getPlaidTransactions: this.getPlaidTransactions,
          addCategory: this.addCategory,
          setNotificationTime: this.setNotificationTime,
          scheduleNotifications: this.scheduleNotifications,
          cancelNotifications: this.cancelNotifications,
          registerUser: this.registerUser,
          loginUser: this.loginUser,
          logout: this.logout,
          isUserLoggedIn: this.isUserLoggedIn
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
