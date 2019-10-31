import React from "react";
import { StyleSheet, View, Button, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import _ from "lodash";

import TextInputWithIcon from "../components/TextInputWithIcon";

export default class AddCategoryModal extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Add Category",
      headerRight: (
        <Button
          title="Save"
          onPress={() => {
            navigation.getParam("handleAddCategory");
          }}
        />
      )
    };
  };

  state = {
    categoryName: this.props.navigation.getParam("searchText")
  };

  render() {
    // const categories = this.props.navigation.getParam("categories");

    return (
      <View style={styles.contentContainer}>
        <TextInputWithIcon
          icon="ios-create"
          value={this.state.categoryName}
          placeholder="Category name"
          onChangeText={name => this.setState({ categoryName: name })}
          clearButtonMode="while-editing"
          autoCorrect={false}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    marginHorizontal: 10,
    paddingTop: 10
  },
  categoryNameInput: {
    height: 40,
    padding: 10,
    marginTop: 10,
    marginBottom: 5,
    borderColor: "#f1f1f1",
    borderRadius: 5,
    borderWidth: 1
  }
});
