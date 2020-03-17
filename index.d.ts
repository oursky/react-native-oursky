import * as React from "react";
import {
  ViewProps,
  ViewStyle,
  ScrollViewProps,
  TextInputSubmitEditingEventData,
  NativeSyntheticEvent,
  StyleProp,
} from "react-native";

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
  toolbarStyle?: StyleProp<ViewStyle>;
  itemsStyle?: StyleProp<ViewStyle>;
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
