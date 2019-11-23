import React from "react";
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

import {
  saveItem,
  loadItem,
  removeItem,
  clearStorage
} from "./utils/StorageUtils";

import { dbRemoveInstitutionAccount } from "./utils/DataBaseCommunication";

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/functions";
import "firebase/firestore";

import * as Amplitude from "expo-analytics-amplitude";

import * as Sentry from "sentry-expo";

export const GlobalContext = React.createContext({});

import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_DATABASE_URL,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID,
  AMPLITUDE_API_KEY,
  ENVIRONMENT
} from "react-native-dotenv";

export class GlobalContextProvider extends React.Component {
  cleanState = {
    transactions: [],
    categories: [],
    notificationTime: {
      hours: 8,
      minutes: 0
    },
    institutionAccounts: []
  };

  state = this.cleanState;

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

    Amplitude.initialize(AMPLITUDE_API_KEY);
  }

  loadStateFromStorage = async () => {
    if (await this.isUserLoggedIn()) {
      const uid = (await this.getCurrentUser()).uid;

      Amplitude.setUserId(uid);

      try {
        const transactions = await loadItem(uid, "transactions");

        this.setTransactions(transactions, false);
      } catch (error) {
        console.log(error.message);
        Sentry.captureException(error);
      }

      try {
        const savedCategories = await loadItem(uid, "categories");

        // if savedCategories is null, then use default categories
        const categories = savedCategories
          ? savedCategories
          : defaultCategories;
        this.setState({ categories });
      } catch (error) {
        console.log(error.message);
        Sentry.captureException(error);
      }

      try {
        let notificationTime = await loadItem(uid, "notificationTime");

        if (!notificationTime) {
          notificationTime = this.state.notificationTime;
        }

        this.setState({ notificationTime });
      } catch (error) {
        console.log(error.message);
        Sentry.captureException(error);
      }

      try {
        let institutionAccounts = await loadItem(uid, "institutionAccounts");

        if (!institutionAccounts) {
          institutionAccounts = [];
        }

        this.setState({ institutionAccounts });
      } catch (error) {
        console.log(error.message);
        Sentry.captureException(error);
      }
    }
  };

  initState = async () => {
    this.setState(this.cleanState);
  };

  // This should be the only method that writes state.transactions and saves transactions
  // to the local storage.
  // It does all necessary validations and steps to make sure state.transactions
  // is always in a valid state.
  setTransactions = async (transactions, saveToStorage = true) => {
    // Make sure transactions are never undefined or null
    if (!transactions) {
      transactions = [];
    }

    if (saveToStorage) {
      await saveItem(
        (await this.getCurrentUser()).uid,
        "transactions",
        transactions
      );
    }

    this.setState({
      transactions: transactions
    });
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
    let updatedTransactionsList = _.uniqBy(
      _.concat(transactions, newTransactions),
      "id"
    );

    this.setTransactions(updatedTransactionsList);

    return newTransactions;
  };

  getAccessTokenFromPublicToken = async publicToken => {
    const getAccessTokenFromPublicToken = firebase
      .functions()
      .httpsCallable("getAccessTokenFromPublicToken_v6");

    let result = await getAccessTokenFromPublicToken({
      env: ENVIRONMENT,
      public_token: publicToken
    });

    if (result.data.error) {
      console.log(result);
      throw result.data.error.error_message;
    } else {
      await this.addInstitutionAccount(
        result.data.item_id,
        result.data.institution_name,
        result.data.account_details
      );
    }
  };

  // A note on dates:
  // - Plaid uses the 'local' date as used by the bank and visible by the user on the bank website
  // - By default, MomentJS uses the local timezone (e.g. the timezone of the user's device)
  getPlaidTransactions = async () => {
    let lastTransactionDate = this.getLastPlaidTransactionDate();

    let startDate;
    let endDate = moment().format("YYYY-MM-DD");

    if (lastTransactionDate) {
      // We subtract 2 days from the most recent transaction's date. This way, we're 100% sure that
      // we won't miss any transactions.
      // Why not 1 day? Because the maximum time difference between two locations is 27 hours
      // (https://stackoverflow.com/questions/8131023/what-is-the-maximum-possible-time-zone-difference)
      startDate = moment(lastTransactionDate)
        .subtract(2, "days")
        .format("YYYY-MM-DD");
    } else {
      startDate = moment()
        .subtract(5, "days")
        .format("YYYY-MM-DD");
    }

    let plaidItemsToLoad = _(this.state.institutionAccounts)
      .map(nextInstitutionAccount => nextInstitutionAccount.itemId)
      .value();

    try {
      const getPlaidTransactions = firebase
        .functions()
        .httpsCallable("getPlaidTransactions_v6");

      let result = await getPlaidTransactions({
        env: ENVIRONMENT,
        start_date: startDate,
        end_date: endDate,
        plaidItemsToUse: plaidItemsToLoad
      });

      if (result.data.error) {
        console.log(result.data.error);
        return {
          error: true,
          message: result.data.error
        };
      } else {
        let itemTransactions = result.data.transactions;

        const institutions = this.state.institutionAccounts;

        const itemIdToNameMap = _.reduce(
          institutions,
          (acc, item) => {
            return { ...acc, [item.itemId]: item.institutionName };
          },
          {}
        );

        const accounts = _.flatten(institutions.map(item => item.accounts));
        const accountIdToNameMap = _.reduce(
          accounts,
          (acc, item) => {
            return { ...acc, [item.accountId]: item.name };
          },
          {}
        );

        let newTransactions = [];

        for (const nextItemTransaction of itemTransactions) {
          const itemId = nextItemTransaction.item.item_id;
          const plaidTransactions = nextItemTransaction.transactions;

          // console.log("item id");
          // console.log(itemId);

          if (plaidTransactions) {
            for (let plaidTransaction of plaidTransactions) {
              const {
                name,
                amount,
                date,
                pending,
                account_id
              } = plaidTransaction;

              // Don't include pending transactions or income
              if (pending || amount < 0) {
                continue;
              } else {
                let transaction = {
                  id: calculateHashForPlaidTransaction(plaidTransaction),
                  source: "plaid",
                  name,
                  amount,
                  date,
                  account: accountIdToNameMap[account_id],
                  institution: itemIdToNameMap[itemId]
                };

                newTransactions = [...newTransactions, transaction];
              }
            }
          }
        }

        // If the plaid output contains multiple transactions that are identical,
        // update their hashes to be different
        newTransactions = handleDuplicateHashTransactionsFromPlaid(
          newTransactions
        );

        this.addTransactions(newTransactions);

        return {
          error: false,
          transactions: newTransactions
        };
      }
    } catch (error) {
      console.log(error);
      Sentry.captureException(error);
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

    this.setTransactions(updatedTransactions);
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

    this.setTransactions(updatedTransactions);
  };

  clearAllTransactions = async () => {
    console.log("clearing all transactions...");

    try {
      removeItem((await this.getCurrentUser()).uid, "transactions");
    } catch (error) {
      console.log(error.message);
      Sentry.captureException(error);
    }

    this.setTransactions(null, false);
  };

  loadDummyData = async () => {
    console.log("loading dummy data...");

    const dummyData = defaultTransactions.map(t => ({
      id: t.id,
      source: t.source,
      name: t.name,
      amount: t.amount,
      category: t.category,
      date: t.date
    }));

    this.setTransactions(dummyData);
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

    await saveItem(
      (await this.getCurrentUser()).uid,
      "categories",
      updatedCategoriesList
    );

    this.setState({
      categories: updatedCategoriesList
    });

    return newCategory;
  };

  setNotificationTime = async newNotificationTime => {
    await saveItem(
      (await this.getCurrentUser()).uid,
      "notificationTime",
      newNotificationTime
    );

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
    let notificationDate = moment()
      .hours(this.state.notificationTime.hours)
      .minutes(this.state.notificationTime.minutes);

    // Make sure this 'date' is after now
    if (moment().diff(notificationDate) >= 0) {
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

      await this.loadStateFromStorage();

      // Amplitude.setUserId(userId);

      return {
        success: true,
        message: ""
      };
    } catch (error) {
      console.log(error.message);
      Sentry.captureException(error);

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

      await this.loadStateFromStorage();

      return {
        success: true,
        message: ""
      };
    } catch (error) {
      console.log(error.message);
      Sentry.captureException(error);

      return {
        success: false,
        message: error.message
      };
    }
  };

  logout = async () => {
    try {
      await firebase.auth().signOut();

      Amplitude.setUserId(null);

      // Clear the state
      this.initState();
    } catch (error) {
      console.error(error);
      Sentry.captureException(error);
    }
  };

  isUserLoggedIn = async () => {
    try {
      let current_user = await this.getCurrentUser();

      return current_user ? true : false;
    } catch (error) {
      console.log(error.message);
      Sentry.captureException(error);
      return false;
    }
  };

  // Get the current user, and wait for it if it was
  // not initialized yet by firebase.
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

  addInstitutionAccount = async (itemId, institutionName, accounts) => {
    try {
      let institutionAccounts = this.state.institutionAccounts;

      institutionAccounts.push({
        itemId,
        institutionName,
        accounts
      });

      await saveItem(
        (await this.getCurrentUser()).uid,
        "institutionAccounts",
        institutionAccounts
      );

      this.setState({ institutionAccounts });
    } catch (error) {
      console.log(error.message);
      Sentry.captureException(error);
    }
  };

  removeInstitutionAccount = async itemId => {
    try {
      // First remove in the database
      await dbRemoveInstitutionAccount(
        firebase,
        (await this.getCurrentUser()).uid,
        itemId
      );

      // Update the local state
      const updatedInstitutionAccounts = _.filter(
        this.state.institutionAccounts,
        item => {
          return item.itemId !== itemId;
        }
      );

      await saveItem(
        (await this.getCurrentUser()).uid,
        "institutionAccounts",
        updatedInstitutionAccounts
      );

      this.setState({ institutionAccounts: updatedInstitutionAccounts });

      return {
        error: false,
        errorMessage: ""
      };
    } catch (error) {
      console.log(error);
      Sentry.captureException(error);

      return {
        error: true,
        message: error
      };
    }
  };

  clearAsyncStorage = async () => {
    await clearStorage();
  };

  getEnvironment = () => {
    return ENVIRONMENT;
  };

  getUserEmail = async () => {
    const currentUser = await this.getCurrentUser();
    return currentUser.email;
  };

  render() {
    return (
      <GlobalContext.Provider
        value={{
          ...this.state,
          // Every function to update the state should be listed here:
          loadStateFromStorage: this.loadStateFromStorage,
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
          isUserLoggedIn: this.isUserLoggedIn,
          getCurrentUser: this.getCurrentUser,
          removeInstitutionAccount: this.removeInstitutionAccount,
          clearAsyncStorage: this.clearAsyncStorage,
          getEnvironment: this.getEnvironment,
          getUserEmail: this.getUserEmail
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
