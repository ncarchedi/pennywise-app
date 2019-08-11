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
import Modal from "react-native-modal";

import { withGlobalContext } from "../GlobalContext";

function EditTransactionModal({
  transaction,
  isVisible,
  onExitModal,
  onChangeTransaction,
  ...props
}) {
  // todo: can we keep input values in component state to avoid
  // updating parent components on change events?
  const { name, amount, category, date } = transaction;

  console.log(amount);
  console.log(typeof amount);

  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={1}
      backdropColor="#fff"
      animationInTiming={50}
      backdropTransitionInTiming={50}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Transaction</Text>
          </View>
          <View style={styles.modalBody}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.textInput}
              value={name}
              placeholder="New Transaction"
              onChangeText={name => onChangeTransaction("name", name)}
            />
            <Text style={styles.inputLabel}>Amount</Text>
            <TextInput
              style={styles.textInput}
              value={String(amount)}
              placeholder="24.99"
              onChangeText={amount => onChangeTransaction("amount", amount)}
              autoCorrect={false}
            />
            <Text style={styles.inputLabel}>Category</Text>
            <PickerIOS
              selectedValue={category}
              onValueChange={category =>
                onChangeTransaction("category", category)
              }
            >
              {props.global.categories.map(category => {
                return (
                  <PickerIOS.Item
                    key={category.id}
                    value={category.label}
                    label={category.label}
                  />
                );
              })}
            </PickerIOS>
            <Text style={styles.inputLabel}>Date</Text>
            <DatePickerIOS
              date={new Date(date)}
              onDateChange={date => onChangeTransaction("date", date)}
              mode="date"
            />
            <Button
              style={{ marginBottom: 0 }}
              title="Done"
              onPress={onExitModal}
            />
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
}

export default withGlobalContext(EditTransactionModal);

const styles = StyleSheet.create({
  modalContent: {
    paddingTop: 40,
    flex: 1
  },
  modalHeader: {
    paddingBottom: 10,
    borderBottomColor: "#f1f1f1",
    borderBottomWidth: 0.5,
    width: "100%",
    alignItems: "center"
  },
  modalTitle: {
    fontWeight: "600",
    fontSize: 17,
    color: "rgba(0, 0, 0, 0.9)"
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
  inputLabel: {
    fontWeight: "bold",
    marginTop: 15
  }
});
