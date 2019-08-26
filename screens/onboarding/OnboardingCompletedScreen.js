import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback
} from "react-native";

import { withGlobalContext } from "../../GlobalContext";

class OnboardingCompletedScreen extends React.Component {
  static navigationOptions = {
    headerStyle: {
      borderBottomWidth: 0
    }
  };

  handleNext = () => {
    this.props.navigation.navigate("Main");
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableWithoutFeedback onPress={this.handleNext}>
          <View style={styles.touchableContainer}>
            <View style={styles.contentContainer}>
              <Text style={styles.text}>All set, let's start.</Text>
            </View>
            <View styles={styles.footerContainer}>
              <Text style={styles.continueText}>
                Press anywhere to continue
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    );
  }
}

export default withGlobalContext(OnboardingCompletedScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "stretch",
    backgroundColor: "#fff"
  },
  touchableContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "stretch"
  },
  contentContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1
  },
  footerContainer: {},
  text: {
    fontSize: 25,
    textAlign: "center"
  },
  continueText: {
    fontSize: 15,
    textAlign: "center",
    color: "gray"
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
  loginFormContainer: {
    margin: 20
  }
});
