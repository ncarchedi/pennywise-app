import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from "react-native";

import { withGlobalContext } from "../../GlobalContext";

class OnboardingSelectBankScreen extends React.Component {
  static navigationOptions = {
    headerStyle: {
      borderBottomWidth: 0
    }
  };

  handleSelectBank = () => {
    const navigation = this.props.navigation;

    navigation.navigate("PlaidLink", {
      onComplete: () => {
        navigation.navigate("Main");
      }
    });
  };

  handleSkip = () => {
    this.props.navigation.navigate("Main");
  };

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.text}>
            To start, connect your bank to access your transactions.
          </Text>
          <TouchableOpacity
            style={styles.bankButton}
            onPress={this.handleSelectBank}
          >
            <Text style={styles.bankButtonText}>Connect my bank</Text>
          </TouchableOpacity>
        </View>
        <View styles={styles.footerContainer}>
          <TouchableOpacity onPress={this.handleSkip}>
            <Text style={styles.continueText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}

export default withGlobalContext(OnboardingSelectBankScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "stretch",
    backgroundColor: "#fff"
  },
  contentContainer: {
    justifyContent: "center",
    //alignItems: "center",
    flexGrow: 1,
    flexDirection: "column"
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
  bankButton: {
    marginTop: 60,
    padding: 10,
    width: 200,
    borderWidth: 1,
    borderRadius: 4,
    alignSelf: "center"
  },
  bankButtonText: {
    textAlign: "center",
    fontWeight: "bold"
  },
  loginFormContainer: {
    margin: 20
  }
});
