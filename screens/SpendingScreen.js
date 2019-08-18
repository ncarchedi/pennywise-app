import React from "react";
import { ScrollView, StyleSheet, Text, View, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import _ from "lodash";

import { withGlobalContext } from "../GlobalContext";

class SpendingScreen extends React.Component {
  static navigationOptions = {
    title: "Spending"
  };

  ListItemSeparator = () => {
    return (
      <View style={{ height: 1, width: "100%", backgroundColor: "#f1f1f1" }} />
    );
  };

  listItem = (item, index) => {
    const { amountThisMonth, amountLastMonth, category, icon } = item;

    return (
      <View style={styles.categoryContainer}>
        <View style={styles.categoryNameContainer}>
          <View
            style={{
              alignSelf: "center",
              width: 25
            }}
          >
            <Ionicons name={icon} size={25} style={{ alignSelf: "center" }} />
          </View>
          <Text style={styles.nameText}>{category}</Text>
        </View>
        <View style={styles.categorySpendingContainer}>
          <View style={styles.categorySpendingItemContainer}>
            <Text>
              {Number(amountLastMonth).toLocaleString("en-US", {
                style: "currency",
                currency: "USD"
              })}
            </Text>
          </View>
          <View style={styles.categorySpendingItemContainer}>
            <Text>
              {Number(amountThisMonth).toLocaleString("en-US", {
                style: "currency",
                currency: "USD"
              })}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  listHeader = () => {
    return (
      <View style={styles.categoryContainer}>
        <View style={styles.categoryNameContainer}>
          <Text style={styles.headerText}>Category</Text>
        </View>
        <View style={styles.categorySpendingContainer}>
          <View style={styles.categorySpendingItemContainer}>
            <Text style={styles.headerText}>Last Month</Text>
          </View>
          <View style={styles.categorySpendingItemContainer}>
            <Text style={styles.headerText}>This Month</Text>
          </View>
        </View>
      </View>
    );
  };

  render() {
    const { transactions, categories } = this.props.global;

    // compute amount spent by category for this and last month
    today = new Date();

    const amountByCategory = _(transactions)
      .groupBy("category")
      .map((group, name) => ({
        category: name,
        amountThisMonth: _(group)
          .filter(t => t.date.getMonth() === today.getMonth())
          .sumBy("amount"),
        amountLastMonth: _(group)
          .filter(t => t.date.getMonth() === today.getMonth() - 1)
          .sumBy("amount")
      }))
      .filter(t => t.category !== "No Category")
      .sortBy("category")
      .value();

    if (!amountByCategory || !amountByCategory.length) {
      return (
        <View style={styles.container}>
          <Text style={styles.emptyScreenText}>Add some transactions! 💰</Text>
        </View>
      );
    }

    // merge icons with amounts by category
    _.merge(
      _.keyBy(amountByCategory, "category"),
      _.keyBy(categories, "label")
    );

    return (
      <View style={styles.container}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.spendingContainer}>
            <FlatList
              data={amountByCategory}
              renderItem={({ item, index }) => this.listItem(item, index)}
              ListHeaderComponent={() => this.listHeader()}
              ItemSeparatorComponent={this.ListItemSeparator}
              keyExtractor={(item, index) => item + index}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default withGlobalContext(SpendingScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  contentContainer: {
    marginHorizontal: 10
  },
  spendingContainer: {
    // alignItems: "center"
  },
  categoryContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  nameText: {
    marginHorizontal: 10,
    alignSelf: "center"
  },
  categoryNameContainer: {
    flexDirection: "row",
    marginVertical: 10
  },
  categorySpendingContainer: {
    flexDirection: "row-reverse"
  },
  categorySpendingItemContainer: {
    minWidth: 85,
    marginVertical: 12,
    flexDirection: "row-reverse",
    alignSelf: "center"
  },
  headerText: {
    fontWeight: "bold"
  },
  emptyScreenText: {
    height: "100%",
    textAlign: "center",
    marginTop: 30,
    fontSize: 22
  }
});
