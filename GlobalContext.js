import React from "react";
import transactionsData from "./transactions.json";
import categoriesData from "./categories.json";
import { createNewTransaction } from "./utils/TransactionUtils";

const GlobalContext = React.createContext({});

export class GlobalContextProvider extends React.Component {
  state = {
    transactions: [],
    categories: []
  };

  componentDidMount() {
    this.setState({
      transactions: transactionsData,
      categories: categoriesData
    });
  }

  addTransaction = (transaction = {}) => {
    const { transactions } = this.state;
    const newTransaction = createNewTransaction(transaction);

    this.setState({
      transactions: [...transactions, newTransaction]
    });

    return newTransaction;
  };

  updateTransaction = attrs => {
    const { transactions } = this.state;

    this.setState({
      transactions: transactions.map(transaction => {
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
      })
    });
  };

  render() {
    return (
      <GlobalContext.Provider
        value={{
          ...this.state,
          // Every function to update the state should be listed here:
          addTransaction: this.addTransaction,
          updateTransaction: this.updateTransaction
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
