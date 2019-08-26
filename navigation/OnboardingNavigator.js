import React from "react";
import { Platform } from "react-native";
import {
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";

import OnboardingWelcomeScreen from "../screens/onboarding/OnboardingWelcomeScreen";
import OnboardingSelectBankScreen from "../screens/onboarding/OnboardingSelectBankScreen";
import OnboardingCompletedScreen from "../screens/onboarding/OnboardingCompletedScreen";
import PlaidLinkScreen from "../screens/PlaidLinkScreen";

const config = Platform.select({
  web: { headerMode: "screen" },
  default: {}
});

const OnboardingStack = createStackNavigator({
  OnboardingWelcome: OnboardingWelcomeScreen,
  OnboardingSelectBank: OnboardingSelectBankScreen,
  PlaidLink: PlaidLinkScreen,
  OnboardingCompleted: OnboardingCompletedScreen
});

export default OnboardingStack;
