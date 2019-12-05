import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import _ from "lodash";

import Colors from "../constants/Colors";

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
      addCategory: this.handleAddCategory
    });
  };

  handleChangeCategory = label => {
    const onChangeCategory = this.props.navigation.getParam("onChangeCategory");

    onChangeCategory("category", label);
    this.props.navigation.goBack();
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
        <TextInput
          style={styles.searchBar}
          placeholder={
            transactionName
              ? `Select a category for "${transactionName}"`
              : "Select a category"
          }
          onChangeText={text => this.setState({ searchText: text })}
          autoFocus={true}
          autoCorrect={false}
          clearButtonMode="while-editing"
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
              {`No category called "${searchText}"`}
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
  searchBar: {
    height: 40,
    padding: 10,
    marginTop: 10,
    marginBottom: 5,
    borderColor: Colors.veryLightGrey,
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
