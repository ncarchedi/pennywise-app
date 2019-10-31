import React from "react";
import {
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";

import TabBarIcon from "../components/TabBarIcon";

import TodoScreen from "../screens/TodoScreen";
import SpendingScreen from "../screens/SpendingScreen";
import SettingsScreen from "../screens/SettingsScreen";
import EditTransactionModal from "../screens/EditTransactionModal";
import PlaidLinkScreen from "../screens/PlaidLinkScreen";
import SelectCategoryModal from "../screens/SelectCategoryModal";
import AddCategoryModal from "../screens/AddCategoryModal";
import LinkedAccountsScreen from "../screens/LinkedAccountsScreen";

const config = {
  web: { headerMode: "screen" },
  default: {}
};

const TodoStack = createStackNavigator(
  {
    Todo: TodoScreen,
    EditModalTodo: EditTransactionModal,
    CategoryModalTodo: SelectCategoryModal,
    AddCategoryModalTodo: AddCategoryModal
  },
  { ...config, mode: "modal" }
);

TodoStack.navigationOptions = {
  tabBarLabel: "To Do",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={"ios-checkbox-outline"} />
  )
};

const SpendingStack = createStackNavigator(
  {
    Spending: SpendingScreen,
    EditModalTransactions: EditTransactionModal,
    CategoryModalTransactions: SelectCategoryModal
    // AddCategoryModalTransactions: AddCategoryModal
  },
  config
);

SpendingStack.navigationOptions = {
  tabBarLabel: "Spending",
  tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="ios-cash" />
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
    <TabBarIcon focused={focused} name="ios-options" />
  )
};

const tabNavigator = createBottomTabNavigator({
  TodoStack,
  SpendingStack,
  SettingsStack
});

export default tabNavigator;
