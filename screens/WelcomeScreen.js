import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
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
      }
    };
  };

  render() {
    return (
      <SafeAreaView style={styles.container} behavior="padding" enabled>
        <View style={styles.topContainer}>
          <Ionicons style={styles.image} name={"ios-bowtie"} size={200} />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={this.handleRegister}
            style={{ ...styles.button, backgroundColor: "#50E3C2" }}
          >
            <Text
              style={{
                ...styles.buttonText,
                color: "white",
                fontWeight: "bold"
              }}
            >
              Sign Up Now
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.handleSignIn}
            style={[styles.button, styles.secondaryButton]}
          >
            <Text style={styles.buttonText}>Log In</Text>
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
  button: {
    alignItems: "center",
    marginVertical: 6,
    marginHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6
  },
  buttonText: {
    fontSize: 17,
    textAlign: "center"
  }
});
