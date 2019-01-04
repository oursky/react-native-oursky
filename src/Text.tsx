import React from "react";
import { Text as RNText, TextProps } from "react-native";

export default React.forwardRef(function Text(
  props: TextProps,
  ref?: React.Ref<RNText>
) {
  return <RNText allowFontScaling={false} {...props} ref={ref} />;
});
