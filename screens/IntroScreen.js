import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View, Text, Image } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";

import { withGlobalContext } from "../GlobalContext";

import placeholderImage from "../assets/images/2.jpeg";

const slides = [
  {
    key: "slide1",
    title: "Welcome to Pennywise",
    text: "Expense tracking for personal finance nerds",
    icon: "ios-bowtie",
    color: "#50E3C2"
  },
  {
    key: "slide2",
    title: "Connect your bank accounts",
    text:
      "Connect your bank accounts to automatically import your transactions",
    icon: "ios-business",
    color: "#636363"
  },
  {
    key: "slide3",
    title: "Manually categorize tranactions",
    text:
      "Manually categorizing transcastions gives you full control and forces you to be conscious of your spending",
    icon: "ios-options",
    color: "#636363"
  },
  {
    key: "slide4",
    title: "Analyze your spending",
    text:
      "Use analytics to understand your spending and improve your financial habits",
    icon: "ios-stats",
    color: "#636363"
  },
  {
    key: "slide5",
    title: "Secure & Private",
    text:
      "Your data never leaves your device, and we'll never share it with anyone",
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
      <View>
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
        //showSkipButton
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
  image: {
    color: "#636363",
    marginTop: 100
  },
  title: {
    fontSize: 30,
    color: "#50E3C2",
    backgroundColor: "transparent",
    textAlign: "center",
    marginBottom: 16,
    marginHorizontal: 10
  },
  text: {
    fontSize: 20,
    color: "#636363",
    backgroundColor: "transparent",
    textAlign: "center",
    paddingHorizontal: 16
  },
  navigationButtonText: {
    fontSize: 18,
    padding: 12,
    color: "#636363"
  },
  doneButtonText: {
    fontSize: 18,
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
