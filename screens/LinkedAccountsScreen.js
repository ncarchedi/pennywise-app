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
import moment from "moment";

import { withGlobalContext } from "../GlobalContext";

class LinkedAccountsScreen extends React.Component {
  static navigationOptions = {
    title: "Linked Accounts"
  };

  state = {
    institutionAccounts: []
  };

  async componentDidMount() {
    this.setState({
      institutionAccounts: await this.props.global.getInstitutionAccounts()
    });
  }

  render() {
    const institutionAccounts = this.state.institutionAccounts;

    if (!institutionAccounts) {
      return (
        <View style={styles.container}>
          <Text>No bank accounts linked yet</Text>
        </View>
      );
    } else {
      const sectionListData = institutionAccounts.map(item => {
        return {
          title: item.institutionName,
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
            renderSectionHeader={({ section: { title } }) => (
              <Text style={styles.sectionTextStyle}>{title}</Text>
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
  sectionTextStyle: {
    fontWeight: "bold",
    margin: 10
  },
  listItemTextStyle: {
    marginHorizontal: 20,
    marginVertical: 5
  }
});
