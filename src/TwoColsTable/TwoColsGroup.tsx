import React, { ReactNode } from "react";
import { View, StyleProp, ViewStyle, LayoutChangeEvent } from "react-native";
import { isFormRow } from "./TwoColsRow";

interface Props {
  style?: StyleProp<ViewStyle>;
  alignTitle: boolean;
  children?: ReactNode;
}

interface State {
  maxWidthTitle?: number;
}

export default class TwoColsGroup extends React.PureComponent<Props, State> {
  state: State = {};

  onTitleLayoutChange = (event: LayoutChangeEvent) => {
    if (
      !this.state.maxWidthTitle ||
      event.nativeEvent.layout.width > this.state.maxWidthTitle
    ) {
      const width = event.nativeEvent.layout.width;
      this.setState({
        maxWidthTitle: width,
      });
    }
  };

  render() {
    const { style, children, alignTitle } = this.props;
    return (
      <View style={style}>
        {alignTitle
          ? React.Children.map(children, c => {
              if (isFormRow(c)) {
                return React.cloneElement(c, {
                  onTitleLayoutChange: this.onTitleLayoutChange,
                  titleStyle: [
                    c.props.titleStyle,
                    (this.state.maxWidthTitle && {
                      width: this.state.maxWidthTitle,
                    }) ||
                      undefined,
                  ],
                });
              }
              return c;
            })
          : children}
      </View>
    );
  }
}
