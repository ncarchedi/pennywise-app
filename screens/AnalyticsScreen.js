import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  DatePickerIOS
} from "react-native";

import PlaidLinkModal from "../components/PlaidLinkModal";
import { withGlobalContext } from "../GlobalContext";

import moment from "moment";

class AnalyticsScreen extends React.Component {
  static navigationOptions = {
    title: "Analytics"
  };

  state = {
    isReady: false,
    isPlaidLinkVisible: false,
    notificationTime: this.props.global.notification_time
  };

  togglePlaidLinkModal = () => {
    this.setState({ isPlaidLinkVisible: !this.state.isPlaidLinkVisible });
  };

  handlePlaidSyncPress = item => {
    this.togglePlaidLinkModal();
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
    await this.props.global.setNotificaitonTime(this.state.notificationTime);
    await this.props.global.scheduleNotifications();
  };

  render() {
    const { clearAllTransactions, loadDummyData } = this.props.global;

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
                <Text>Schedule notifications</Text>
              </TouchableOpacity>
            </View>
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
  },
  notificationContainer: {
    flexDirection: "column",
    width: "100%",
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "gray",
    margin: 20
  }
});
