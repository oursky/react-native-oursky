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
interface ExtraTextProps {
  error?: React.ReactNode | null;
  errorStyle?: StyleProp<TextStyle>;
  option?: React.ReactNode;
  optionStyle?: StyleProp<TextStyle>;
}
export interface TextInputProps extends NativeTextInputProps, ExtraTextProps {
  containerStyle?: StyleProp<ViewStyle>;
}
export function TextInput(
  props: TextInputProps
): React.Component<TextInputProps>;
export interface Country {
  isoCountryCode: string;
  callingCode: string;
  flag: string;
  name: string;
}
export interface CountryPickerProps extends ExtraTextProps {
  placeholder?: string;
  placeholderTextColor?: string;
  selectedValue?: string;
  backButtonText?: React.ReactNode;
  headerTitle?: React.ReactNode;

  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;

  onValueChange?: (countryCallingCode: string) => void;
  openAlternativeCountryList?: (
    countryCodes: Country[],
    onSelectCountry: (country: Country) => void
  ) => void;
  onClosePicker?: () => void;
}
export class CountryPicker extends React.Component<CountryPickerProps> {}
export interface Mobile {
  countryCallingCode: string;
  nationalNumber: string;
}
export interface SignupWithMobileProps {
  textInputRef?: React.Ref<NativeTextInput>;

  style?: StyleProp<ViewStyle>;

  description?: React.ReactNode;
  descriptionStyle?: StyleProp<TextStyle>;
  title?: React.ReactNode;
  titleStyle?: StyleProp<TextStyle>;

  countryPickerProps?: CountryPickerProps;
  mobileNumberProps?: TextInputProps;

  submitButtonStyle?: StyleProp<ViewStyle>;
  submitButtonText?: React.ReactNode;
  submitButtonTextStyle?: StyleProp<TextStyle>;

  skipButtonStyle?: StyleProp<ViewStyle>;
  skipButtonText?: React.ReactNode;
  skipButtonTextStyle?: StyleProp<TextStyle>;

  loading?: boolean;

  onPressSubmitButton?: (isValid: boolean, mobile: Mobile) => void;
  onPressSkipButton?: () => void;
}
export class SignupWithMobile extends React.Component<SignupWithMobileProps> {}
export interface VerifyOTPProps extends ExtraTextProps {
  description: React.ReactNode;
  resendText: React.ReactNode;
  resending: boolean;
  countDownFrom: number;

  style?: StyleProp<ViewStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
  codeBoxStyle?: StyleProp<ViewStyle>;
  codeBoxTextStyle?: StyleProp<TextStyle>;
  resendContainerStyle?: StyleProp<ViewStyle>;
  resendTextStyle?: StyleProp<TextStyle>;

  onEnterCode?: (code: string, clearCode: () => void) => void;
  onPressResend?: (restartTimer: () => void) => void;
}
export class VerifyOTP extends React.Component<VerifyOTPProps> {
  focus: () => void;
}
