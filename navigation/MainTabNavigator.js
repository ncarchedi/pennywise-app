import React from "react";
import { Platform } from "react-native";
import {
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";

import TabBarIcon from "../components/TabBarIcon";

import TodoScreen from "../screens/TodoScreen";
import TransactionsScreen from "../screens/TransactionsScreen";
import SpendingScreen from "../screens/SpendingScreen";
import AnalyticsScreen from "../screens/AnalyticsScreen";
import SettingsScreen from "../screens/SettingsScreen";

const config = Platform.select({
  web: { headerMode: "screen" },
  default: {}
});

const TodoStack = createStackNavigator(
  {
    Todo: TodoScreen
  },
  config
);

TodoStack.navigationOptions = {
  tabBarLabel: "To Do",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === "ios" ? "ios-checkbox-outline" : "md-checkbox-outline"
      }
    />
  )
};

const TransactionsStack = createStackNavigator(
  {
    Transactions: TransactionsScreen
  },
  config
);

TransactionsStack.navigationOptions = {
  tabBarLabel: "Transactions",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-list" : "md-list"}
    />
  )
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
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-wallet" : "md-wallet"}
    />
  )
};

const AnalyticsStack = createStackNavigator(
  {
    Analytics: AnalyticsScreen
  },
  config
);

AnalyticsStack.navigationOptions = {
  tabBarLabel: "Analytics",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-trending-up" : "md-trending-up"}
    />
  )
};

const tabNavigator = createBottomTabNavigator({
  TodoStack,
  TransactionsStack,
  SpendingStack,
  AnalyticsStack
});

export default tabNavigator;
