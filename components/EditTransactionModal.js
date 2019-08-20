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
  render() {
    const { navigation } = this.props;
    const transaction = navigation.getParam("transaction");
    const onExitModal = navigation.getParam("onExitModal");
    const onChangeTransaction = navigation.getParam("onChangeTransaction");
    const onDeleteTransaction = navigation.getParam("onDeleteTransaction");

    // TODO: https://reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html
    const { id, name, amount, category, date, notes } = transaction;

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
                onChangeText={amount => onChangeTransaction("amount", amount)}
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
              onChangeText={name => onChangeTransaction("name", name)}
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
              onChangeText={notes => onChangeTransaction("notes", notes)}
              clearButtonMode="always"
            />
            {/* <Text style={styles.inputLabel}>Category</Text> */}
            {/* <PickerIOS
              selectedValue={category}
              onValueChange={category =>
                onChangeTransaction("category", category)
              }
            >
              {props.global.categories.map(category => {
                return (
                  <PickerIOS.Item
                    key={category.label}
                    value={category.label}
                    label={category.label}
                  />
                );
              })}
            </PickerIOS> */}
            {/* <Text style={styles.inputLabel}>Date</Text> */}
            {/* <DatePickerIOS
              date={date}
              onDateChange={date => onChangeTransaction("date", date)}
              mode="date"
            /> */}
            <Button
              style={{ marginBottom: 0 }}
              title="Save"
              onPress={onExitModal}
            />
            <Button
              title="Delete"
              style={{ marginBottom: 0 }}
              color="red"
              onPress={() => onDeleteTransaction(id)}
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
