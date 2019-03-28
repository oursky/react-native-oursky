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
  ImageSourcePropType,
  ScrollViewProps,
  TextInputSubmitEditingEventData,
  NativeSyntheticEvent,
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
  useSafeAreaView?: boolean;
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
  defaultBySimcardCountry: boolean;
  ListEmptyComponent?: React.Component;

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
export function SignupWithMobile(props: SignupWithMobileProps): JSX.Element;
export interface VerifyOTPProps extends ExtraTextProps {
  description: React.ReactNode;
  resendText: React.ReactNode;
  resending: boolean;
  countDownFrom: number;

  autoFocus?: boolean;

  style?: StyleProp<ViewStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
  codeBoxStyle?: StyleProp<ViewStyle>;
  codeBoxTextStyle?: StyleProp<TextStyle>;
  resendContainerStyle?: StyleProp<ViewStyle>;
  resendTextStyle?: StyleProp<TextStyle>;

  onEnterCode?: (code: string, clearCode: () => void) => void;
  onPressResend?: (restartTimer: () => void) => void;
  onCountDown?: (remainingSeconds: number) => void;
}
export class VerifyOTP extends React.Component<VerifyOTPProps> {
  focus: () => void;
}

interface DialogLayoutProps {
  title: React.ReactNode;
  description: React.ReactNode;
  submitText: React.ReactNode;
  cancelText: React.ReactNode;

  backgroundStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
  submitButtonStyle?: StyleProp<ViewStyle>;
  submitTextStyle?: StyleProp<TextStyle>;
  cancelButtonStyle?: StyleProp<ViewStyle>;
  cancelTextStyle?: StyleProp<TextStyle>;
}
export interface DialogProps extends DialogLayoutProps {
  visible: boolean;

  onSubmit: () => void;
  onCancel: () => void;
}
export class Dialog extends React.Component<DialogProps> {}

type AndroidPermission =
  | "photo"
  | "location"
  | "camera"
  | "microphone"
  | "contacts"
  | "event"
  | "storage"
  | "callPhone"
  | "readSms"
  | "receiveSms";

type IOSPermission =
  | "notification"
  | "photo"
  | "location"
  | "camera"
  | "microphone"
  | "contacts"
  | "event"
  | "bluetooth"
  | "reminder"
  | "backgroundRefresh"
  | "speechRecognition"
  | "mediaLibrary"
  | "motion";

export interface RequirePermissionProps {
  permission: AndroidPermission & IOSPermission;

  undeterminedDialogProps: DialogLayoutProps;
  deniedDialogProps: DialogLayoutProps;

  onAccept: () => void;
  onReject: () => void;
}
export class RequirePermission extends React.Component<
  RequirePermissionProps
> {}

export interface NetworkFailureToastProps {
  style?: StyleProp<ViewStyle>;
  errorText?: React.ReactNode;
  textStyle?: StyleProp<TextStyle>;
  imageIcon?: ImageSourcePropType;
  iconStyle?: StyleProp<ViewStyle>;
  animationDuration?: number;
}
export class NetworkFailureToast extends React.Component<
  NetworkFailureToastProps
> {}

export interface FadeAnimationProps {
  visible: boolean;
  children: React.ReactNode;
  duration?: number;
  style?: StyleProp<ViewStyle>;
}
export class FadeAnimation extends React.Component<FadeAnimationProps> {}

export class PortalHost extends React.Component {}
export class Portal extends React.Component {}

export interface ModalProps {
  visible: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
  onShow?: () => void;
  onDismiss?: () => void;
}

export class Modal extends React.Component<ModalProps> {}

export interface PickerItem {
  value: string;
  label: string;
}

export interface PickerProps {
  visible: boolean;
  value: string;
  items: PickerItem[];
  onDismiss: (value: string) => void;
  onDone: (value: string) => void;
  onCancel: (value: string) => void;
  doneButtonLabel?: string;
  cancelButtonLabel?: string | null;
  ToolbarComponent?: React.ReactType<{}>;
}

export class Picker extends React.Component<PickerProps> {}

interface FormProps extends ScrollViewProps {
  autoScrollToFocusedInput?: boolean;
  scrollToInputThresholds?: number;
  getScrollToTextInputOffset?: (
    data: {
      inputY: number;
      scrollViewContentHeight: number;
      scrollViewHeight: number;
    }
  ) => number;
}
declare class Form extends React.Component<FormProps> {}

interface FormFieldRenderProps {
  focusableRef: React.Ref<any>;
  onSubmitEditing: (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => void;
  blurOnSubmit: false;
}

interface FormFieldProps {
  index: number;
  children: (props: FormFieldRenderProps) => React.ReactNode;
  onSubmitEditing?: (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => void;
}

declare class FormField extends React.Component<FormFieldProps> {}

export function createForm(): {
  Form: typeof Form;
  FormField: typeof FormField;
};
