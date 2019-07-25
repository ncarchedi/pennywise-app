import React from "react";
import { Platform } from "react-native";
import {
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";

import TabBarIcon from "../components/TabBarIcon";
import TransactionsScreen from "../screens/TransactionsScreen";
import SpendingScreen from "../screens/SpendingScreen";
import AnalyticsScreen from "../screens/AnalyticsScreen";
import SettingsScreen from "../screens/SettingsScreen";

const config = Platform.select({
  web: { headerMode: "screen" },
  default: {}
});

// Transactions screen

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

TransactionsStack.path = "";

// Spending screen

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

SpendingStack.path = "";

// Analytics screen

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

AnalyticsStack.path = "";

// Settings screen

const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen
  },
  config
);

SettingsStack.navigationOptions = {
  tabBarLabel: "Settings",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-options" : "md-options"}
    />
  )
};

SettingsStack.path = "";

const tabNavigator = createBottomTabNavigator({
  TransactionsStack,
  SpendingStack,
  AnalyticsStack,
  SettingsStack
});

tabNavigator.path = "";

export default tabNavigator;
