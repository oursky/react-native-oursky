import React from "react";
import {
  Animated,
  BackHandler,
  Easing,
  LayoutChangeEvent,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Portal } from "./Portal";

export interface Props {
  visible: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
  onShow?: () => void;
  onDismiss?: () => void;
}

interface State {
  visible: boolean;
  progress: Animated.Value;
  height: number;
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
});

export default class Modal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      visible: false,
      progress: new Animated.Value(0),
      height: 0,
    };
  }

  componentDidMount() {
    if (this.props.visible) {
      this._show();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.visible && !this.props.visible) {
      this._dismiss();
    }
    if (!prevProps.visible && this.props.visible) {
      this._show();
    }
  }

  onPressAndroidBack = () => {
    this.props.onRequestClose();
  };

  onLayout = (e: LayoutChangeEvent) => {
    this.setState(
      {
        height: e.nativeEvent.layout.height,
      },
      () => {
        if (this.state.visible) {
          Animated.timing(this.state.progress, {
            toValue: 1,
            duration: 280,
            easing: Easing.elastic(0.5),
          }).start(finished => {
            if (finished && this.props.onShow) {
              this.props.onShow();
            }
          });
        }
      }
    );
  };

  onPressBackground = () => {
    this.props.onRequestClose();
  };

  render() {
    const { children } = this.props;
    const { visible, progress, height } = this.state;

    if (!visible) {
      return null;
    }

    return (
      <Portal>
        <View style={styles.container}>
          <TouchableWithoutFeedback onPress={this.onPressBackground}>
            <Animated.View
              style={[
                styles.background,
                {
                  opacity: progress,
                },
              ]}
            />
          </TouchableWithoutFeedback>
          <Animated.View
            style={{
              opacity: height === 0 ? 0 : 1,
              transform: [
                {
                  translateY: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [height, 0],
                  }),
                },
              ],
            }}
            onLayout={this.onLayout}
          >
            {children}
          </Animated.View>
        </View>
      </Portal>
    );
  }

  private _show() {
    BackHandler.addEventListener("hardwareBackPress", this.onPressAndroidBack);
    this.setState({
      visible: true,
      height: 0,
    });
  }

  private _dismiss() {
    BackHandler.removeEventListener(
      "hardwareBackPress",
      this.onPressAndroidBack
    );
    Animated.timing(this.state.progress, {
      toValue: 0,
      duration: 280,
      easing: Easing.elastic(0.5),
    }).start(finished => {
      if (finished) {
        this.setState({ visible: false });
        if (this.props.onDismiss) {
          this.props.onDismiss();
        }
      }
    });
  }
}
