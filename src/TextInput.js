// @flow
import * as React from "react";
import { View, TextInput, StyleSheet } from "react-native";

import Text from "./Text";
import { TextStyle } from "./styles";

const defaultStyles = StyleSheet.create({
  // reset default padding of android device.
  textInput: {
    padding: 0,
  },
  extraText: {
    alignSelf: "flex-start",
  },
});

function makeExtraText(
  error?: string | null,
  errorStyle?: TextStyle,
  optionText?: string,
  optionTextStyle?: TextStyle
): Text | null {
  if (error) {
    return <Text style={[defaultStyles.extraText, errorStyle]}>{error}</Text>;
  } else if (optionText) {
    return (
      <Text style={[defaultStyles.extraText, optionTextStyle]}>
        {optionText}
      </Text>
    );
  } else if (error !== undefined) {
    // make sure layout won't unstable, whether error message show or not.
    return <Text style={[defaultStyles.extraText, errorStyle]}>{error}</Text>;
  }
}

export type Props = {
  style?: TextStyle,
  error?: string | null,
  errorStyle?: TextStyle,
  optionText?: string,
  optionTextStyle?: TextStyle,
};

// $FlowFixMe - `React.forwardRef` is not defined in Flow, yet.
export default React.forwardRef((props: Props, ref?) => {
  const {
    error,
    optionText,
    errorStyle,
    optionTextStyle,
    style,
    ...rest
  } = props;

  return (
    <View>
      <TextInput {...rest} ref={ref} style={[defaultStyles.textInput, style]} />
      {makeExtraText(error, errorStyle, optionText, optionTextStyle)}
    </View>
  );
});
