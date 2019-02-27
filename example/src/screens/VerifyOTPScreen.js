// @flow
import * as React from "react";
import { StyleSheet, Dimensions, View } from "react-native";
import type { LayoutEvent } from "react-native/Libraries/Types/CoreEventTypes";
import {
  Text,
  VerifyOTP,
  KeyboardAvoidingView,
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
  error: React.Node | string,
  marginTop: number,
};

export default class VerifyOTPScreen extends React.PureComponent<Props, State> {
  state = {
    error: null,
    marginTop: 0,
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
    return (
      <KeyboardAvoidingView
        useSafeAreaView={true}
        style={[styles.container, { marginTop: this.state.marginTop }]}
      >
        <Text style={styles.header} onLayout={this.adjustLayout}>
          Get Started
        </Text>
        <VerifyOTP
          description="We have sent you a 4 digit code to +852 9124 2442, please enter the code below"
          resendText="Didn't receive any code? Request resend"
          error={this.state.error}
          countDownFrom={5}
          onEnterCode={(code: string, clearCode: () => void) => {
            if (code !== "8964" && code.length === 4) {
              this.setState({
                error: "The input code is not valid, please try again",
              });
              clearCode();
            } else {
              this.setState({
                error: null,
              });
            }
          }}
          onPressResend={(restartTimer: () => void) => {
            restartTimer();
          }}
        />
      </KeyboardAvoidingView>
    );
  }
}
