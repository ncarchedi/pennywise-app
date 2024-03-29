import { AppLoading } from "expo";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import React, { useState } from "react";
import { Platform, StatusBar, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppearanceProvider } from "react-native-appearance";

import * as Amplitude from "expo-analytics-amplitude";
import * as Sentry from "sentry-expo";

import AppNavigator from "./navigation/AppNavigator";

import Colors from "./constants/Colors";
import { GlobalContextProvider, GlobalContext } from "./GlobalContext";

import Constants from "expo-constants";

Sentry.init({
  dsn: "https://1e9d77632d084ae3848b322b3dbbbb0d@sentry.io/1797801",
  enableInExpoDevelopment: true,
  debug: true
});

Sentry.setRelease(Constants.manifest.revisionId);

function getActiveRouteName(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index];
  // dive into nested navigators
  if (route.routes) {
    return getActiveRouteName(route);
  }
  return route.routeName;
}

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  if (!isLoadingComplete && !props.skipLoadingScreen) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={() => handleFinishLoading(setLoadingComplete)}
      />
    );
  } else {
    return (
      <View style={styles.container}>
        {Platform.OS === "ios" && <StatusBar barStyle="default" />}
        <AppearanceProvider>
          <GlobalContextProvider>
            <GlobalContext.Consumer>
              {context => {
                return (
                  <AppNavigator
                    onNavigationStateChange={(
                      prevState,
                      currentState,
                      action
                    ) => {
                      const currentRouteName = getActiveRouteName(currentState);
                      const previousRouteName = getActiveRouteName(prevState);

                      if (previousRouteName !== currentRouteName) {
                        Amplitude.logEvent("Navigate_" + currentRouteName);
                      }
                    }}
                  />
                );
              }}
            </GlobalContext.Consumer>
          </GlobalContextProvider>
        </AppearanceProvider>
      </View>
    );
  }
}

async function loadResourcesAsync() {
  await Promise.all([
    Asset.loadAsync([
      require("./assets/images/robot-dev.png"),
      require("./assets/images/robot-prod.png")
    ]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Ionicons.font
      // We include SpaceMono because we use it in HomeScreen.js. Feel free to
      // remove this if you are not using it in your app
      // 'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf')
    })
  ]);
}

function handleLoadingError(error: Error) {
  // In this case, you might want to report the error to your error reporting
  // service, for example Sentry
  console.warn(error);
}

function handleFinishLoading(setLoadingComplete) {
  setLoadingComplete(true);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  }
});
