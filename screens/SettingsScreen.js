import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking
} from "react-native";
import moment from "moment";
import DateTimePicker from "react-native-modal-datetime-picker";
import { Appearance } from "react-native-appearance";

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
        marginTop: 30,
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
  return <View style={{ height: 15, backgroundColor: "#f1f1f1" }}></View>;
};

class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: "Settings"
  };

  state = {
    notificationTime: this.props.global.notificationTime,
    userEmail: "",
    isTimePickerVisible: false
  };

  componentDidMount() {
    this.setUserEmail();
  }

  toggleTimePicker = () => {
    const { isTimePickerVisible } = this.state;
    this.setState({ isTimePickerVisible: !isTimePickerVisible });
  };

  setNotificationTime = newTime => {
    let momentTime = moment(newTime);

    const newNotificationTime = {
      hours: momentTime.hours(),
      minutes: momentTime.minutes()
    };

    this.setState({ notificationTime: newNotificationTime });
  };

  handleScheduleNotifications = async () => {
    await this.props.global.setNotificationTime(this.state.notificationTime);
    await this.props.global.scheduleNotifications();

    this.toggleTimePicker();
  };

  handleShareFeedback = async () => {
    // This doesn't work in the simulator, but should work on a real device
    Linking.openURL("mailto:hello@pennywise.io?subject=Feedback");
  };

  handleLogout = async () => {
    await this.props.global.logout();
    this.props.navigation.navigate("AuthLoading");
  };

  setUserEmail = async () => {
    const userEmail = await this.props.global.getUserEmail();
    this.setState({ userEmail: userEmail });
  };

  userIsAdmin = () => {
    const userEmail = this.state.userEmail;
    const admins = ["nick.carchedi@gmail.com", "borisgordts@hotmail.com"];
    return admins.includes(userEmail);
  };

  render() {
    const {
      clearAllTransactions,
      loadDummyData,
      clearAsyncStorage
    } = this.props.global;

    const notificationTime = moment()
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
            <Text style={{ color: "grey", fontSize: 12, marginBottom: 3 }}>
              LOGGED IN AS
            </Text>
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
                text="Manage Notifications"
                onPress={this.toggleTimePicker}
              />
              <DateTimePicker
                date={notificationTime}
                isVisible={this.state.isTimePickerVisible}
                onConfirm={this.handleScheduleNotifications}
                onDateChange={this.setNotificationTime}
                onCancel={this.toggleTimePicker}
                mode="time"
                hideTitleContainerIOS={true}
                datePickerContainerStyleIOS={{
                  backgroundColor:
                    Appearance.getColorScheme() === "dark" ? "black" : "white"
                }}
              />
            </View>
            <SettingsSeparator />
            <PressableSetting
              text="Share Feedback"
              onPress={this.handleShareFeedback}
            />
            <PressableSetting text="Logout" onPress={this.handleLogout} />
          </View>
          {/* Admin Settings */}
          {this.userIsAdmin() ? (
            <View>
              <SettingsHeader text="ADMIN ONLY" />
              <PressableSetting
                text="Load Example Transactions"
                onPress={loadDummyData}
              />
              <SettingsSeparator />
              <PressableSetting
                text="Clear All Transactions"
                onPress={clearAllTransactions}
              />
              <PressableSetting
                text="Clear All Async Storage"
                onPress={clearAsyncStorage}
              />
              <SettingsSeparator />
              <PressableSetting
                text="Go To Onboarding"
                onPress={() => this.props.navigation.navigate("Intro")}
              />
            </View>
          ) : null}
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
