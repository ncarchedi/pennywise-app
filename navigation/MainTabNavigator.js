import React from "react";
import {
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";

import TabBarIcon from "../components/TabBarIcon";

import TodoScreen from "../screens/TodoScreen";
import TransactionsScreen from "../screens/TransactionsScreen";
import SpendingScreen from "../screens/SpendingScreen";
import SettingsScreen from "../screens/SettingsScreen";
import EditTransactionModal from "../screens/EditTransactionModal";
import PlaidLinkScreen from "../screens/PlaidLinkScreen";
import SelectCategoryModal from "../screens/SelectCategoryModal";
import LinkedAccountsScreen from "../screens/LinkedAccountsScreen";

const config = {
  web: { headerMode: "screen" },
  default: {}
};

const TodoStack = createStackNavigator(
  {
    Todo: TodoScreen,
    EditModalTodo: EditTransactionModal,
    CategoryModalTodo: SelectCategoryModal
  },
  { ...config, mode: "modal" }
);

TodoStack.navigationOptions = {
  tabBarLabel: "To Do",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={"ios-checkbox-outline"} />
  )
};

const TransactionsStack = createStackNavigator(
  {
    Transactions: TransactionsScreen,
    EditModalTransactions: EditTransactionModal,
    CategoryModalTransactions: SelectCategoryModal
  },
  { ...config, mode: "modal" }
);

TransactionsStack.navigationOptions = {
  tabBarLabel: "Transactions",
  tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="ios-list" />
};

const SpendingStack = createStackNavigator(
  {
    Spending: SpendingScreen
  },
  config
);

SpendingStack.navigationOptions = {
  tabBarLabel: "Spending",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name="ios-wallet" />
  )
};

const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
    PlaidModal: PlaidLinkScreen,
    LinkedAccounts: LinkedAccountsScreen
  },
  { ...config, mode: "modal" }
);

SettingsStack.navigationOptions = {
  tabBarLabel: "Settings",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name="ios-settings" />
  )
};

const tabNavigator = createBottomTabNavigator({
  TodoStack,
  TransactionsStack,
  SpendingStack,
  SettingsStack
});

export default tabNavigator;
