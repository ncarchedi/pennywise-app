import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
} from "react-native";
import moment from "moment";
import DateTimePicker from "react-native-modal-datetime-picker";
import { Appearance } from "react-native-appearance";
import { Ionicons } from "@expo/vector-icons";
import * as WebBrowser from "expo-web-browser";

import Colors from "../constants/Colors";
import { withGlobalContext } from "../GlobalContext";

PressableSetting = ({ text, icon, onPress, style = {} }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        paddingVertical: 10,
        borderColor: Colors.veryLightGrey,
        borderBottomWidth: 1,
        ...style,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View
          style={{ alignItems: "center", minWidth: 30, marginHorizontal: 5 }}
        >
          <Ionicons name={icon} size={20} />
        </View>
        <Text>{text}</Text>
      </View>
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
        backgroundColor: Colors.veryLightGrey,
      }}
    >
      <Text style={{ fontSize: 12, textTransform: "uppercase" }}>{text}</Text>
    </View>
  );
};

SettingsSeparator = () => {
  return (
    <View style={{ height: 15, backgroundColor: Colors.veryLightGrey }}></View>
  );
};

class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: "Settings",
  };

  state = {
    notificationTime: this.props.global.notificationTime,
    userEmail: "",
    isTimePickerVisible: false,
  };

  componentDidMount() {
    this.setUserEmail();
  }

  toggleTimePicker = () => {
    const { isTimePickerVisible } = this.state;
    this.setState({ isTimePickerVisible: !isTimePickerVisible });
  };

  setNotificationTime = (newTime) => {
    let momentTime = moment(newTime);

    const newNotificationTime = {
      hours: momentTime.hours(),
      minutes: momentTime.minutes(),
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
    Linking.openURL("mailto:hello@dayonelabs.io?subject=Feedback");
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
      clearAsyncStorage,
      getEnvironment,
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
              paddingVertical: 10,
            }}
          >
            <Text
              style={{
                color: Colors.darkGrey,
                fontSize: 12,
                marginBottom: 3,
                textTransform: "uppercase",
              }}
            >
              Logged in as
            </Text>
            <Text>{this.state.userEmail}</Text>
          </View>
          <SettingsSeparator />
          {/* User Settings */}
          <View>
            <PressableSetting
              text="Manage Accounts"
              icon="ios-business"
              onPress={() => this.props.navigation.navigate("LinkedAccounts")}
              style={{ borderTopWidth: 1 }}
            />
            <View>
              <PressableSetting
                text="Manage Notifications"
                icon="ios-notifications"
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
                    Appearance.getColorScheme() === "dark" ? "black" : "white",
                }}
              />
            </View>
            <SettingsSeparator />
            <Text
              style={{
                fontSize: 12,
                color: "darkgrey",
                marginHorizontal: 10,
                marginTop: 5,
              }}
            >
              If you have any suggestions for how we can improve the app, please
              let us know! We read every piece of feedback.
            </Text>
            <PressableSetting
              text="Share Feedback"
              icon="ios-megaphone"
              onPress={this.handleShareFeedback}
            />
            <SettingsSeparator />
            <PressableSetting
              text="Privacy Policy"
              icon="ios-lock"
              onPress={() =>
                WebBrowser.openBrowserAsync(
                  "https://docs.google.com/document/d/1u8f6ZoaHdA3DYAsvcmCU4ekhGt2xYysvbTHE8YbTpVE/edit?usp=sharing"
                )
              }
            />
            <PressableSetting
              text="Terms of Service"
              icon="ios-paper"
              onPress={() =>
                WebBrowser.openBrowserAsync(
                  "https://docs.google.com/document/d/1qrw9dko4qWBTzQTKIlBv5_xM71mZ70Ug3lZg-sqlCMA/edit?usp=sharing"
                )
              }
            />
            <SettingsSeparator />
            <PressableSetting
              text="Log Out"
              icon="ios-log-out"
              onPress={this.handleLogout}
            />
          </View>
          {/* Admin Settings */}
          {this.userIsAdmin() ? (
            <View>
              <SettingsHeader text={`Admin Only (${getEnvironment()})`} />
              <PressableSetting
                text="Go To Onboarding"
                icon="ios-paper-plane"
                onPress={() => this.props.navigation.navigate("Intro")}
              />
              <SettingsSeparator />
              <PressableSetting
                text="Load Example Transactions"
                icon="ios-wallet"
                onPress={loadDummyData}
              />
              <SettingsSeparator />
              <PressableSetting
                text="Clear All Transactions"
                icon="ios-trash"
                onPress={clearAllTransactions}
              />
              <PressableSetting
                text="Clear All Async Storage"
                icon="ios-trash"
                onPress={clearAsyncStorage}
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
    backgroundColor: Colors.white,
  },
});
