import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ScrollView,
  Text,
  Linking
} from "react-native";
import _ from "lodash";
import { Ionicons } from "@expo/vector-icons";

import SearchBar from "../components/SearchBar";
import TransactionsList from "../components/TransactionsList";
import PrimaryButton from "../components/PrimaryButton";
import Colors from "../constants/Colors";
import { withGlobalContext } from "../GlobalContext";

import ChartSpendingAcrossCategories from "../components/ChartSpendingAcrossCategories";
import ChartSpendingWithinCategory from "../components/ChartSpendingWithinCategory";

ChartTitle = ({ title }) => {
  return (
    <View style={{ marginLeft: 10, marginTop: 10 }}>
      <Text
        style={{
          color: Colors.darkGrey,
          fontSize: 17,
          marginBottom: 3,
          textTransform: "uppercase"
        }}
      >
        {title}
      </Text>
    </View>
  );
};

class SpendingScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Spending",
      headerLeft: navigation.getParam("SearchBarToggle"),
      headerRight: (
        <TouchableOpacity
          onPress={navigation.getParam("toggleListView")}
          style={{ paddingHorizontal: 20 }}
        >
          <Ionicons name={navigation.getParam("toggleViewIcon")} size={25} />
        </TouchableOpacity>
      )
    };
  };

  state = {
    showListView: false,
    showSearchBar: false,
    searchText: ""
  };

  componentDidMount() {
    // necessary for parameterizing the header bar button. See:
    // https://reactnavigation.org/docs/en/header-buttons.html#adding-a-button-to-the-header
    this.props.navigation.setParams({
      toggleListView: this.toggleListView,
      toggleViewIcon: "ios-list",
      SearchBarToggle: this.SearchBarToggleIcon
    });
  }

  SearchBarToggleIcon = () => {
    const { showListView } = this.state;

    // if not in list view, don't show search icon
    if (!showListView) return null;

    return (
      <TouchableOpacity
        onPress={this.handleToggleSearchBar}
        style={{ paddingHorizontal: 20 }}
      >
        <Ionicons name="ios-search" size={25} />
      </TouchableOpacity>
    );
  };

  handleToggleSearchBar = () => {
    const { showSearchBar } = this.state;
    this.setState({ showSearchBar: !showSearchBar, searchText: "" });
  };

  toggleListView = () => {
    const { showListView } = this.state;
    this.setState({ showListView: !showListView });

    this.props.navigation.setParams({
      toggleViewIcon: this.state.showListView ? "ios-list" : "ios-stats"
    });
  };

  handleTransactionPress = transaction => {
    this.props.navigation.navigate("EditModalTransactions", { transaction });
  };

  handleShareFeedback = async () => {
    // This doesn't work in the simulator, but should work on a real device
    Linking.openURL("mailto:hello@pennywise.io?subject=Chart%20suggestion");
  };

  handleSearchTextChange = text => {
    this.setState({ searchText: text });
  };

  render() {
    const transactions = this.props.global.listTransactions();
    const { categories } = this.props.global;
    const { showListView, showSearchBar, searchText } = this.state;

    // get all categorized transactions
    const categorizedTransactions = _(transactions)
      .filter(t => t.category !== "No Category")
      .value();

    // if no categorized expenses, show the empty screen
    if (
      Array.isArray(categorizedTransactions) &&
      !categorizedTransactions.length
    )
      return (
        <View>
          <Ionicons
            name={"ios-pricetags"}
            size={60}
            style={styles.emptyScreenIcon}
          />
          <Text style={styles.emptyScreenHeader}>
            Categorize some expenses!
          </Text>
          <Text style={styles.emptyScreenCTA}>
            Your categorized expenses will show up here
          </Text>
        </View>
      );

    // list view logic
    if (showListView) {
      return (
        <View style={styles.container}>
          {showSearchBar ? (
            <SearchBar
              placeholder="Search transactions, categories, and accounts"
              onChangeText={text => this.handleSearchTextChange(text)}
              style={{ marginHorizontal: 10 }}
            />
          ) : null}
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
          >
            <TransactionsList
              transactions={categorizedTransactions}
              categories={categories}
              onTransactionPress={this.handleTransactionPress}
              showSearchBar={showSearchBar}
              searchText={searchText}
            />
          </ScrollView>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.chartContainer}>
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            <ChartTitle title="Total spending over time" />
            <ChartSpendingWithinCategory
              transactions={categorizedTransactions}
            />

            <ChartTitle title="Spending by category" />
            <ChartSpendingAcrossCategories
              transactions={categorizedTransactions}
            />

            <View style={{ marginTop: 10 }}>
              <Text
                style={{
                  fontSize: 17,
                  textAlign: "center"
                }}
              >
                More insights coming soon!
              </Text>
              <View
                style={{
                  marginTop: 10,
                  marginBottom: 20,
                  marginHorizontal: 20
                }}
              >
                <PrimaryButton
                  buttonText="Suggest a Chart"
                  onPress={this.handleShareFeedback}
                ></PrimaryButton>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}

export default withGlobalContext(SpendingScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },
  chartContainer: {
    flex: 1
  },
  emptyScreenIcon: {
    textAlign: "center",
    marginTop: 30,
    color: Colors.copper
  },
  emptyScreenHeader: {
    fontSize: 22,
    marginTop: 15,
    textAlign: "center"
  },
  emptyScreenCTA: {
    marginTop: 30,
    color: Colors.darkGrey,
    width: "50%",
    textAlign: "center",
    alignSelf: "center",
    lineHeight: 20
  }
});
