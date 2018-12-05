// @flow
import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import {
  KeyboardAvoidingView,
  SignupWithMobile,
} from "@oursky/react-native-oursky";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF",
    justifyContent: "center",
  },
});

// TODO: Make a full example.
// Preferably a gallery of different components in their dedicated screens.
type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
        <SignupWithMobile
          description="Sign up with Mobile"
          title="Sign up Now"
          countryPickerProps={{
            placeholder: "Calling Code",
          }}
          mobileNumberProps={{
            placeholder: "National Number",
          }}
          submitButtonText="Submit"
          skipButtonText="Skip"
        />
      </View>
    );
  }
}
