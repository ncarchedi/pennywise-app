import React from "react";
import { StyleSheet, View, KeyboardAvoidingView, Alert } from "react-native";

import { withGlobalContext } from "../GlobalContext";

import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";

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
            <PrimaryButton
              buttonText="Log In"
              onPress={this.signInAsync}
            ></PrimaryButton>
            <SecondaryButton
              buttonText="Forgot password?"
              onPress={this.handleForgotPassword}
            ></SecondaryButton>
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
      if (response.code && response.code === "auth/user-not-found") {
        Alert.alert(
          "Login error",
          "There is no user record corresponding to this email. The user may have been deleted, or the email contains a typo."
        );
      } else {
        Alert.alert("Login error", response.message);
      }
    } else {
      this.props.navigation.navigate("Main");
    }
  };

  handleForgotPassword = async () => {
    try {
      await this.props.global.sendPasswordresetEmail(this.state.emailText);

      Alert.alert(
        "Password reset successfully",
        "We've sent you an email with instructions to reset your pasword."
      );
    } catch (error) {
      console.log(JSON.stringify(error));

      let userMessage = "";

      if (this.state.emailText == "") {
        userMessage =
          "No email provided. Make sure to enter your email in the Email field.";
      } else if ("auth/user-not-found") {
        userMessage =
          "There is no user record corresponding to this email. The user may have been deleted, or the email contains a typo.";
      } else {
        userMessage = error.message;
      }

      Alert.alert("Password Reset Error", userMessage);
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
