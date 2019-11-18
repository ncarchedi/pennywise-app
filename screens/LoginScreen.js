import React from "react";
import {
  StyleSheet,
  View,
  Button,
  KeyboardAvoidingView,
  Alert
} from "react-native";

import { withGlobalContext } from "../GlobalContext";

class LoginScreen extends React.Component {
  static navigationOptions = {
    title: "Log In"
  };

  state = {
    emailText: "",
    passText: ""
  };

  render() {
    const { emailText, passText } = this.state;

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <View style={styles.loginFormContainer}>
          <TextInputWithIcon
            icon="ios-mail"
            value={emailText}
            placeholder="Email"
            onChangeText={text => this.setState({ emailText: text })}
            clearButtonMode="while-editing"
            autoCorrect={false}
            autoCompleteType="email"
            autoCapitalize="none"
          />
          <TextInputWithIcon
            icon="ios-lock"
            value={passText}
            placeholder="Password"
            onChangeText={text => this.setState({ passText: text })}
            clearButtonMode="while-editing"
            autoCorrect={false}
            autoCompleteType="password"
            autoCapitalize="none"
            secureTextEntry
          />
          <View style={styles.buttonContainer}>
            <Button title="Log In" onPress={this.signInAsync} />
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }

  signInAsync = async () => {
    let response = await this.props.global.loginUser(
      this.state.emailText,
      this.state.passText
    );

    if (!response.success) {
      Alert.alert("Login error", response.message);
    } else {
      this.props.navigation.navigate("Main");
    }
  };
}

export default withGlobalContext(LoginScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff"
  },
  buttonContainer: {
    marginTop: 20
  },
  loginFormContainer: {
    margin: 20
  }
});
