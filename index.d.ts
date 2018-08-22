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
}
