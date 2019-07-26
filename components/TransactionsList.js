import React from "react";
import { StyleSheet, Text, SectionList } from "react-native";

export default function TransactionsList({ transactions }) {
  return (
    <SectionList
      renderItem={({ item, index }) => (
        <Text style={styles.transactionsListItem} key={index}>
          {item}
        </Text>
      )}
      renderSectionHeader={({ section: { title } }) => (
        <Text style={styles.transactionsDateHeader}>{title}</Text>
      )}
      sections={transactions}
      keyExtractor={(item, index) => item + index}
    />
  );
}

const styles = StyleSheet.create({
  transactionsDateHeader: {
    fontSize: 22,
    marginTop: 10
  },
  transactionsListItem: {
    fontSize: 17,
    color: "rgba(96, 100, 109, 1)",
    marginVertical: 15
  }
});
