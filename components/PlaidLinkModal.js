import React from "react";
import {
  StyleSheet,
  Button,
  Text,
  View,
  DatePickerIOS,
  TextInput,
  PickerIOS
} from "react-native";
import Modal from "react-native-modal";

import { withGlobalContext } from "../GlobalContext";

import PlaidAuthenticator from 'react-native-plaid-link';

class PlaidLinkModal extends React.Component {
  render() {
    const isVisible = this.props.isVisible;
    const onExitModal = this.props.onExitModal;

    return (
      <Modal
      isVisible={isVisible}
      backdropOpacity={1}
      backdropColor="#fff"
      animationInTiming={50}
      backdropTransitionInTiming={50}
    >
      <PlaidAuthenticator
        onMessage={(data) => this.onMessage(data, onExitModal)}
        publicKey="aef79d0fac8493ad10a8760b0c01a6"
        env="sandbox"
        product="transactions"
        clientName="Conscious Spending Client"
        selectAccount={false}
      />
    </Modal>
    )
  }

  onMessage = (data, onCompleted) => {
    if(data.action.includes('connected')) {
      this.props.global.getAccessTokenFromPublicToken(data.metadata.public_token)
      this.setState({data})
      onCompleted()
    } else (
      this.setState({data})
    )
  }
}

export default withGlobalContext(PlaidLinkModal);

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
