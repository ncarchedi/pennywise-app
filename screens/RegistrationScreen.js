import React from "react";
import {
  ScrollView,
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

class RegistrationScreen extends React.Component {
  static navigationOptions = {
    title: "Create an account"
  };

  state = {
    emailText: "",
    passText: ""
  };

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <View style={styles.loginFormContainer}>
          <Text>Email</Text>
          <TextInput
            style={styles.textField}
            onChangeText={text => this.setState({ emailText: text })}
            value={this.state.emailText}
            placeholder="Email"
            autoCompleteType="email"
            autoCapitalize="none"
          />
          <Text>Password</Text>
          <TextInput
            style={styles.textField}
            onChangeText={text => this.setState({ passText: text })}
            value={this.state.passText}
            placeholder="Password"
            secureTextEntry
            autoCompleteType="password"
          />
          <Button title="Create account" onPress={this.handleRegistration} />
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
      this.props.navigation.navigate("Main");
    }
  };
}

export default withGlobalContext(RegistrationScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff"
  },
  textField: {
    marginVertical: 10,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    padding: 10
  },
  button: {
    margin: 20
  },
  loginFormContainer: {
    margin: 20
  }
});
