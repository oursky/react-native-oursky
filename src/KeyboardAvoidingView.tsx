import React from "react";
import {
  View,
  Platform,
  Keyboard,
  ViewProps,
  EmitterSubscription,
} from "react-native";

import { SafeAreaView } from "react-navigation";

export type Props = ViewProps & {
  useSafeAreaView: boolean;
  behavior: "margin";
  androidSoftInputMode: "adjustResize";
};

interface State {
  keyboardHeight: number;
}

export type AndroidKeyboardDidHideEvent = null | undefined;

export interface AndroidKeyboardDidShowEvent {
  endCoordinates: {
    screenX: number;
    screenY: number;
    width: number;
    height: number;
  };
}

export interface IOSKeyboardEvent {
  startCoordinates: {
    screenX: number;
    screenY: number;
    width: number;
    height: number;
  };
  endCoordinates: {
    screenX: number;
    screenY: number;
    width: number;
    height: number;
  };
  duration: number;
  easing: "easeIn" | "easeInEaseOut" | "easeOut" | "linear" | "keyboard";
}

export type KeyboardEvent =
  | AndroidKeyboardDidHideEvent
  | AndroidKeyboardDidShowEvent
  | IOSKeyboardEvent;

export default class KeyboardAvoidingView extends React.PureComponent<
  Props,
  State
> {
  static defaultProps = {
    useSafeAreaView: false,
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
    const {
      style,
      androidSoftInputMode,
      behavior,
      useSafeAreaView,
      ...rest
    } = this.props;
    const { keyboardHeight } = this.state;
    const isShowingKeyboard = this.state.keyboardHeight > 0;
    let marginBottom = 0;
    if (
      Platform.OS === "ios" ||
      (Platform.OS === "android" && androidSoftInputMode !== "adjustResize")
    ) {
      marginBottom = keyboardHeight;
    }

    if (useSafeAreaView) {
      return (
        <SafeAreaView
          {...rest}
          style={[this.props.style, { marginBottom }]}
          forceInset={{
            bottom: isShowingKeyboard ? "never" : "always",
          }}
        />
      );
    }

    return <View {...rest} style={[style, { marginBottom }]} />;
  }
}
