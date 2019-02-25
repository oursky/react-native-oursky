import React from "react";
import { Animated, StyleProp, ViewStyle } from "react-native";

interface Props {
  visible: boolean;
  children: React.ReactNode;
  duration: number;
  style?: StyleProp<ViewStyle>;
  onFinishedAnimate?: () => void;
}

interface State {
  animatedVisibleValue: Animated.Value;
}

export default class FadeAnimation extends React.PureComponent<Props, State> {
  static defaultProps = {
    duration: 400,
  };

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
      duration: duration,
    }).start(() => {
      if (this.props.onFinishedAnimate != null) {
        this.props.onFinishedAnimate();
      }
    });
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
