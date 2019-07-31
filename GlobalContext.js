import React from 'react';

const GlobalContext = React.createContext({});

export class GlobalContextProvider extends React.Component {
  state = {
    transactions: [
      {
        "date": "2019-07-25",
        "name": "Amazon.com",
        "amount": "-84.33",
        "category": "Household Goods"
      },
      {
        "date": "2019-07-24",
        "name": "Union Square Cafe",
        "amount": "-104.00",
        "category": "Bars & Restaurants"
      },
      {
        "date": "2019-07-24",
        "name": "ACME, Inc.",
        "amount": "2000.00",
        "category": "Income"
      },
    ],
    categories: [
      {
        name: 'Food',
        icon: 'md-pizza',
        thisMonth: 237.98,
        lastMonth: 576.88,
      },
      {
        name: 'Transportation',
        icon: 'md-car',
        thisMonth: 237.98,
        lastMonth: 576.88,
      },
      {
        name: 'Groceries',
        icon: 'md-cart',
        thisMonth: 237.98,
        lastMonth: 576.88,
      },
      {
        name: 'Salary',
        icon: 'md-cash',
        thisMonth: 2250.90,
        lastMonth: 4500.10,
      },
    ]
  }

  // switchToOnline = () => {
  //   this.setState({ isOnline: true });
  // }

  // switchToOffline = () => {
  //   this.setState({ isOnline: false });
  // }

  render () {
    return (
      <GlobalContext.Provider
        value={{
          ...this.state,
          // switchToOnline: this.switchToOnline,
          // switchToOffline: this.switchToOffline
        }}
      >
        {this.props.children}
      </GlobalContext.Provider>
    )
  }
}

// create the consumer as higher order component
export const withGlobalContext = ChildComponent => props => (
  <GlobalContext.Consumer>
    {
      context => <ChildComponent {...props} global={context}  />
    }
  </GlobalContext.Consumer>
);