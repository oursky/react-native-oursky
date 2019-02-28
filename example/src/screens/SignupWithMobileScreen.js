// @flow
import * as React from "react";
import { StyleSheet, View, Dimensions, Alert } from "react-native";
import type { LayoutEvent } from "react-native/Libraries/Types/CoreEventTypes";
import {
  KeyboardAvoidingView,
  SignupWithMobile,
  Text,
} from "@oursky/react-native-oursky";
import type { Mobile } from "@oursky/react-native-oursky";
import { NavigationScreenProps } from "react-navigation";

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

type Props = NavigationScreenProps & {};

type State = {
  error: string | React.Node | null,
  loading: boolean,
  marginTop: number,
  countryCallingCode: string,
  nationalNumber: string,
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
    countryCallingCode: "1",
    nationalNumber: "",
  };

  onChangeCountryCode = (code: string) => {
    this.setState({
      countryCallingCode: code,
    });
  };

  onChangeNationalNumber = (number: string) => {
    this.setState({
      nationalNumber: number,
    });
  };

  adjustLayout = (event: LayoutEvent) => {
    const marginTop =
      Dimensions.get("window").height > 568
        ? -event.nativeEvent.layout.height
        : 0;

    this.setState({
      marginTop,
    });
  };

  render() {
    const { countryCallingCode, nationalNumber } = this.state;
    return (
      <KeyboardAvoidingView
        useSafeAreaView={true}
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
            defaultBySimcardCountry: true,
            selectedValue: countryCallingCode,
            onValueChange: this.onChangeCountryCode,
          }}
          mobileNumberProps={{
            placeholder: "Mobile Number",
            placeholderTextColor: "rgb(170, 170, 170)",
            error: this.state.error,
            value: nationalNumber,
            onChangeText: this.onChangeNationalNumber,
          }}
          submitButtonText="Next"
          skipButtonText="Skip for now"
          loading={this.state.loading}
          onPressSubmitButton={(isValid: boolean, mobile: Mobile) => {
            Alert.alert(JSON.stringify(mobile));
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
