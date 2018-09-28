declare module "react-native-oursky" {
  import * as React from "react";
  import { TextInputProps, TextInput } from "react-native";

  export function createControlGroup(): {
    ControlRoot: React.ComponentClass<{
      children: React.ReactNode;
    }>;
    Control: React.ComponentClass<{
      tabIndex: number;
      children: (
        props: {
          ref: React.RefObject<TextInput>;
          onSubmitEditing: TextInputProps["onSubmitEditing"];
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

  export interface KeyboardAvoidingViewProps {
    behavior?: "margin";
    androidSoftInputMode?: "adjustResize";
  }
  export class KeyboardAvoidingView extends React.Component<
    KeyboardAvoidingViewProps
  > {}
}
