// @flow
import React from "react";
import { Keyboard } from "react-native";
import type { Node } from "react";

type RenderProps = {
  ref: any,
  onSubmitEditing: (e: any) => void,
  blurOnSubmit: false,
};

type Props = {
  tabIndex: number,
  children: (props: RenderProps) => Node,
  onSubmitEditing?: (e: any) => void,
};

type Focusable = {
  textInputRef: any,
};

type ControlRootProps = {
  children: Node,
};

type ControlRootState = {
  focusNext: (tabIndex: number) => void,
  setInstance: (tabIndex: number, focusable: Focusable | null) => void,
};

type ContextValue = ControlRootState;

type ControlProps = ContextValue & {
  tabIndex: number,
  children: (props: RenderProps) => Node,
  onSubmitEditing?: (e: any) => void,
};

const defaultContextValue: ContextValue = {
  focusNext: () => {},
  setInstance: () => {},
};

export default function createControlGroup() {
  const { Provider, Consumer } = React.createContext(defaultContextValue);

  class Control_ extends React.Component<ControlProps> {
    textInputRef: any;

    constructor(props: ControlProps) {
      super(props);
      this.textInputRef = React.createRef();
    }
    componentDidMount() {
      this.props.setInstance(this.props.tabIndex, this);
    }
    componentWillUnmount() {
      this.props.setInstance(this.props.tabIndex, null);
    }
    onSubmitEditing = (e: any) => {
      this.props.focusNext(this.props.tabIndex);
      if (this.props.onSubmitEditing != null) {
        this.props.onSubmitEditing(e);
      }
    };
    render() {
      const { children } = this.props;
      return children({
        ref: this.textInputRef,
        onSubmitEditing: this.onSubmitEditing,
        blurOnSubmit: false,
      });
    }
  }

  class ControlRoot extends React.Component<
    ControlRootProps,
    ControlRootState
  > {
    instanceMap: any;

    constructor(props: ControlRootProps) {
      super(props);
      this.state = {
        setInstance: this.setInstance,
        focusNext: this.focusNext,
      };
      this.instanceMap = {};
    }

    setInstance = (tabIndex: number, focusable: Focusable | null) => {
      this.instanceMap[tabIndex] = focusable;
    };

    focusNext = (tabIndex: number) => {
      const { instanceMap } = this;
      const indice = Object.keys(instanceMap)
        .sort()
        .map(Number);
      for (const i of indice) {
        if (i > tabIndex) {
          const instance = instanceMap[i];
          if (
            instance != null &&
            instance.textInputRef != null &&
            instance.textInputRef.current != null
          ) {
            instance.textInputRef.current.focus();
            return;
          }
        }
      }
      Keyboard.dismiss();
    };

    render() {
      const { children } = this.props;
      return <Provider value={this.state}>{children}</Provider>;
    }
  }

  function Control(props: Props) {
    return (
      <Consumer>
        {context => {
          const { setInstance, focusNext } = context;
          return (
            <Control_
              {...props}
              setInstance={setInstance}
              focusNext={focusNext}
            />
          );
        }}
      </Consumer>
    );
  }

  return {
    ControlRoot,
    Control,
  };
}
