import React from "react";
import { Text } from "react-native";
import type { TextProps } from "react-native/Libraries/Text/TextProps";

export type Props = TextProps;

export default (props: Props) => {
  return <Text allowFontScaling={false} {...props} />;
};
