import React from "react";
import {
  StyleSheet,
  Text,
  SectionList,
  View,
  TouchableOpacity
} from "react-native";
import _ from "lodash";

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
    return (
      <TouchableOpacity onPress={() => onTransactionPress(item)}>
        <View style={styles.transactionsListItem} key={index}>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontWeight: "bold" }}>{item.name}</Text>
            <Text style={{ marginLeft: "auto" }}>
              {Number(item.amount).toLocaleString("en-US", {
                style: "currency",
                currency: "USD"
              })}
            </Text>
          </View>
          <Text style={{ fontStyle: "italic", marginTop: 5 }}>
            {item.category}
          </Text>
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
      date: date,
      data: transactions
    }))
    .sortBy("date")
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
            <Text style={styles.sectionHeader}>{date}</Text>
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
    fontWeight: "bold",
    fontSize: 22,
    backgroundColor: "maroon",
    color: "#fff",
    paddingLeft: 10,
    paddingVertical: 1
  },
  emptyScreenText: {
    height: "100%",
    textAlign: "center",
    marginTop: 30,
    fontSize: 22
  }
});
