import { Platform } from "react-native";
import { createStackNavigator } from "react-navigation";

import OnboardingSelectBankScreen from "../screens/onboarding/OnboardingSelectBankScreen";
import PlaidLinkScreen from "../screens/PlaidLinkScreen";

const config = Platform.select({
  web: { headerMode: "screen" },
  default: {}
});

const OnboardingStack = createStackNavigator(
  {
    OnboardingSelectBank: OnboardingSelectBankScreen,
    PlaidLink: PlaidLinkScreen
  },
  config
);

export default OnboardingStack;
