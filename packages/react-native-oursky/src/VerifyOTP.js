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
  countDownFrom: number,
  resending?: boolean, // disabled resend button

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
  countDownSecond: number,
};

export default class VerifyOTP extends React.PureComponent<Props, State> {
  textInputRef = React.createRef<TextInput>();

  constructor(props: Props) {
    super(props);
    this.state = {
      value: "",
      countDownSecond: props.countDownFrom,
    };
  }

  timerId: IntervalID | null = null;

  componentDidMount() {
    this.countDown();
  }

  componentWillUnmount() {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  countDown = () => {
    this.setState({ countDownSecond: this.props.countDownFrom });
    if (this.timerId) {
      clearInterval(this.timerId);
    }
    this.timerId = setInterval(this.countDownUntilZero, 1000);
  };

  countDownUntilZero = () => {
    this.setState(
      prevState => ({
        countDownSecond: prevState.countDownSecond - 1,
      }),
      () => {
        if (this.state.countDownSecond === 0 && this.timerId) {
          clearInterval(this.timerId);
          this.timerId = null;
        }
      }
    );
  };

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
      this.props.onPressResend(this.countDown);
    }
  };

  focus = () => {
    if (this.textInputRef.current) {
      this.textInputRef.current.focus();
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
                onPress={this.focus}
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

      style,
      descriptionStyle,
      resendContainerStyle,
      resendTextStyle,
      errorStyle,

      onEnterCode,
    } = this.props;

    const { value, countDownSecond } = this.state;
    return (
      <View style={[defaultStyles.box, style]}>
        <Text style={[defaultStyles.description, descriptionStyle]}>
          {description}
        </Text>
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
        <TouchableOpacity
          disabled={resending || countDownSecond !== 0}
          style={[defaultStyles.resendContainer, resendContainerStyle]}
          onPress={this.onPressResend}
        >
          <Text style={[defaultStyles.resendText, resendTextStyle]}>
            {resendText} {countDownSecond ? `(${countDownSecond}s)` : null}
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
