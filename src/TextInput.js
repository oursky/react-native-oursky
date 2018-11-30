// @flow
import * as React from "react";
import { View, TextInput as NativeTextInput, StyleSheet } from "react-native";

import Text from "./Text";
import withExtraText from "./withExtraText";
import { TextStyle, ViewStyle } from "./styles";

const defaultStyles = StyleSheet.create({
  // reset default padding of android device.
  textInput: {
    padding: 0,
    margin: 0,
  },
});

export type Props = {
  style?: TextStyle,
};

function TextInput(props: Props, ref?) {
  const { style, ...rest } = props;

  return (
    <NativeTextInput
      {...rest}
      ref={ref}
      style={[defaultStyles.textInput, style]}
      underlineColorAndroid="transparent"
    />
  );
}

// $FlowFixMe
export default withExtraText<Props>(React.forwardRef(TextInput));
