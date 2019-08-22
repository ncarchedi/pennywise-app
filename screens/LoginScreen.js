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

import { withGlobalContext } from "../GlobalContext";

class LoginScreen extends React.Component {
  static navigationOptions = {
    title: "Please sign in"
  };

  render() {
    return (
      <View>
        <Button title="Sign in!" onPress={this.signInAsync} />
      </View>
    );
  }

  signInAsync = async () => {
    await this.props.global.loginUser("email", "pass");
    this.props.navigation.navigate("Main");
  };
}

export default withGlobalContext(LoginScreen);
