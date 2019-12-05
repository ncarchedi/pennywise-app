import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import _ from "lodash";

import Colors from "../constants/Colors";
import SearchBar from "../components/SearchBar";

export default class SelectCategoryModal extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Select Category",
      headerRight: (
        <TouchableOpacity
          onPress={navigation.getParam("addCategory")}
          style={{ paddingHorizontal: 20 }}
        >
          <Ionicons name="ios-add" size={35} />
        </TouchableOpacity>
      )
    };
  };

  state = {
    searchText: ""
  };

  componentDidMount = () => {
    this.props.navigation.setParams({
      addCategory: this.handlePressAddCategory
    });
  };

  handleChangeCategory = label => {
    const onChangeCategory = this.props.navigation.getParam("onChangeCategory");

    onChangeCategory("category", label);
    this.props.navigation.goBack();
  };

  handlePressAddCategory = () => {
    const { searchText } = this.state;

    searchText
      ? Alert.alert(
          "Create New Category",
          `Would you like to create a new category called "${searchText}"?`,
          [
            {
              text: "Cancel"
            },
            { text: "OK", onPress: this.handleAddCategory }
          ]
        )
      : Alert.alert(
          "Name Your Category",
          "Please enter a name for your new category in the search box."
        );
  };

  handleAddCategory = async () => {
    const onAddCategory = this.props.navigation.getParam("onAddCategory");
    const { searchText } = this.state;

    const newCategory = await onAddCategory({
      // TODO: allow user to pick icon?
      icon: "ios-card",
      label: searchText
    });
    this.handleChangeCategory(newCategory.label);
  };

  handleSearchTextChange = text => {
    this.setState({ searchText: text });
  };

  listItem = item => {
    const { icon, label } = item;

    return (
      <TouchableOpacity onPress={() => this.handleChangeCategory(label)}>
        <View style={styles.itemContainer}>
          <View style={styles.iconContainer}>
            <Ionicons name={icon} size={25} style={{ alignSelf: "center" }} />
          </View>
          <Text style={styles.nameText}>{label}</Text>
        </View>
      </TouchableOpacity>
    );
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

  render() {
    const transactionName = this.props.navigation.getParam("transactionName");
    const categories = this.props.navigation.getParam("categories");
    const { searchText } = this.state;

    return (
      <ScrollView
        style={styles.contentContainer}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        <SearchBar
          placeholder={
            transactionName
              ? `Select a category for "${transactionName}"`
              : "Select a category"
          }
          onChangeText={text => this.handleSearchTextChange(text)}
          autoFocus={true}
        />
        <FlatList
          data={categories.filter(c =>
            _.includes(_.lowerCase(c.label), _.lowerCase(searchText))
          )}
          renderItem={({ item }) => this.listItem(item)}
          keyExtractor={item => item.label}
          ItemSeparatorComponent={this.ListItemSeparator}
          ListEmptyComponent={() => (
            <Text
              style={{
                marginTop: 15,
                fontStyle: "italic",
                textAlign: "center",
                color: Colors.darkGrey
              }}
            >
              {`Press the + icon to add a category called "${searchText}"`}
            </Text>
          )}
          keyboardShouldPersistTaps="always"
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    marginHorizontal: 10
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
