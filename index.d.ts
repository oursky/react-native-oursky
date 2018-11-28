import * as React from "react";
import {
  ViewProps,
  TextInputProps as NativeTextInputProps,
  TextInput as NativeTextInput,
  TextProps as NativeTextProps,
  Text as NativeText,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";

export function createControlGroup(): {
  ControlRoot: React.ComponentClass<{
    children: React.ReactNode;
  }>;
  Control: React.ComponentClass<{
    tabIndex: number;
    children: (
      props: {
        ref: React.RefObject<NativeTextInput>;
        onSubmitEditing: NativeTextInputProps["onSubmitEditing"];
        blurOnSubmit: false;
      }
    ) => React.ReactNode;
  }>;
};

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

export interface KeyboardAvoidingViewProps extends ViewProps {
  behavior?: "margin";
  androidSoftInputMode?: "adjustResize";
}
export class KeyboardAvoidingView extends React.Component<
  KeyboardAvoidingViewProps
> {}
export interface TextProps extends NativeTextProps {}
export function Text(props: NativeTextProps): NativeText;
export interface TextInputProps extends NativeTextInputProps {
  error?: string | null;
  errorStyle?: StyleProp<TextStyle>;
  optionText?: string;
  optionTextStyle?: StyleProp<TextStyle>;
}
export function TextInput(
  props: TextInputProps
): React.Component<TextInputProps>;



