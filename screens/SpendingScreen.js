import React from "react";
import { ScrollView, StyleSheet, Text, View, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import _ from "lodash";

import { withGlobalContext } from "../GlobalContext";

class SpendingScreen extends React.Component {
  static navigationOptions = {
    title: "Spending"
  };

  listItem = (item, index) => {
    return (
      <View style={styles.categoryContainer}>
        <View style={styles.categoryNameContainer}>
          <Ionicons name={item.icon} size={20} style={{ width: 20 }} />
          <Text style={styles.nameText}>{item.category}</Text>
        </View>
        <View style={styles.categorySpendingContainer}>
          <View style={styles.categorySpendingItemContainer}>
            <Text>
              {/* Todo: replace with actual values */}
              {Number("400").toLocaleString("en-US", {
                style: "currency",
                currency: "USD"
              })}
            </Text>
          </View>
          <View style={styles.categorySpendingItemContainer}>
            <Text>
              {item.amount.toLocaleString("en-US", {
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
            <Text style={styles.headerText}>Last month</Text>
          </View>
          <View style={styles.categorySpendingItemContainer}>
            <Text style={styles.headerText}>This month</Text>
          </View>
        </View>
      </View>
    );
  };

  render() {
    const { transactions, categories } = this.props.global;

    // compute amount spent per category (all-time)
    const amountByCategory = _(transactions)
      .groupBy("category")
      .map((category, name) => ({
        category: name,
        amount: _.sumBy(category, "amount")
      }))
      .sortBy("category")
      .value();

    // merge icons with amounts by category
    _.merge(
      _.keyBy(amountByCategory, "category"),
      _.keyBy(categories, "label")
    );

    return (
      <View style={styles.container}>
        {!transactions ? (
          <Text style={styles.emptyScreenText}>Nothing to see here! 🎉</Text>
        ) : (
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
          >
            <View style={styles.spendingContainer}>
              <FlatList
                data={amountByCategory}
                renderItem={({ item, index }) => this.listItem(item, index)}
                ListHeaderComponent={() => this.listHeader()}
                keyExtractor={(item, index) => item + index}
              />
            </View>
          </ScrollView>
        )}
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
    marginHorizontal: 10
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
    marginVertical: 10,
    flexDirection: "row-reverse"
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
