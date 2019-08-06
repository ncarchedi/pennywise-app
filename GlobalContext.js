import React from "react";
import transactionsData from "./transactions.json";
import categoriesData from "./categories.json";

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

  componentDidMount() {
    this.setState({
      transactions: transactionsData,
      categories: categoriesData
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

  // switchToOffline = () => {
  //   this.setState({ isOnline: false });
  // }

  render() {
    return (
      <GlobalContext.Provider
        value={{
          ...this.state,
          // Every function to update the state should be listed here too:
          // switchToOnline: this.switchToOnline,
          // switchToOffline: this.switchToOffline
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
