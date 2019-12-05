import React from "react";
import { Alert } from "react-native";
import PlaidAuthenticator from "react-native-plaid-link";

import LoadingIndicator from "../components/LoadingIndicator";
import { withGlobalContext } from "../GlobalContext";

import * as Sentry from "sentry-expo";

class PlaidLinkScreen extends React.Component {
  state = {
    data: {},
    refreshing: false
  };

  onMessage = async data => {
    const { getAccessTokenFromPublicToken } = this.props.global;

    if (data.action.includes("connected")) {
      this.setState({ refreshing: true });

      try {
        await getAccessTokenFromPublicToken(data.metadata.public_token);
      } catch (error) {
        console.log(error);
        Sentry.captureException(error);
        Alert.alert("Error Connecting Account", error, {
          cancelable: false
        });
      }
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

    this.setState({ refreshing: false });
  };

  render() {
    if (this.state.refreshing) return <LoadingIndicator />;

    return (
      <PlaidAuthenticator
        onMessage={data => this.onMessage(data)}
        publicKey="aef79d0fac8493ad10a8760b0c01a6"
        env={this.props.global.getEnvironment()}
        product="transactions"
        clientName="Pennywise"
        selectAccount={false}
      />
    );
  }
}

export default withGlobalContext(PlaidLinkScreen);
