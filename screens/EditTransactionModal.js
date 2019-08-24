import React from "react";
import {
  StyleSheet,
  ScrollView,
  Button,
  Text,
  View,
  TextInput,
  PickerIOS,
  TouchableOpacity
} from "react-native";
import DateTimePicker from "react-native-modal-datetime-picker";

import { withGlobalContext } from "../GlobalContext";
import { toPrettyDate } from "../utils/TransactionUtils";

class EditTransactionModal extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: "Edit Transaction",
      headerRight: (
        <Button title="Save" onPress={navigation.getParam("saveTransaction")} />
      )
    };
  };

  constructor(props) {
    super(props);

    const transaction = props.navigation.getParam("transaction");
    const { id, name, amount, category, date, notes } = transaction;

    this.state = {
      id,
      name,
      amount,
      category,
      date,
      notes,
      isDatePickerVisible: false
    };
  }

  componentDidMount() {
    // necessary for parameterizing the header bar button. See:
    // https://reactnavigation.org/docs/en/header-buttons.html#adding-a-button-to-the-header
    this.props.navigation.setParams({
      saveTransaction: this.handleSaveTransaction
    });
  }

  handleChangeTransaction = (key, value) => {
    this.setState({ ...this.state, [key]: value });
  };

  handleSaveTransaction = () => {
    const { updateTransaction } = this.props.global;
    const transaction = { ...this.state };

    updateTransaction(transaction);
    this.props.navigation.goBack();
  };

  handleDeleteTransaction = () => {
    const { deleteTransaction } = this.props.global;
    const { id } = this.state;

    this.props.navigation.goBack();
    deleteTransaction(id);
  };

  toggleDatePicker = () => {
    const { isDatePickerVisible } = this.state;
    this.setState({ isDatePickerVisible: !isDatePickerVisible });
  };

  handleConfirmDate = date => {
    this.handleChangeTransaction("date", date);
    this.toggleDatePicker();
  };

  render() {
    const { categories } = this.props.global;
    const { name, amount, category, date, notes } = this.state;

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.modalContent}>
          <View style={styles.modalBody}>
            <View style={{ flexDirection: "row", alignSelf: "center" }}>
              <Text style={[styles.dollarSign]}>$</Text>
              <TextInput
                style={styles.amountInput}
                value={String(amount)}
                placeholder="24.99"
                onChangeText={amount =>
                  this.handleChangeTransaction("amount", amount)
                }
                keyboardType={"numbers-and-punctuation"}
                autoCorrect={false}
              />
            </View>
            <TextInput
              style={styles.textInput}
              value={name}
              placeholder="Name"
              onChangeText={name => this.handleChangeTransaction("name", name)}
              autoCorrect={false}
              clearButtonMode="always"
            />
            <TouchableOpacity
              style={styles.textInput}
              onPress={() => this.toggleDatePicker()}
            >
              <Text>{toPrettyDate(date, true)}</Text>
            </TouchableOpacity>
            <DateTimePicker
              date={date}
              titleIOS="Transaction Date"
              isVisible={this.state.isDatePickerVisible}
              onConfirm={this.handleConfirmDate}
              onCancel={this.toggleDatePicker}
            />
            <TextInput
              style={styles.textInput}
              value={notes}
              placeholder="Notes"
              onChangeText={notes =>
                this.handleChangeTransaction("notes", notes)
              }
              clearButtonMode="always"
            />
            <PickerIOS
              selectedValue={category}
              onValueChange={category =>
                this.handleChangeTransaction("category", category)
              }
            >
              {categories.map(category => {
                return (
                  <PickerIOS.Item
                    key={category.label}
                    value={category.label}
                    label={category.label}
                  />
                );
              })}
            </PickerIOS>
            <Button
              title="Delete Transaction"
              color="red"
              onPress={this.handleDeleteTransaction}
            />
          </View>
        </View>
      </ScrollView>
    );
  }
}

export default withGlobalContext(EditTransactionModal);

const styles = StyleSheet.create({
  modalContent: {
    flex: 1
  },
  modalBody: {
    marginVertical: 15,
    marginHorizontal: 10
  },
  textInput: {
    padding: 10,
    marginTop: 10,
    height: 40,
    borderColor: "#f1f1f1",
    borderRadius: 5,
    borderWidth: 1
  },
  dollarSign: {
    fontSize: 50,
    marginRight: 5
  },
  amountInput: {
    fontSize: 50,
    marginBottom: 10
  }
});
