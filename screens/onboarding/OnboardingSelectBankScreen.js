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
            To start, connect a bank account to import your recent expenses.
          </Text>
          <TouchableOpacity
            style={styles.bankButton}
            onPress={this.handleSelectBank}
          >
            <Text style={styles.bankButtonText}>Connect My Bank</Text>
          </TouchableOpacity>
        </View>
        <View styles={styles.footerContainer}>
          <TouchableOpacity onPress={this.handleSkip}>
            <Text style={styles.continueText}>I'll Do It Later</Text>
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
    justifyContent: "space-around"
  },
  contentContainer: {
    justifyContent: "center",
    flexGrow: 1,
    margin: 10
  },
  footerContainer: {},
  text: {
    fontSize: 22,
    textAlign: "center"
  },
  continueText: {
    fontSize: 17,
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
    alignSelf: "center",
    marginTop: 60,
    alignItems: "center",
    marginVertical: 6,
    marginHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: "#50E3C2",
    width: 250
  },
  bankButtonText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 17
  },
  loginFormContainer: {
    margin: 20
  }
});
