import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SectionList,
  Alert,
  Button
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Colors from "../constants/Colors";
import { withGlobalContext } from "../GlobalContext";

class LinkedAccountsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Manage Bank Accounts",
      headerRight: (
        <TouchableOpacity
          onPress={() => navigation.navigate("PlaidModal")}
          style={{ paddingHorizontal: 20 }}
        >
          <Ionicons name="ios-add" size={35} />
        </TouchableOpacity>
      )
    };
  };

  onRemovePressed = async itemId => {
    const result = await this.props.global.removeInstitutionAccount(itemId);

    if (result.error) {
      Alert.alert(
        "Error removing account",
        "Make sure you're connected to the internet and try again."
      );
    }
  };

  render() {
    const institutionAccounts = this.props.global.institutionAccounts;

    if (!institutionAccounts || institutionAccounts.length === 0) {
      return (
        <View style={styles.container}>
          <Text style={styles.emptyAccountsText}>
            Add a bank account to automatically import transactions
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
                    color={Colors.warningRed}
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
    backgroundColor: Colors.primaryWhite
  },
  emptyAccountsText: {
    marginTop: 30,
    color: Colors.darkGrey,
    width: "60%",
    textAlign: "center",
    alignSelf: "center",
    lineHeight: 20
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
