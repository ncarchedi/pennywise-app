import React from "react";
import { StyleSheet, Text, SectionList, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";

export default function TransactionsList({ header, transactions }) {
  ListItemSeparator = () => {
    return (
      <View style={{ height: 1, width: "100%", backgroundColor: "#f1f1f1" }} />
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={transactions}
        renderItem={({ item, index }) => (
          <View style={styles.transactionsListItem} key={index}>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={[
                  styles.transactionsListItemText,
                  { fontWeight: "bold" }
                ]}
              >
                {item.name}
              </Text>
              <Text
                style={[
                  styles.transactionsListItemText,
                  { marginLeft: "auto" }
                ]}
              >
                {Number(item.amount).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD"
                })}
              </Text>
            </View>
            <Text
              style={[
                styles.transactionsListItemText,
                { fontStyle: "italic", marginTop: 5 }
              ]}
            >
              {item.category}
            </Text>
          </View>
        )}
        ItemSeparatorComponent={this.ListItemSeparator}
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
    marginHorizontal: 10
  },
  transactionsListItemText: {
    color: "rgba(96, 100, 109, 1)"
  }
});
