import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  DatePickerIOS,
  SectionList
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { withGlobalContext } from "../GlobalContext";

class LinkedAccountsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Linked bank accounts",
      headerRight: (
        <TouchableOpacity
          onPress={() => navigation.navigate("PlaidModal")}
          style={{ marginRight: 20 }}
        >
          <Ionicons name="ios-add" size={40} />
        </TouchableOpacity>
      )
    };
  };

  onRemovePressed = async itemId => {
    await this.props.global.removeInstitutionAccount(itemId);
  };

  render() {
    const institutionAccounts = this.props.global.institutionAccounts;

    if (!institutionAccounts || institutionAccounts.length === 0) {
      return (
        <View style={styles.container}>
          <Text style={styles.emptyAccountsText}>
            No bank accounts linked yet
          </Text>
        </View>
      );
    } else {
      const sectionListData = institutionAccounts.map(item => {
        return {
          title: item.institutionName,
          itemId: item.itemId,
          data: item.accounts.map(account => account.name)
        };
      });

      return (
        <View style={styles.container}>
          <SectionList
            renderItem={({ item, index, section }) => (
              <Text style={styles.listItemTextStyle} key={index}>
                {item}
              </Text>
            )}
            renderSectionHeader={({ section: { title, itemId } }) => (
              <View style={styles.sectionHeaderContainer}>
                <Text style={styles.sectionTextStyle}>{title}</Text>
                <TouchableOpacity onPress={() => this.onRemovePressed(itemId)}>
                  <Ionicons
                    name="ios-remove-circle-outline"
                    size={20}
                    color={"red"}
                  />
                </TouchableOpacity>
              </View>
            )}
            sections={sectionListData}
            keyExtractor={(item, index) => item + index}
          />
        </View>
      );
    }
  }
}

export default withGlobalContext(LinkedAccountsScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  emptyAccountsText: {
    margin: 10
  },
  sectionHeaderContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 10
  },
  sectionTextStyle: {
    fontWeight: "bold"
  },
  listItemTextStyle: {
    marginHorizontal: 20,
    marginVertical: 5
  }
});
