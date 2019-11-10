import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View, Text } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";

import { withGlobalContext } from "../GlobalContext";

const slides = [
  {
    key: "slide1",
    title: "Welcome to Pennywise",
    text: "Expense tracking made simple",
    icon: "ios-bowtie",
    color: "#50E3C2"
  },
  {
    key: "slide2",
    title: "Connect Your Bank Accounts",
    text: "Automatically import your daily expenses",
    icon: "ios-business",
    color: "#636363"
  },
  {
    key: "slide3",
    title: "Categorize Your Expenses",
    text: "Manually categorize every expense to promote more mindful spending",
    icon: "ios-options",
    color: "#636363"
  },
  {
    key: "slide4",
    title: "Analyze Your Spending",
    text: "Data-driven insights help you (re)gain control of your finances",
    icon: "ios-stats",
    color: "#636363"
  },
  {
    key: "slide5",
    title: "Secure and Private",
    text:
      "Your data is stored securely on your device and never shared with third parties",
    icon: "ios-lock",
    color: "#636363"
  }
];

class IntroScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

  renderItem = ({ item, dimensions }) => (
    <View style={styles.mainContent}>
      <Ionicons
        style={[styles.image, { color: item.color }]}
        name={item.icon}
        size={200}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.text}>{item.text}</Text>
      </View>
    </View>
  );

  renderNavigationButton = buttonLabel => {
    return () => <Text style={styles.navigationButtonText}>{buttonLabel}</Text>;
  };

  renderDoneButton = buttonLabel => {
    return () => <Text style={styles.doneButtonText}>{buttonLabel}</Text>;
  };

  render() {
    return (
      <AppIntroSlider
        slides={slides}
        renderItem={this.renderItem}
        // bottomButton
        showPrevButton
        // showSkipButton
        // hideNextButton
        // hideDoneButton
        // onSkip={() => console.log("skipped")}
        renderNextButton={this.renderNavigationButton("Next")}
        renderPrevButton={this.renderNavigationButton("Back")}
        renderDoneButton={this.renderDoneButton("Done")}
        dotStyle={styles.dotStyle}
        activeDotStyle={styles.activeDotStyle}
        onDone={() => this.props.navigation.navigate("Welcome")}
      />
    );
  }
}

export default withGlobalContext(IntroScreen);

const styles = StyleSheet.create({
  mainContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around"
  },
  textContainer: {
    marginBottom: 40
  },
  image: {
    color: "#636363",
    marginTop: "25%"
  },
  title: {
    fontSize: 28,
    color: "#50E3C2",
    backgroundColor: "transparent",
    textAlign: "center",
    marginBottom: 16,
    marginHorizontal: 10
  },
  text: {
    fontSize: 17,
    color: "#636363",
    backgroundColor: "transparent",
    textAlign: "center",
    paddingHorizontal: 16
  },
  navigationButtonText: {
    fontSize: 17,
    padding: 12,
    color: "#636363"
  },
  doneButtonText: {
    fontSize: 17,
    padding: 12,
    color: "#636363",
    fontWeight: "bold"
  },
  dotStyle: {
    backgroundColor: "#E8E6E6"
  },
  activeDotStyle: {
    backgroundColor: "#636363"
  }
});
