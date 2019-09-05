import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  DatePickerIOS
} from "react-native";
import moment from "moment";

// import RNIap, {
//   Product,
//   ProductPurchase,
//   acknowledgePurchaseAndroid,
//   purchaseUpdatedListener,
//   purchaseErrorListener,
//   PurchaseError
// } from "react-native-iap";
import { NativeModules } from "react-native";
const { InAppUtils } = NativeModules;

import { withGlobalContext } from "../GlobalContext";

class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: "Settings"
  };

  itemSubs = ["monthly_subscription"];

  state = {
    isReady: false,
    notificationTime: this.props.global.notificationTime
  };

  setNotificationDate = newDate => {
    let momentDate = moment(newDate);

    const newNotificationTime = {
      hours: momentDate.hours(),
      minutes: momentDate.minutes()
    };

    this.setState({ notificationTime: newNotificationTime });
  };

  handleScheduleNotifications = async item => {
    await this.props.global.setNotificationTime(this.state.notificationTime);
    await this.props.global.scheduleNotifications();
  };

  handleLogout = async () => {
    await this.props.global.logout();
    this.props.navigation.navigate("AuthLoading");
  };

  componentDidMount = async () => {
    console.log("kut");
    try {
      // const result = await RNIap.initConnection();
      // console.log(result);
      // const products = await RNIap.getSubscriptions(this.itemSubs);
      // console.log(products);

      InAppUtils.loadProducts(
        [
          "monthly_subscription",
          "com.conscious_spending.monthly_subscription_2"
        ],
        (error, products) => {
          console.log(products);
          //update store here.
        }
      );
    } catch (err) {
      console.warn(err); // standardized err.code and err.message available
    }
  };

  render() {
    const { clearAllTransactions, loadDummyData, logout } = this.props.global;

    const notificationDate = moment(new Date())
      .hours(this.state.notificationTime.hours)
      .minutes(this.state.notificationTime.minutes)
      .toDate();

    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.settingsContainer}>
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
              onPress={() => this.props.navigation.navigate("PlaidModal")}
              style={{ paddingTop: 20 }}
            >
              <Text>Get Plaid Access Token</Text>
            </TouchableOpacity>
            <View style={styles.notificationContainer}>
              <DatePickerIOS
                date={notificationDate}
                onDateChange={this.setNotificationDate}
                mode={"time"}
              />
              <TouchableOpacity
                onPress={this.handleScheduleNotifications}
                style={{ paddingVertical: 20, alignSelf: "center" }}
              >
                <Text>Schedule Notifications</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={this.handleLogout}
              style={{ paddingTop: 20 }}
            >
              <Text>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default withGlobalContext(SettingsScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  contentContainer: {},
  settingsContainer: {
    alignItems: "center"
  },
  notificationContainer: {
    flexDirection: "column",
    width: "100%",
    borderWidth: 1,
    borderColor: "#f1f1f1",
    margin: 20
  }
});
