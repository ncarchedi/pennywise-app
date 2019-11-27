import React from "react";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Alert,
  Text
} from "react-native";
import TextInputWithIcon from "../components/TextInputWithIcon";

import Colors from "../constants/Colors";
import { withGlobalContext } from "../GlobalContext";

import PrimaryButton from "../components/PrimaryButton";

class RegistrationScreen extends React.Component {
  static navigationOptions = {
    title: "Create Account"
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
            autoCorrect={false}
            autoCompleteType="email"
            autoCapitalize="none"
          />
          <TextInputWithIcon
            icon="ios-lock"
            value={passText}
            placeholder="Password"
            onChangeText={text => this.setState({ passText: text })}
            autoCorrect={false}
            autoCompleteType="password"
            autoCapitalize="none"
            secureTextEntry
          />
          <View style={styles.buttonContainer}>
            <PrimaryButton
              buttonText="Create Account"
              onPress={this.handleRegistration}
            />
          </View>
          <View style={{ marginTop: 10 }}>
            <Text style={{ color: Colors.darkGrey, textAlign: "center" }}>
              By registering, you agree to our Privacy Policy and Terms of
              Service.
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }

  handleRegistration = async () => {
    let response = await this.props.global.registerUser(
      this.state.emailText,
      this.state.passText
    );

    if (!response.success) {
      Alert.alert("Registration error", response.message);
    } else {
      this.props.navigation.navigate("Onboarding");
    }
  };
}

export default withGlobalContext(RegistrationScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: Colors.white
  },
  buttonContainer: {
    marginTop: 20
  },
  loginFormContainer: {
    margin: 20
  }
});
