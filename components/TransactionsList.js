import React from "react";
import {
  StyleSheet,
  Text,
  FlatList,
  View,
  TouchableOpacity
} from "react-native";

export default function TransactionsList({ transactions, onTransactionPress }) {
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

  return (
    <View style={styles.container}>
      <FlatList
        data={transactions.filter(t => t.category)}
        renderItem={({ item, index }) => this.ListItem(item, index)}
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
  transactionsListItem: {
    paddingVertical: 15,
    marginHorizontal: 10
  }
});
