import React from "react";
import { ScrollView, StyleSheet, Text, View, SectionList } from "react-native";

export default function TransactionsScreen() {
  NewTransactionsList = () => {
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

  CategorizedTransactionsList = () => {
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
        sections={[
          { title: "Monday, July 22", data: ["Whole Foods"] },
          {
            title: "Saturday, July 20",
            data: ["Netflix", "Tequila Sunrise"]
          }
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
        <Text style={styles.transactionsListHeader}>New</Text>
        <NewTransactionsList />
        <Text style={[styles.transactionsListHeader, { marginTop: 20 }]}>
          Categorized
        </Text>
        <CategorizedTransactionsList />
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
  transactionsListHeader: {
    fontSize: 34,
    marginBottom: 10,
    backgroundColor: "lightgrey"
  },
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
