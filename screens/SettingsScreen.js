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

class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: "Settings"
  };

  state = {
    isReady: false,
    isPlaidLinkVisible: false,
    notificationTime: this.props.global.notificationTime
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
    await this.props.global.setNotificationTime(this.state.notificationTime);
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
