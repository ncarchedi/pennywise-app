import React from "react";
import { Button, Text } from "react-native";
import Modal from "react-native-modal";

export default function EditTransactionModal({
  transaction,
  isVisible,
  onExitModal
}) {
  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.95}
      backdropColor="#fff"
      animationInTiming={50}
      backdropTransitionInTiming={50}
      style={{ alignItems: "center" }}
    >
      <Text>{transaction.name}</Text>
      <Text>{transaction.amount}</Text>
      <Text>{transaction.category}</Text>
      <Text>{transaction.date}</Text>
      <Button title="Go Back" onPress={onExitModal} />
    </Modal>
  );
}
