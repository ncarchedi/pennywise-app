import React from "react";
import { AsyncStorage } from "react-native";
import transactionsData from "./transactions.json";
import categoriesData from "./categories.json";
import { createNewTransaction } from "./utils/TransactionUtils";

const GlobalContext = React.createContext({});

const BACKEND_DEV = 'http://localhost:5001/conscious-spending-backend/us-central1/'
const BACKEND_PROD = 'https://us-central1-conscious-spending-backend.cloudfunctions.net/'

const BACKEND_URL = BACKEND_PROD

const ACCESS_TOKEN_URL = BACKEND_URL + 'getAccessTokenFromPublicToken'
const TRANSACTIONS_URL = BACKEND_URL + 'getPlaidTransactions'

export class GlobalContextProvider extends React.Component {
  state = {
    transactions: [],
    categories: [],
    access_token: ''
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
    this.addTransactions([transaction]);
  }

  addTransactions = async (newTransactionsData) => { 
    const { transactions } = this.state;

    let updatedTransactions = transactions;

    for (let nextNewTransaction of newTransactionsData) {
      // Todo: only add new transactions
      // let exisintTransaction = transactions.find((element) => {
      //   if(element.plaid_id) {
      //     console.log('hey how');
      //     console.log(element.plaid_id);
      //     console.log(nextNewTransaction.plaid_id);

      //     return element.plaid_id === nextNewTransaction.plaid_id;
      //   } else {
      //     return false;
      //   }
      // });

      // if(!exisintTransaction) {
      //   let newTransaction = createNewTransaction(nextNewTransaction); 
      //   updatedTransactions.push(newTransaction)
      // }

      let newTransaction = createNewTransaction(nextNewTransaction); 
      updatedTransactions.push(newTransaction)
    }

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

  setAccessToken = async (accessToken) => { 
    try {
      await AsyncStorage.setItem(
        "access_token",
        JSON.stringify(accessToken)
      );
    } catch (error) {
      console.log(error.message);
    }

    this.setState({
      access_token: accessToken
    });
  }

  getAccessTokenFromPublicToken = (publicToken) => {
    console.log('public token');
    console.log(publicToken);
    
    return fetch(ACCESS_TOKEN_URL, {
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
      console.log('access token response'); 
      console.log(responseJson);

      this.setAccessToken(responseJson.access_token);

      return responseJson;
    })
    .catch((error) => {
      console.error(error);
    });
  }

  getPlaidTransactions = () => {   
    const accessToken = this.state.access_token;

    return fetch(TRANSACTIONS_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_token: accessToken,
      }),
    }).then((response) => response.json())
    .then((responseJson) => {
      // Here we get all transactions  
      //console.log(responseJson);

      plaidTransactions = responseJson.transactions.transactions;

      if(plaidTransactions) {
        let newTransactions = []

        for (let plaidTransaction of plaidTransactions) { 
          const {name, amount, date} = plaidTransaction;

          // Todo: We can not use plaid's transaction_id as unique identifier, as it depends
          // on the access token.
          // I've tried plaidTransaction.payment_meta.reference_number, but 
          // that is usually null (at least in the test data)
          let transaction = {
            plaid_id: plaidTransaction.transaction_id,
            name,
            amount,
            date
          }

          newTransactions = [...newTransactions, transaction]
        }

        this.addTransactions(newTransactions);
      }

      return responseJson;
    })
    .catch((error) => {
      console.error(error);
    });
  }

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

// create the consumer as higher order component
export const withGlobalContext = ChildComponent => props => (
  <GlobalContext.Consumer>
    {context => <ChildComponent {...props} global={context} />}
  </GlobalContext.Consumer>
);
