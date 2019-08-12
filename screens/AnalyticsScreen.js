import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from "react-native";

import PlaidLinkModal from "../components/PlaidLinkModal";

import { withGlobalContext } from "../GlobalContext";

import PlaidAuthenticator from "react-native-plaid-link";

class AnalyticsScreen extends React.Component {
  static navigationOptions = {
    title: "Analytics"
  };

  state = {
    isReady: false,
    isPlaidLinkVisible: false
  };

  togglePlaidLinkModal = () => {
    this.setState({ isPlaidLinkVisible: !this.state.isPlaidLinkVisible });
  };

  handlePlaidSyncPress = item => {
    this.togglePlaidLinkModal();
  };

  render() {
    const { clearAllTransactions, loadDummyData } = this.props.global;

    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <PlaidLinkModal
            isVisible={this.state.isPlaidLinkVisible}
            onExitModal={this.togglePlaidLinkModal}
          />
          <View style={styles.analyticsContainer}>
            <Text style={styles.analyticsText}>
              This will show some spending analytics.
            </Text>
            <TouchableOpacity
              onPress={clearAllTransactions}
              style={{ paddingTop: 20 }}
            >
              <Text>Clear All Transactions</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={loadDummyData}
              style={{ paddingTop: 20 }}
            >
              <Text>Load Example Transactions</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.handlePlaidSyncPress}
              style={{ paddingTop: 20 }}
            >
              <Text>Get plaid access token</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default withGlobalContext(AnalyticsScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  contentContainer: {
    paddingTop: 30,
    paddingHorizontal: 20
  },
  analyticsContainer: {
    alignItems: "center"
  },
  analyticsText: {
    fontSize: 17,
    color: "rgba(96, 100, 109, 1)",
    lineHeight: 24
  }
});
