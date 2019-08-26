import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  DatePickerIOS,
  Button,
  ActivityIndicator
} from "react-native";

import { withGlobalContext } from "../GlobalContext";

class AuthLoadingScreen extends React.Component {
  constructor() {
    super();
  }

  // Fetch the token from storage then navigate to our appropriate place
  componentDidMount = async () => {
    const isLoggedIn = await this.props.global.isUserLoggedIn();

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    if (isLoggedIn) {
      this.props.navigation.navigate("Main");
    } else {
      this.props.navigation.navigate("Auth");
    }
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="grey" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});

export default withGlobalContext(AuthLoadingScreen);
