import React from "react";
import { StyleSheet, View, FlatList, Text, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import _ from "lodash";

export default class SelectCategoryModal extends React.Component {
  state = {
    searchText: ""
  };

  listItem = item => {
    const { icon, label } = item;

    return (
      <View style={styles.itemContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={25} style={{ alignSelf: "center" }} />
        </View>
        <Text style={styles.nameText}>{label}</Text>
      </View>
    );
  };

  ListItemSeparator = () => {
    return (
      <View style={{ height: 1, width: "100%", backgroundColor: "#f1f1f1" }} />
    );
  };

  render() {
    const categories = this.props.navigation.getParam("categories");
    const { searchText } = this.state;

    return (
      <View style={styles.contentContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search categories"
          onChangeText={text => this.setState({ searchText: text })}
        />
        {/* TODO: fix scroll so not hidden behind footer */}
        <FlatList
          data={categories.filter(c =>
            _.includes(_.lowerCase(c.label), _.lowerCase(searchText))
          )}
          renderItem={({ item }) => this.listItem(item)}
          keyExtractor={item => item.label}
          ItemSeparatorComponent={this.ListItemSeparator}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    marginHorizontal: 10
  },
  searchBar: {
    height: 40,
    padding: 10,
    marginTop: 10,
    marginBottom: 5,
    borderColor: "#f1f1f1",
    borderRadius: 5,
    borderWidth: 1
  },
  itemContainer: {
    flex: 1,
    flexDirection: "row",
    marginVertical: 10,
    alignItems: "center"
  },
  iconContainer: {
    width: 25
  },
  nameText: {
    marginLeft: 10
  }
});
