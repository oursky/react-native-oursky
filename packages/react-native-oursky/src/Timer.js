// @flow
import * as React from "react";

import Text from "./Text";

export type Props = {
  start: number,
  onClockTicking: (time: number) => void,
};

type State = {
  time: number,
};

export default class Timer extends React.Component<Props, State> {
  timerId: IntervalID | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      time: props.start,
    };
  }

  componentDidMount() {
    this.countDown();
  }

  countDown = () => {
    this.setState({ time: this.props.start });
    if (this.timerId) {
      clearInterval(this.timerId);
    }
    this.timerId = setInterval(this.countDownUntilZero, 1000);
  };

  countDownUntilZero = () => {
    this.setState(
      prevState => ({
        time: prevState.time - 1,
      }),
      () => {
        this.props.onClockTicking(this.state.time);
        if (this.state.time === 0 && this.timerId) {
          clearInterval(this.timerId);
          this.timerId = null;
        }
      }
    );
  };

  render() {
    return <Text>{this.state.time}</Text>;
  }
}
