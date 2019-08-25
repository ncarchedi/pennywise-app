import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  DatePickerIOS,
  Button
} from "react-native";

import * as LocalAuthentication from "expo-local-authentication";

import { withGlobalContext } from "../GlobalContext";

class AuthLoadingScreen extends React.Component {
  constructor() {
    super();
  }

  // Fetch the token from storage then navigate to our appropriate place
  componentDidMount = async () => {
    const isLoggedIn = await this.props.global.isUserLoggedIn();

    if (isLoggedIn) {
      const hasTouchID = await LocalAuthentication.hasHardwareAsync();

      if (hasTouchID) {
        const touchIDResult = await LocalAuthentication.authenticateAsync();

        console.log(touchIDResult);
      }
    }

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(isLoggedIn ? "Main" : "Auth");
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <Text>Loading</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});

export default withGlobalContext(AuthLoadingScreen);
