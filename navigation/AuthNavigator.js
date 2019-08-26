import { Platform } from "react-native";
import { createStackNavigator } from "react-navigation";

import LoginScreen from "../screens/LoginScreen";
import RegistrationScreen from "../screens/RegistrationScreen";
import WelcomeScreen from "../screens/WelcomeScreen";

const config = Platform.select({
  web: { headerMode: "screen" },
  default: {}
});

const AuthStack = createStackNavigator(
  {
    Welcome: WelcomeScreen,
    Register: RegistrationScreen,
    Login: LoginScreen
  },
  config
);

export default AuthStack;
