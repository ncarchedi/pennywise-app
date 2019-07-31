import React from "react";
import transactionsData from "./transactions.json";
import categoriesData from "./categories.json";

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

  // We should make methods to update the state like this:
  // switchToOnline = () => {
  //   this.setState({ isOnline: true });
  // }

  // switchToOffline = () => {
  //   this.setState({ isOnline: false });
  // }

  render() {
    return (
      <GlobalContext.Provider
        value={{
          ...this.state
          // Every function to update the state should be listed here too:
          // switchToOnline: this.switchToOnline,
          // switchToOffline: this.switchToOffline
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
