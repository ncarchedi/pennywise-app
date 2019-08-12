import React from "react";
import {
  StyleSheet,
  Text,
  SectionList,
  View,
  TouchableOpacity
} from "react-native";
import _ from "lodash";

import { toPrettyDate } from "../utils/TransactionUtils";

export default function TransactionsList({
  transactions,
  onTransactionPress,
  categorized
}) {
  ListItemSeparator = () => {
    return (
      <View style={{ height: 1, width: "100%", backgroundColor: "#f1f1f1" }} />
    );
  };

  ListItem = (item, index) => {
    const { name, amount, category } = item;

    return (
      <TouchableOpacity onPress={() => onTransactionPress(item)}>
        <View style={styles.transactionsListItem} key={index}>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontWeight: "bold" }}>{name || "No Name"}</Text>
            <Text style={{ marginLeft: "auto" }}>
              {Number(amount).toLocaleString("en-US", {
                style: "currency",
                currency: "USD"
              })}
            </Text>
          </View>
          <Text style={{ fontStyle: "italic", marginTop: 5 }}>{category}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // get only the relevant transactions
  const transactionsFiltered = categorized
    ? _.reject(transactions, {
        category: "No Category"
      })
    : _.filter(transactions, {
        category: "No Category"
      });

  // reshape the transactions list for the section list
  const transactionsByDate = _(transactionsFiltered)
    .groupBy("date")
    .map((transactions, date) => ({
      date: toPrettyDate(date),
      data: transactions
    }))
    .sortBy("date")
    .reverse()
    .value();

  console.log("rendering transactions list...");

  return (
    <View style={styles.container}>
      {!transactionsByDate.length ? (
        <Text style={styles.emptyScreenText}>Nothing to see here! 🎉</Text>
      ) : (
        <SectionList
          sections={transactionsByDate}
          renderItem={({ item, index }) => this.ListItem(item, index)}
          renderSectionHeader={({ section: { date } }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>{date}</Text>
            </View>
          )}
          ItemSeparatorComponent={this.ListItemSeparator}
          keyExtractor={(item, index) => item + index}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  transactionsListItem: {
    marginVertical: 15,
    marginHorizontal: 10
  },
  sectionHeader: {
    paddingLeft: 10,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1"
  },
  sectionHeaderText: {
    fontSize: 28
  },
  emptyScreenText: {
    height: "100%",
    textAlign: "center",
    marginTop: 30,
    fontSize: 22
  }
});
