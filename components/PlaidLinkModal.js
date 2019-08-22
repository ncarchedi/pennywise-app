import React from "react";
import PlaidAuthenticator from "react-native-plaid-link";

import { withGlobalContext } from "../GlobalContext";

class PlaidLinkModal extends React.Component {
  onMessage = data => {
    const { getAccessTokenFromPublicToken } = this.props.global;
    const { navigation } = this.props;

    if (data.action.includes("connected")) {
      getAccessTokenFromPublicToken(data.metadata.public_token);
      this.setState({ data });
      navigation.goBack();
    } else this.setState({ data });
  };

  render() {
    return (
      <PlaidAuthenticator
        onMessage={data => this.onMessage(data)}
        publicKey="aef79d0fac8493ad10a8760b0c01a6"
        env="development"
        product="transactions"
        clientName="Conscious Spending"
        selectAccount={false}
      />
    );
  }
}

export default withGlobalContext(PlaidLinkModal);
