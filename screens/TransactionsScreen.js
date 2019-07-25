import React from "react";
import { ScrollView, StyleSheet, Text, View, SectionList } from "react-native";

export default function TransactionsScreen() {
  SectionListItemSeparator = () => {
    return (
      <View
        style={{ height: 0.25, width: "100%", backgroundColor: "#C8C8C8" }}
      />
    );
  };

  TransactionList = () => {
    return (
      <SectionList
        ItemSeparatorComponent={this.SectionListItemSeparator}
        renderItem={({ item, index }) => (
          <Text style={styles.transactionListItem} key={index}>
            {item}
          </Text>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.transactionDateHeader}>{title}</Text>
        )}
        sections={[
          { title: "Thursday, July 25", data: ["Amazon.com"] },
          {
            title: "Wednesday, July 24",
            data: ["Union Square Cafe", "ACME, Inc.", "The Corner Store"]
          },
          { title: "Tuesday, July 23", data: ["Ace Hardware"] }
        ]}
        keyExtractor={(item, index) => item + index}
      />
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={styles.transactionListHeader}>New</Text>
        <TransactionList />
        <Text style={[styles.transactionListHeader, { marginTop: 20 }]}>
          Categorized
        </Text>
        <TransactionList />
      </ScrollView>
    </View>
  );
}

TransactionsScreen.navigationOptions = {
  title: "Transactions"
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  contentContainer: {
    paddingTop: 30,
    paddingHorizontal: 20
  },
  transactionListHeader: {
    fontSize: 34,
    marginBottom: 10,
    backgroundColor: "lightgrey"
  },
  transactionDateHeader: {
    fontSize: 22,
    marginTop: 10
  },
  transactionListItem: {
    fontSize: 17,
    color: "rgba(96, 100, 109, 1)",
    marginVertical: 15
  }
});
