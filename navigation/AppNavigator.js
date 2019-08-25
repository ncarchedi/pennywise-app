import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";

import MainTabNavigator from "./MainTabNavigator";
import AuthNavigator from "./AuthNavigator";
import AuthLoadingScreen from "../screens/AuthLoadingScreen";
import PlaidLinkScreen from "../screens/PlaidLinkScreen";
import OnboardingNavigator from "./OnboardingNavigator";

export default createAppContainer(
  createSwitchNavigator(
    {
      // You could add another route here for authentication.
      // Read more at https://reactnavigation.org/docs/en/auth-flow.html
      AuthLoading: AuthLoadingScreen,
      Onboarding: OnboardingNavigator,
      Main: MainTabNavigator,
      Auth: AuthNavigator
    },
    {
      initialRouteName: "AuthLoading"
    }
  )
);
