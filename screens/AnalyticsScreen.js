import React from "react";
import { ScrollView, StyleSheet, Text, View, Button } from "react-native";

import { withGlobalContext } from "../GlobalContext";

import PlaidAuthenticator from 'react-native-plaid-link';

class AnalyticsScreen extends React.Component {
  static navigationOptions = {
    title: "Analytics"
  };

  state = {
    isReady: false
  }

  render() {
    // return (
    //   <View style={styles.container}>
    //     <ScrollView
    //       style={styles.container}
    //       contentContainerStyle={styles.contentContainer}
    //     >
    //       <View style={styles.analyticsContainer}>
    //         <Text style={styles.analyticsText}>
    //           This will show some spending analytics.
    //         </Text>
    //       </View>
    //     </ScrollView>
    //   </View>
    // );

    if(!this.state.isReady) {
      return <PlaidAuthenticator
        onMessage={this.onMessage}
        publicKey="aef79d0fac8493ad10a8760b0c01a6"
        env="sandbox"
        product="transactions"
        clientName="Conscious Spending Client"
        selectAccount={false}
      />
    } else {
      return (
        <View style={styles.container}>
          <Text>
            Ready! Public token: {this.state.metadata.public_token}
          </Text>
          <Button
            onPress={this.cleanState}
            title="Clean State"
            color="#841584"
            accessibilityLabel="Learn more about this purple button"
          />
        </View>
      )
    }
  }

  onMessage = (data) => {
    if(data.action.includes('connected')) {
      this.props.global.getAccessTokenFromPublicToken(data.metadata.public_token)
      this.setState({...data, isReady: true})
    } else (
      this.setState({data})
    )
  }

  cleanState = () => {
    this.setState({isReady: false})
  }
}

export default withGlobalContext(AnalyticsScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  contentContainer: {
    paddingTop: 30,
    paddingHorizontal: 20
  },
  analyticsContainer: {
    alignItems: "center"
  },
  analyticsText: {
    fontSize: 17,
    color: "rgba(96, 100, 109, 1)",
    lineHeight: 24
  }
});
