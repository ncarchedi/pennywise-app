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
      <Text style={{ fontSize: 12 }}>{text}</Text>
    </View>
  );
};

SettingsSeparator = () => {
  return <View style={{ height: 10, backgroundColor: "#f1f1f1" }}></View>;
};

class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: "Settings"
  };

  state = {
    notificationTime: this.props.global.notificationTime,
    userEmail: ""
  };

  componentDidMount() {
    this.getUserEmail();
  }

  setNotificationDate = newDate => {
    let momentDate = moment(newDate);

    const newNotificationTime = {
      hours: momentDate.hours(),
      minutes: momentDate.minutes()
    };

    this.setState({ notificationTime: newNotificationTime });
  };

  handleScheduleNotifications = async () => {
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

  getUserEmail = async () => {
    const currentUser = await this.props.global.getCurrentUser();
    this.setState({ userEmail: currentUser.email });
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
              paddingHorizontal: 10,
              paddingVertical: 10
            }}
          >
            <Text style={{ color: "grey", fontSize: 12 }}>LOGGED IN AS</Text>
            <Text>{this.state.userEmail}</Text>
          </View>
          <SettingsSeparator />
          {/* User Settings */}
          <View>
            <PressableSetting
              text="Manage Accounts"
              onPress={() => this.props.navigation.navigate("LinkedAccounts")}
              style={{ borderTopWidth: 1 }}
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
            <SettingsHeader text="ADMINS ONLY" />
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
