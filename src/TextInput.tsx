import React from "react";
import {
  View,
  TextInput as NativeTextInput,
  TextInputProps,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from "react-native";
import ExtraText, { Props as ExtraTextProps } from "./ExtraText";

const defaultStyles = StyleSheet.create({
  // reset default padding of android device.
  textInput: {
    padding: 0,
    margin: 0,
  },
});

export type Props = TextInputProps &
  ExtraTextProps & {
    containerStyle?: StyleProp<ViewStyle>;
  };

export default React.forwardRef(function TextInput(
  props: Props,
  ref?: React.Ref<NativeTextInput>
) {
  const {
    style,
    containerStyle,
    error,
    errorStyle,
    option,
    optionStyle,
    ...rest
  } = props;

  const flattedErrorStyle = StyleSheet.flatten(errorStyle);
  const errorColor = flattedErrorStyle && flattedErrorStyle.color;
  return (
    <View style={containerStyle}>
      <NativeTextInput
        {...rest}
        ref={ref}
        style={[
          defaultStyles.textInput,
          style,
          error && errorColor ? { borderBottomColor: errorColor } : null,
        ]}
        underlineColorAndroid="transparent"
      />
      <ExtraText
        error={error}
        errorStyle={errorStyle}
        option={option}
        optionStyle={optionStyle}
      />
    </View>
  );
});
