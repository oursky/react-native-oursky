// @flow
import * as React from "react";
import { View, TextInput, StyleSheet } from "react-native";

import Text from "./Text";
import { TextStyle, ViewStyle } from "./styles";

const defaultStyles = StyleSheet.create({
  // reset default padding of android device.
  textInput: {
    padding: 0,
  },
  extraText: {
    alignSelf: "flex-start",
  },
  nonvisible: {
    opacity: 0,
  },
});

function makeExtraText(
  error?: string | null,
  errorStyle?: TextStyle,
  option?: string,
  optionStyle?: TextStyle
): Text | null {
  if (error) {
    return <Text style={[defaultStyles.extraText, errorStyle]}>{error}</Text>;
  } else if (option) {
    return <Text style={[defaultStyles.extraText, optionStyle]}>{option}</Text>;
  } else if (error !== undefined) {
    // make sure layout won't unstable, whether error message show or not.
    return (
      <Text
        style={[defaultStyles.extraText, errorStyle, defaultStyles.nonvisible]}
      >
        nonvisible
      </Text>
    );
  }
}

export type Props = {
  style?: TextStyle,
  error?: string | null,
  errorStyle?: TextStyle,
  option?: string,
  optionStyle?: TextStyle,
  containerStyle?: ViewStyle,
};

// $FlowFixMe - `React.forwardRef` is not defined in Flow, yet.
export default React.forwardRef((props: Props, ref?) => {
  const {
    error,
    option,
    errorStyle,
    optionStyle,
    style,
    containerStyle,
    ...rest
  } = props;

  return (
    <View style={containerStyle}>
      <TextInput {...rest} ref={ref} style={[defaultStyles.textInput, style]} />
      {makeExtraText(error, errorStyle, option, optionStyle)}
    </View>
  );
});
