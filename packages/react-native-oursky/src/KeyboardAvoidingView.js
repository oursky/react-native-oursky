// @flow
import React from "react";
import { View, Platform, Keyboard } from "react-native";
import type { ViewProps } from "react-native/Libraries/Components/View/ViewPropTypes";
import type EmitterSubscription from "react-native/Libraries/vendor/emitter/EmitterSubscription";

export type Props = {
  ...ViewProps,
  behavior: "margin",
  androidSoftInputMode: "adjustResize",
};

type State = {
  keyboardHeight: number,
};

export type AndroidKeyboardDidHideEvent = null | typeof undefined;

export type AndroidKeyboardDidShowEvent = {
  endCoordinates: {
    screenX: number,
    screenY: number,
    width: number,
    height: number,
  },
};

export type IOSKeyboardEvent = {
  startCoordinates: {
    screenX: number,
    screenY: number,
    width: number,
    height: number,
  },
  endCoordinates: {
    screenX: number,
    screenY: number,
    width: number,
    height: number,
  },
  duration: number,
  easing: "easeIn" | "easeInEaseOut" | "easeOut" | "linear" | "keyboard",
};

export type KeyboardEvent =
  | AndroidKeyboardDidHideEvent
  | AndroidKeyboardDidShowEvent
  | IOSKeyboardEvent;

export default class KeyboardAvoidingView extends React.PureComponent<
  Props,
  State
> {
  static defaultProps = {
    behavior: "margin",
    androidSoftInputMode: "adjustResize",
  };

  subscriptions: EmitterSubscription[];

  constructor(props: Props) {
    super(props);
    this.subscriptions = [];
    this.state = {
      keyboardHeight: 0,
    };
  }

  componentDidMount() {
    if (Platform.OS === "ios") {
      this.subscriptions = [
        Keyboard.addListener("keyboardWillHide", this.onKeyboardHide),
        Keyboard.addListener("keyboardWillShow", this.onKeyboardShow),
      ];
    }
    if (Platform.OS === "android") {
      this.subscriptions = [
        Keyboard.addListener("keyboardDidHide", this.onKeyboardHide),
        Keyboard.addListener("keyboardDidShow", this.onKeyboardShow),
      ];
    }
  }

  componentWillUnmount() {
    for (const sub of this.subscriptions) {
      sub.remove();
    }
    this.subscriptions = [];
  }

  onKeyboardShow = (e: KeyboardEvent) => {
    if (e != null && e.endCoordinates != null) {
      this.setState({
        keyboardHeight: e.endCoordinates.height,
      });
    }
  };

  onKeyboardHide = () => {
    this.setState({
      keyboardHeight: 0,
    });
  };

  render() {
    const { style, androidSoftInputMode, behavior, ...rest } = this.props;
    const { keyboardHeight } = this.state;
    let marginBottom = 0;
    if (
      Platform.OS === "ios" ||
      (Platform.OS === "android" && androidSoftInputMode !== "adjustResize")
    ) {
      marginBottom = keyboardHeight;
    }
    return <View {...rest} style={[style, { marginBottom }]} />;
  }
}
