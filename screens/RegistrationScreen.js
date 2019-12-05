import React from "react";
import {
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Alert,
  Text,
  TouchableOpacity
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import TextInputWithIcon from "../components/TextInputWithIcon";
import WebLink from "../components/WebLink";
import Colors from "../constants/Colors";
import { withGlobalContext } from "../GlobalContext";
import PrimaryButton from "../components/PrimaryButton";

EmailExplainer = () => {
  handlePress = () => {
    Alert.alert(
      "Our Promise to You",
      "Your privacy and security are our top priorities. We promise to never share your email address with third parties and to only send you emails when absolutely necessary."
    );
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.primaryButton}>
      <View
        style={{
          marginTop: 20,
          flexDirection: "row",
          justifyContent: "center"
        }}
      >
        <Ionicons
          name={"ios-information-circle-outline"}
          size={17}
          style={{ color: Colors.darkGrey, marginRight: 5 }}
        />
        <Text style={{ color: Colors.darkGrey }}>
          How will my email address be used?
        </Text>
      </View>
    </TouchableOpacity>
  );
};

Disclaimer = () => {
  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 20,
        marginHorizontal: 40
      }}
    >
      <Text
        style={{
          color: Colors.darkGrey,
          textAlign: "center"
        }}
      >
        By registering, you agree to our{" "}
        <WebLink
          text="Privacy Policy"
          url="https://docs.google.com/document/d/1u8f6ZoaHdA3DYAsvcmCU4ekhGt2xYysvbTHE8YbTpVE/edit?usp=sharing"
        />{" "}
        and{" "}
        <WebLink
          text="Terms of Service"
          url="https://docs.google.com/document/d/1qrw9dko4qWBTzQTKIlBv5_xM71mZ70Ug3lZg-sqlCMA/edit?usp=sharing"
        />
        .
      </Text>
    </View>
  );
};

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
          <EmailExplainer />
        </View>
        <Disclaimer />
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
