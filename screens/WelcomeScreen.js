import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Button,
  Text,
  TouchableOpacity
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { withGlobalContext } from "../GlobalContext";

class WelcomeScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerStyle: {
        borderBottomWidth: 0
      },
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Text style={styles.navigationButtonText}>{"< Back"}</Text>
        </TouchableOpacity>
      )
    };
  };

  state = {
    emailText: "",
    passText: ""
  };

  render() {
    return (
      <SafeAreaView style={styles.container} behavior="padding" enabled>
        <View style={styles.topContainer}>
          <Ionicons style={styles.image} name={"ios-bowtie"} size={200} />
          <Text style={styles.title}>Welcome</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={this.handleSignIn}
            style={[styles.button, styles.secondaryButton]}
          >
            <Text style={styles.buttonText}>Sign in</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.handleRegister}
            style={[styles.button, styles.primaryButton]}
          >
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
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
    justifyContent: "space-around"
  },
  topContainer: {
    alignItems: "center"
  },
  buttonContainer: {},
  image: {
    color: "#50E3C2"
  },
  title: {
    fontSize: 50,
    color: "#50E3C2",
    backgroundColor: "transparent",
    textAlign: "center",
    marginHorizontal: 10
  },
  button: {
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#50E3C2",
    borderRadius: 6
  },
  primaryButton: {
    backgroundColor: "#50E3C2"
  },
  secondaryButton: {},
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#636363",
    textAlign: "center"
  },
  textStyle: {},
  textField: {
    margin: 10,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    padding: 10
  },
  navigationButtonText: {
    fontSize: 18,
    padding: 12,
    color: "#636363"
  }
});
