// @flow
import * as React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";

import Text from "./Text";
import type { Props as ExtraTextProps } from "./ExtraText";
import ExtraText from "./ExtraText";
import { ViewStyle, TextStyle } from "./styles";
import CodeBox from "./CodeBox";
import type { Props as CodeBoxProps } from "./CodeBox";
import TextInput from "./TextInput";

const defaultStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 18,
  },
  header: {
    color: "white",
    fontSize: 32,
    paddingBottom: 30,
  },
  box: {
    borderRadius: 24,
    backgroundColor: "white",
    shadowColor: "rgb(0, 0, 0)",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    elevation: 15,
    paddingHorizontal: 21,
    paddingVertical: 31,
  },
  description: {
    fontSize: 18,
    lineHeight: 24,
    color: "rgb(51, 51, 51)",
    marginBottom: 23,
  },
  codeBoxContainer: {
    flexDirection: "row",
    marginHorizontal: -4.5,
  },
  error: {
    color: "rgb(208, 2, 27)",
    alignSelf: "center",
  },
  resendContainer: {
    marginTop: 33,
  },
  hiddenTextInput: {
    width: 0,
    height: 0,
    opacity: 0,
  },
});

export type Props = ExtraTextProps & {
  headerTitle?: React.Node,
  description?: React.Node,
  resendText?: React.Node,
  resending?: boolean, // show ActivityIndicator if resending

  containerStyle?: ViewStyle,
  headerStyle?: ViewStyle,
  boxStyle?: ViewStyle,
  resendContainerStyle?: ViewStyle,
  resendTextStyle?: TextStyle,

  onEnterCode?: (code: string) => void,
  onPressResend?: () => void,
};

type State = {
  value: string,
};

export default class VerifyOTP extends React.PureComponent<Props, State> {
  textInputRef = React.createRef();

  state = {
    value: "",
  };

  onChangeText = (value: string) => {
    if (/^\d*$/.test(value)) {
      this.setState({ value }, () => {
        if (this.props.onEnterCode) {
          this.props.onEnterCode(value);
        }
      });
    }
  };

  renderCodeBox = () => {
    return (
      <View style={defaultStyles.codeBoxContainer}>
        {Array(4)
          .fill("")
          .map((_, idx) => {
            return <CodeBox value={this.state.value.charAt(idx)} />;
          })}
      </View>
    );
  };

  render() {
    const {
      headerTitle,
      description,
      resendText,
      resending,

      containerStyle,
      headerStyle,
      boxStyle,
      resendContainerStyle,
      resendTextStyle,
      error,
      errorStyle,

      onEnterCode,
      onPressResend,
    } = this.props;

    const { value } = this.state;
    return (
      <View style={[defaultStyles.container, containerStyle]}>
        <Text style={[defaultStyles.header, headerStyle]}>{headerTitle}</Text>
        <View style={[defaultStyles.box, boxStyle]}>
          <Text style={[defaultStyles.description]}>{description}</Text>
          {this.renderCodeBox()}
          <TextInput
            ref={this.textInputRef}
            value={value}
            onChangeText={this.onChangeText}
            autoFocus={true}
            style={defaultStyles.hiddenTextInput}
            keyboardType="numeric"
            maxLength={4}
          />
          <ExtraText
            error={error}
            errorStyle={[defaultStyles.error, errorStyle]}
          />
          <TouchableOpacity
            style={[defaultStyles.resendContainer, resendContainerStyle]}
            onPress={onPressResend}
          >
            <Text style={[resendTextStyle]}>{resendText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
