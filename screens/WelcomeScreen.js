import React from "react";
import {
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  DatePickerIOS,
  Button,
  TextInput,
  KeyboardAvoidingView,
  Alert
} from "react-native";

import { withGlobalContext } from "../GlobalContext";

class WelcomeScreen extends React.Component {
  static navigationOptions = {
    title: "Welcome"
  };

  state = {
    emailText: "",
    passText: ""
  };

  render() {
    return (
      <SafeAreaView style={styles.container} behavior="padding" enabled>
        <View style={styles.startButtonContainer}>
          <Button title="Sign in" onPress={this.handleSignIn} />
          <Button title="Register" onPress={this.handleRegister} />
        </View>
      </SafeAreaView>
    );
  }

  handleRegister = () => {
    this.props.navigation.navigate("Register");
  };

  handleSignIn = () => {
    this.props.navigation.navigate("Login");
  };
}

export default withGlobalContext(WelcomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column-reverse",
    backgroundColor: "#fff"
  },
  textField: {
    margin: 10,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    padding: 10
  },
  button: {
    margin: 20
  },
  startButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignContent: "stretch"
  }
});
