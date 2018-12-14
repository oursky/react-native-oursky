// @flow
import * as React from "react";
import { Animated } from "react-native";
import { ViewStyle } from "./styles";

type Props = {
  visible: boolean,
  children: React.Node,
  duration?: number,
  style?: ViewStyle,
};

type State = {
  animatedVisibleValue: Animated.Value,
};

export default class FadeAnimation extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      animatedVisibleValue: new Animated.Value(0),
    };
  }

  componentDidUpdate(prevProps: Props) {
    const { visible, duration } = this.props;
    if (prevProps.visible == visible) {
      return;
    }
    Animated.timing(this.state.animatedVisibleValue, {
      toValue: visible ? 1 : 0,
      duration: duration || 400,
    }).start();
  }

  render() {
    const { children, style } = this.props;
    return (
      <Animated.View
        style={[
          style,
          {
            opacity: this.state.animatedVisibleValue,
          },
        ]}
      >
        {children}
      </Animated.View>
    );
  }
}
