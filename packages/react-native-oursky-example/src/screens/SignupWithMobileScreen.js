// @flow
import React from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import {
  KeyboardAvoidingView,
  SignupWithMobile,
  Text,
} from "@oursky/react-native-oursky";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(94, 99, 180)",
    paddingHorizontal: 18,
    justifyContent: "center",
  },
  header: {
    color: "white",
    fontSize: 32,
    paddingBottom: 30,
  },
});

type Props = {};

type State = {
  error: string | React.Node | null,
  loading: boolean,
  marginTop: number,
};

export default class SignupWithMobileScreen extends React.PureComponent<
  Props,
  State
> {
  static navigationOptions = {
    headerTransparent: true,
  };

  state = {
    error: null,
    loading: false,
    marginTop: 0,
  };

  adjustLayout = (event: LayoutChangeEvent) => {
    const marginTop =
      Dimensions.get("window").height > 568
        ? -event.nativeEvent.layout.height
        : 0;

    this.setState({
      marginTop,
    });
  };

  render() {
    return (
      <KeyboardAvoidingView
        style={[styles.container, { marginTop: this.state.marginTop }]}
      >
        <Text style={styles.header} onLayout={this.adjustLayout}>
          Get Started
        </Text>
        <SignupWithMobile
          description="Enter your mobile number below in order to create a new account / login to exisitng account"
          title="Your mobile no."
          countryPickerProps={{
            placeholder: "Country",
            placeholderTextColor: "rgb(170, 170, 170)",
            error: this.state.error,
            headerTitle: "Select Country",
            backButtonText: "Back",
          }}
          mobileNumberProps={{
            placeholder: "Mobile Number",
            placeholderTextColor: "rgb(170, 170, 170)",
            error: this.state.error,
          }}
          submitButtonText="Next"
          skipButtonText="Skip for now"
          loading={this.state.loading}
          onPressSubmitButton={(isValid: boolean, mobile: Mobile) => {
            this.props.navigation.navigate("VerifyOTP");
          }}
          onPressSkipButton={() => {
            this.setState({
              error: null,
            });
          }}
        />
      </KeyboardAvoidingView>
    );
  }
}
