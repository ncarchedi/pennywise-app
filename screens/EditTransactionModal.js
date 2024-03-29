import React from "react";
import {
  StyleSheet,
  ScrollView,
  Button,
  Text,
  View,
  TextInput
} from "react-native";
import moment from "moment";
import DateTimePicker from "react-native-modal-datetime-picker";
import { Appearance } from "react-native-appearance";

import Colors from "../constants/Colors";
import { withGlobalContext } from "../GlobalContext";
import { toPrettyDate } from "../utils/TransactionUtils";
import TextInputWithIcon from "../components/TextInputWithIcon";

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
      transaction: {
        id,
        name,
        amount,
        category,
        date,
        notes
      },
      isDatePickerVisible: false
    };
  }

  componentDidMount() {
    // necessary for parameterizing the header bar button. See:
    // https://reactnavigation.org/docs/en/header-buttons.html#adding-a-button-to-the-header
    this.props.navigation.setParams({
      saveTransaction: this.handleSaveTransaction
    });

    // when modal loads, display amount with 2 trailing digits
    this.setState({
      transaction: {
        ...this.state.transaction,
        amount: Number(this.state.transaction.amount).toFixed(2)
      }
    });
  }

  handleChangeTransaction = (key, value) => {
    const { transaction } = this.state;
    this.setState({ transaction: { ...transaction, [key]: value } });
  };

  handleSaveTransaction = () => {
    const { updateTransaction } = this.props.global;
    const { transaction } = this.state;
    const amount = transaction.amount;

    savedTransaction =
      typeof amount === "string"
        ? { ...transaction, amount: Number(amount) }
        : transaction;

    updateTransaction({ ...savedTransaction });
    this.props.navigation.goBack();
  };

  handleDeleteTransaction = () => {
    const { deleteTransaction } = this.props.global;
    const { id } = this.state.transaction;

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
    const { categories, addCategory } = this.props.global;
    const { navigation } = this.props;

    // Which category modal will we send users to?
    // TODO: there must be a less hacky way to do this
    const categoryModalRouteName =
      navigation.state.routeName === "EditModalTodo"
        ? "CategoryModalTodo"
        : "CategoryModalTransactions";

    const transaction = this.state.transaction;
    const { name, amount, date, notes, category } = transaction;

    return (
      <ScrollView
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
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
                // on blur, add 2 trailing decimals to amount if necessary
                onBlur={() => {
                  this.setState({
                    transaction: {
                      ...transaction,
                      amount: Number(amount).toFixed(2)
                    }
                  });
                }}
                keyboardType={"numeric"}
                autoCorrect={false}
              />
            </View>
            <TextInputWithIcon
              icon="ios-create"
              value={name}
              placeholder="Name"
              onChangeText={name => this.handleChangeTransaction("name", name)}
              autoCorrect={false}
            />
            <TextInputWithIcon
              icon="ios-pricetags"
              onPress={() =>
                navigation.navigate(categoryModalRouteName, {
                  transactionName: name,
                  categories: categories,
                  onAddCategory: addCategory,
                  onChangeCategory: this.handleChangeTransaction
                })
              }
              fakeTheInput={true}
              fakeValue={<Text>{category}</Text>}
            />
            <TextInputWithIcon
              icon="ios-calendar"
              onPress={() => this.toggleDatePicker()}
              fakeTheInput={true}
              fakeValue={<Text>{toPrettyDate(date, true)}</Text>}
            />
            <DateTimePicker
              date={moment(date).toDate()}
              isVisible={this.state.isDatePickerVisible}
              onConfirm={this.handleConfirmDate}
              onCancel={this.toggleDatePicker}
              hideTitleContainerIOS={true}
              datePickerContainerStyleIOS={{
                backgroundColor:
                  Appearance.getColorScheme() === "dark" ? "black" : "white"
              }}
            />
            <TextInputWithIcon
              icon="ios-paper"
              value={notes}
              placeholder="Notes"
              onChangeText={notes =>
                this.handleChangeTransaction("notes", notes)
              }
            />
            <View style={{ marginTop: 10 }}>
              <Button
                title="Delete Transaction"
                color={Colors.warningRed}
                onPress={this.handleDeleteTransaction}
              />
            </View>
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
  dollarSign: {
    fontSize: 50,
    marginRight: 5
  },
  amountInput: {
    fontSize: 50,
    marginBottom: 10
  }
});
