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

import Colors from "../constants/Colors";
import { toPrettyDate, leftJoin } from "../utils/TransactionUtils";
import SearchBar from "../components/SearchBar";

export default class TransactionsList extends React.Component {
  state = {
    searchText: ""
  };

  ListItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: Colors.veryLightGrey
        }}
      />
    );
  };

  ListItem = (item, index) => {
    const { name, amount, date, category, icon, institution, account } = item;

    return (
      <TouchableOpacity onPress={() => this.props.onTransactionPress(item)}>
        <View style={styles.transactionsListItem} key={index}>
          <View
            style={{
              alignSelf: "center",
              width: 25
            }}
          >
            <Ionicons
              name={icon ? icon : "ios-archive"}
              size={25}
              style={{ alignSelf: "center" }}
            />
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
              <Text style={{ color: Colors.darkGrey, fontSize: 12 }}>
                {/* TODO: allow users to choose account when adding manually? */}
                {institution ? institution + " - " + account : "No Account"}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  handleSearchTextChange = text => {
    this.setState({ searchText: text });
  };

  render() {
    const { transactions, categories, emptyScreen, showSearchBar } = this.props;
    const { searchText } = this.state;

    const transactionsWithIcons = leftJoin(
      transactions,
      categories,
      "category",
      "label"
    );

    const transactionsFinal = _(transactionsWithIcons)
      .filter(
        t =>
          // transaction names
          _.includes(_.lowerCase(t.name), _.lowerCase(searchText)) ||
          // transaction categories
          _.includes(_.lowerCase(t.category), _.lowerCase(searchText)) ||
          // institution
          _.includes(_.lowerCase(t.institution), _.lowerCase(searchText)) ||
          // account
          _.includes(_.lowerCase(t.account), _.lowerCase(searchText))
      )
      .sortBy("date")
      .reverse()
      .value();

    return (
      <View style={styles.container}>
        <FlatList
          data={transactionsFinal}
          renderItem={({ item, index }) => this.ListItem(item, index)}
          ItemSeparatorComponent={this.ListItemSeparator}
          keyExtractor={(item, index) => item + index}
          ListEmptyComponent={emptyScreen}
          ListHeaderComponent={
            showSearchBar ? (
              <SearchBar
                placeholder="Search transactions, categories, and accounts"
                onChangeText={text => this.handleSearchTextChange(text)}
                style={{ marginHorizontal: 10 }}
              />
            ) : null
          }
          keyboardShouldPersistTaps="always"
          keyboardDismissMode="on-drag"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },
  transactionsListItem: {
    marginVertical: 12,
    marginHorizontal: 10,
    flexDirection: "row"
  }
});
