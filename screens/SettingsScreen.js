import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  DatePickerIOS,
  Linking
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";

import { withGlobalContext } from "../GlobalContext";

PressableSetting = ({ text, onPress, style = {} }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingVertical: 10,
        borderColor: "#f1f1f1",
        borderBottomWidth: 1,
        ...style
      }}
    >
      <Text style={{ paddingHorizontal: 10 }}>{text}</Text>
    </TouchableOpacity>
  );
};

SettingsHeader = ({ text }) => {
  return (
    <View
      style={{
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: "#f1f1f1"
      }}
    >
      <Text style={{ fontWeight: "bold" }}>{text}</Text>
    </View>
  );
};

class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: "Settings"
  };

  state = {
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

  handleScheduleNotifications = async () => {
    const notificationTime = this.state;

    await this.props.global.setNotificationTime(this.state.notificationTime);
    await this.props.global.scheduleNotifications();

    // TODO: tell user what time they are scheduled for!
    alert(`Notifications scheduled!`);
  };

  handleShareFeedback = async () => {
    // This doesn't work in the simulator, but should work on a real device
    Linking.openURL("mailto:borisgordts@hotmail.com?subject=Feedback");
  };

  handleLogout = async () => {
    await this.props.global.logout();
    this.props.navigation.navigate("AuthLoading");
  };

  render() {
    const {
      clearAllTransactions,
      loadDummyData,
      clearAsyncStorage
    } = this.props.global;

    const notificationDate = moment(new Date())
      .hours(this.state.notificationTime.hours)
      .minutes(this.state.notificationTime.minutes)
      .toDate();

    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        >
          <View
            style={{
              paddingVertical: 10,
              paddingHorizontal: 10,
              backgroundColor: "#f1f1f1",
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <Ionicons name="ios-person" size={30} />
            {/* TODO: how to get username of current user? */}
            <Text style={{ fontWeight: "bold", marginLeft: 10 }}>
              your_email@example.com
            </Text>
          </View>
          {/* User Settings */}
          <View>
            <PressableSetting
              text="Linked Bank Accounts"
              onPress={() => this.props.navigation.navigate("LinkedAccounts")}
            />
            <View>
              <PressableSetting
                text="Schedule Notifications"
                onPress={this.handleScheduleNotifications}
              />
              <DatePickerIOS
                date={notificationDate}
                onDateChange={this.setNotificationDate}
                mode={"time"}
              />
            </View>
            <PressableSetting
              text="Share Feedback"
              onPress={this.handleShareFeedback}
              style={{ borderTopWidth: 1 }}
            />
            <PressableSetting text="Logout" onPress={this.handleLogout} />
          </View>
          {/* Admin Settings */}
          {/* TODO: make this visible only in development mode? */}
          <View>
            <SettingsHeader text="Admins Only" />
            <PressableSetting
              text="Clear All Transactions"
              onPress={clearAllTransactions}
            />
            <PressableSetting
              text="Clear All Accounts"
              onPress={loadDummyData}
            />
            <PressableSetting
              text="Clear All Async Storage"
              onPress={clearAsyncStorage}
            />
            <PressableSetting
              text="Load Example Transactions"
              onPress={loadDummyData}
            />
            <PressableSetting
              text="Go To Onboarding"
              onPress={() =>
                this.props.navigation.navigate("OnboardingWelcome")
              }
            />
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
  }
});
