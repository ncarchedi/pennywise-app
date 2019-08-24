import React from "react";
import { StyleSheet, View, FlatList, Text, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default SelectCategoryModal = props => {
  const categories = props.navigation.getParam("categories");
  console.log(categories);

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

  return (
    <View style={styles.contentContainer}>
      <TextInput style={styles.searchBar} placeholder="Search categories" />
      <FlatList
        data={categories}
        renderItem={({ item }) => this.listItem(item)}
        keyExtractor={item => item.label}
        ItemSeparatorComponent={this.ListItemSeparator}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    marginHorizontal: 10
  },
  searchBar: {
    height: 40,
    padding: 10,
    marginVertical: 5,
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
