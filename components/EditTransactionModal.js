import React from "react";
import {
  StyleSheet,
  ScrollView,
  Button,
  Text,
  View,
  DatePickerIOS,
  TextInput,
  PickerIOS
} from "react-native";

import { withGlobalContext } from "../GlobalContext";

class EditTransactionModal extends React.Component {
  constructor(props) {
    super(props);

    const transaction = props.navigation.getParam("transaction");
    const { id, name, amount, category, date, notes } = transaction;

    this.state = { id, name, amount, category, date, notes };
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
                onSubmitEditing={() => {
                  this.nameInput.focus();
                }}
                blurOnSubmit={false}
                returnKeyType="next"
                autoFocus
              />
            </View>
            {/* <Text style={styles.inputLabel}>Name</Text> */}
            <TextInput
              style={styles.textInput}
              value={name}
              placeholder="Name"
              onChangeText={name => this.handleChangeTransaction("name", name)}
              ref={input => {
                this.nameInput = input;
              }}
              autoCorrect={false}
              clearButtonMode="always"
              returnKeyType="next"
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
            {/* <Text style={styles.inputLabel}>Category</Text> */}
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
            {/* <Text style={styles.inputLabel}>Date</Text> */}
            <DatePickerIOS
              date={date}
              onDateChange={date => this.handleChangeTransaction("date", date)}
              mode="date"
            />
            <Button
              style={{ marginBottom: 0 }}
              title="Save"
              onPress={this.handleSaveTransaction}
            />
            <Button
              title="Delete"
              style={{ marginBottom: 0 }}
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
    paddingTop: 40,
    flex: 1
  },
  modalBody: {
    marginTop: 15
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
  },
  inputLabel: {
    fontWeight: "bold",
    marginTop: 15
  }
});
