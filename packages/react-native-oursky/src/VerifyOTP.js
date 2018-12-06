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
import Timer from "./Timer";

const defaultStyles = StyleSheet.create({
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
    color: "rgb(238, 0, 0)",
    alignSelf: "center",
    marginTop: 12,
  },
  resendContainer: {
    marginTop: 33,
    alignItems: "center",
  },
  resendText: {
    fontSize: 13,
    color: "rgb(170, 170, 170)",
  },
  hiddenTextInput: {
    width: 0,
    height: 0,
    opacity: 0,
  },
});

export type Props = ExtraTextProps & {
  description: React.Node,
  resendText: React.Node,
  resending?: boolean, // disabled resend button
  timerStartFrom: number,

  style?: ViewStyle,
  descriptionStyle?: TextStyle,
  codeBoxStyle?: ViewStyle,
  codeBoxTextStyle?: TextStyle,
  resendContainerStyle?: ViewStyle,
  resendTextStyle?: TextStyle,

  onEnterCode?: (code: string, clearCode: () => void) => void,
  onPressResend?: (restartTimer: () => void) => void,
};

type State = {
  value: string,
};

type TextInputRefProps = {
  textInputRef: React$Ref<TextInput>,
};

class VerifyOTP extends React.PureComponent<Props & TextInputRefProps, State> {
  timer = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      value: "",
    };
  }

  clearCode = () => {
    this.setState({ value: "" });
  };

  onChangeText = (value: string) => {
    if (/^\d*$/.test(value)) {
      this.setState({ value }, () => {
        if (this.props.onEnterCode) {
          this.props.onEnterCode(value, this.clearCode);
        }
      });
    }
  };

  onPressResend = () => {
    if (this.props.onPressResend) {
      this.props.onPressResend(() => {
        if (this.timer.current) {
          this.timer.current.countDown();
        }
      });
    }
  };

  renderCodeBox = () => {
    const { codeBoxStyle, codeBoxTextStyle } = this.props;
    return (
      <View style={defaultStyles.codeBoxContainer}>
        {Array(4)
          .fill("")
          .map((_, idx) => {
            return (
              <CodeBox
                key={idx}
                style={codeBoxStyle}
                textStyle={codeBoxTextStyle}
                value={this.state.value.charAt(idx)}
                isError={!!this.props.error}
              />
            );
          })}
      </View>
    );
  };

  render() {
    const {
      description,
      resendText,
      resending,
      error,
      timerStartFrom,

      style,
      descriptionStyle,
      resendContainerStyle,
      resendTextStyle,
      errorStyle,

      onEnterCode,

      textInputRef,
    } = this.props;

    const { value } = this.state;
    return (
      <View style={[defaultStyles.box, style]}>
        <Text style={[defaultStyles.description, descriptionStyle]}>
          {description}
        </Text>
        {this.renderCodeBox()}
        <TextInput
          ref={textInputRef}
          value={value}
          onChangeText={this.onChangeText}
          autoFocus={true}
          style={defaultStyles.hiddenTextInput}
          keyboardType="numeric"
          maxLength={4}
        />
        <TouchableOpacity
          disabled={resending}
          style={[defaultStyles.resendContainer, resendContainerStyle]}
          onPress={this.onPressResend}
        >
          <Text style={[defaultStyles.resendText, resendTextStyle]}>
            {resendText}
            (
            <Timer
              ref={this.timer}
              start={timerStartFrom}
              onClockTicking={() => {}}
            />
            s)
          </Text>
        </TouchableOpacity>
        <ExtraText
          error={error}
          errorStyle={[defaultStyles.error, errorStyle]}
        />
      </View>
    );
  }
}

// $FlowFixMe
export default React.forwardRef((props: Props, ref?: React$Ref<TextInput>) => (
  <VerifyOTP {...props} textInputRef={ref} />
));