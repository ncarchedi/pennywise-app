import React from "react";
import { StyleSheet, Text, SectionList, View } from "react-native";

export default function TransactionsList({ header, transactions }) {
  ListItemSeparator = () => {
    return (
      <View style={{ height: 1, width: "100%", backgroundColor: "#f1f1f1" }} />
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.transactionsListHeader}>{header}</Text>
      <SectionList
        ItemSeparatorComponent={this.ListItemSeparator}
        renderItem={({ item, index }) => (
          <View style={[styles.transactionsListItem]} key={index}>
            <Text style={[styles.transactionsListItemText]}>{item.name}</Text>
            <Text
              style={[styles.transactionsListItemText, { marginLeft: "auto" }]}
            >
              {`$` + item.amount}
            </Text>
          </View>
        )}
        renderSectionHeader={({ section: { date } }) => (
          <Text style={styles.transactionsDateHeader}>{date}</Text>
        )}
        sections={transactions}
        keyExtractor={(item, index) => item + index}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  transactionsListHeader: {
    color: "#fff",
    fontSize: 22,
    marginBottom: 10,
    backgroundColor: "#92BFB1",
    paddingVertical: 5,
    paddingHorizontal: 10
  },
  transactionsDateHeader: {
    fontWeight: "bold",
    marginTop: 10,
    marginHorizontal: 10
  },
  transactionsListItem: {
    paddingVertical: 15,
    marginHorizontal: 10,
    flexDirection: "row"
  },
  transactionsListItemText: {
    color: "rgba(96, 100, 109, 1)"
  }
});
