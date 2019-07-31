import React from "react";
import {
  StyleSheet,
  Button,
  Text,
  View,
  DatePickerIOS,
  TextInput,
  Picker
} from "react-native";
import Modal from "react-native-modal";

import categoriesData from "../categories.json";

export default function EditTransactionModal({
  transaction,
  isVisible,
  onExitModal
}) {
  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={1}
      backdropColor="#fff"
      animationInTiming={50}
      backdropTransitionInTiming={50}
    >
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Edit Transaction</Text>
        </View>
        <View style={styles.modalBody}>
          <Text style={styles.inputLabel}>Name</Text>
          <TextInput
            style={styles.textInput}
            value={transaction.name}
            onChangeText={name => console.log(name)}
          />
          <Text style={styles.inputLabel}>Amount</Text>
          <TextInput
            style={styles.textInput}
            value={transaction.amount}
            onChangeText={amount => console.log(amount)}
          />
          <Text style={styles.inputLabel}>Category</Text>
          <Picker
            selectedValue={transaction.category}
            onValueChange={category => console.log(category)}
          >
            {categoriesData.map(category => {
              return (
                <Picker.Item
                  key={category.id}
                  value={category.name}
                  label={category.name}
                />
              );
            })}
          </Picker>
          <Text style={styles.inputLabel}>Date</Text>
          <DatePickerIOS
            date={new Date(transaction.date)}
            onDateChange={date => console.log(date)}
          />
          <Button
            style={{ marginBottom: 0 }}
            title="Done"
            onPress={onExitModal}
          />
        </View>
      </View>
    </Modal>
  );
}

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
