import React from "react";
import PlaidAuthenticator from "react-native-plaid-link";

import { withGlobalContext } from "../GlobalContext";

class PlaidLinkScreen extends React.Component {
  onMessage = data => {
    const { getAccessTokenFromPublicToken } = this.props.global;

    if (data.action.includes("connected")) {
      getAccessTokenFromPublicToken(data.metadata.public_token);
      this.setState({ data });
      this.onFinish();
    } else if (data.action.includes("plaid_link-undefined::exit")) {
      // When the x button is pressed on the top right
      this.onFinish();
    } else this.setState({ data });
  };

  onFinish = () => {
    const onComplete = this.props.navigation.getParam("onComplete");
    if (onComplete) {
      onComplete();
    } else {
      this.props.navigation.goBack();
    }
  };

  render() {
    console.log(this.props.navigation.getParam("onCompleted"));

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

export default withGlobalContext(PlaidLinkScreen);
