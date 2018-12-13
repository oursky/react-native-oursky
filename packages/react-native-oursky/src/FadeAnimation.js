// @flow
import * as React from "react";
import { Animated, StyleProp, ViewStyle } from "react-native";

type Props = {
  visible: boolean,

  children: React.ReactNode,
  style?: StyleProp<ViewStyle>,
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

  componentDidUpdate() {
    const { visible } = this.props;
    Animated.timing(this.state.animatedVisibleValue, {
      toValue: visible ? 1 : 0,
      duration: 400,
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
