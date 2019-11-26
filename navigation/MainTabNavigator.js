import React from "react";
import { Text } from "react-native";
import {
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";

import TabBarIcon from "../components/TabBarIcon";
import TabBarLabel from "../components/TabBarLabel";

import TodoScreen from "../screens/TodoScreen";
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
  tabBarLabel: ({ focused }) => <TabBarLabel focused={focused} label="To Do" />,
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={"ios-checkbox-outline"} />
  )
};

const SpendingStack = createStackNavigator(
  {
    Spending: SpendingScreen,
    EditModalTransactions: EditTransactionModal,
    CategoryModalTransactions: SelectCategoryModal
  },
  config
);

SpendingStack.navigationOptions = {
  tabBarLabel: ({ focused }) => (
    <TabBarLabel focused={focused} label="Spending" />
  ),
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
  tabBarLabel: ({ focused }) => (
    <TabBarLabel focused={focused} label="Settings" />
  ),
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
