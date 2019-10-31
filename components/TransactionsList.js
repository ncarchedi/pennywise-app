import React from "react";
import {
  StyleSheet,
  Text,
  FlatList,
  View,
  TouchableOpacity
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import _ from "lodash";

import { toPrettyDate, leftJoin } from "../utils/TransactionUtils";

export default function TransactionsList({
  transactions,
  categories,
  onTransactionPress,
  categorized,
  statusMessage
}) {
  ListItemSeparator = () => {
    return (
      <View style={{ height: 1, width: "100%", backgroundColor: "#f1f1f1" }} />
    );
  };

  ListItem = (item, index) => {
    const { name, amount, date, category, icon, institution, account } = item;

    return (
      <TouchableOpacity onPress={() => onTransactionPress(item)}>
        <View style={styles.transactionsListItem} key={index}>
          <View
            style={{
              alignSelf: "center",
              width: 25
            }}
          >
            <Ionicons name={icon} size={25} style={{ alignSelf: "center" }} />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ fontWeight: "bold", flex: 1, flexWrap: "wrap" }}>
                {name || "No Name"}
              </Text>
              <Text style={{ marginLeft: "auto" }}>
                {Number(amount).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD"
                })}
              </Text>
            </View>
            <View style={{ flexDirection: "row", marginTop: 5 }}>
              <Text>{toPrettyDate(date)}</Text>
              <Text style={{ fontStyle: "italic", marginLeft: "auto" }}>
                {category}
              </Text>
            </View>
            <View style={{ marginTop: 5 }}>
              <Text style={{ color: "gray", fontSize: 12 }}>
                {/* TODO: allow users to choose account when adding manually? */}
                {institution ? institution + " - " + account : "No Account"}
              </Text>
            </View>
          </View>
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

  const transactionsWithIcons = leftJoin(
    transactionsFiltered,
    categories,
    "category",
    "label"
  );

  const transactionsFinal = _(transactionsWithIcons)
    .sortBy("date")
    .reverse()
    .value();

  // console.log("rendering transactions list...");

  return (
    <View style={styles.container}>
      <FlatList
        data={transactionsFinal}
        renderItem={({ item, index }) => this.ListItem(item, index)}
        ItemSeparatorComponent={this.ListItemSeparator}
        keyExtractor={(item, index) => item + index}
        ListEmptyComponent={() => (
          <View>
            <Text style={styles.emptyScreenEmoji}>🎉</Text>
            <Text style={styles.emptyScreenHeader}>All done for today!</Text>
            {statusMessage ? (
              <Text style={styles.statusMessageText}>{statusMessage}</Text>
            ) : null}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  transactionsListItem: {
    marginVertical: 12,
    marginHorizontal: 10,
    flexDirection: "row"
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
  emptyScreenEmoji: {
    fontSize: 60,
    textAlign: "center",
    marginTop: 30
  },
  emptyScreenHeader: {
    fontSize: 22,
    marginTop: 15,
    textAlign: "center"
  },
  statusMessageText: {
    fontSize: 17,
    marginTop: 15,
    textAlign: "center"
  }
});
