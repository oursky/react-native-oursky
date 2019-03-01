import * as React from "react";
import {
  EmitterSubscription,
  findNodeHandle,
  InteractionManager,
  LayoutChangeEvent,
  Keyboard,
  ScrollView,
  ScrollViewProps,
  TextInput,
  UIManager,
  View,
} from "react-native";

interface FocusableContainer {
  focusableRef: React.RefObject<any>;
}

interface FormRootState {
  context: {
    focusNext: (index: number) => void;
    setFieldInstance: (
      index: number,
      focusable: FocusableContainer | null
    ) => void;
  };

  scrollViewHeight: number;
  scrollViewContentHeight: number;
  containerMinHeight: number;
}

interface FormProps extends ScrollViewProps {
  autoScrollToFocusedInput?: boolean;
}

type FormContext = FormRootState["context"];

interface FormFieldRenderProps {
  focusableRef: React.Ref<any>;
  onSubmitEditing: (e: any) => void;
  blurOnSubmit: false;
}

interface FormFieldProps {
  index: number;
  children: (props: FormFieldRenderProps) => React.ReactNode;
  onSubmitEditing?: (e: any) => void;
}

const defaultFormContextValue = {
  focusNext: () => {},
  setFieldInstance: () => {},
};

export default function createForm() {
  const { Provider, Consumer } = React.createContext<FormContext>(
    defaultFormContextValue
  );

  class Form extends React.Component<FormProps, FormRootState> {
    instanceMap: { [index: number]: FocusableContainer | null };
    scrollViewRef: React.RefObject<ScrollView>;
    subscriptions: EmitterSubscription[];

    private adjustContentOffsetTimeoutToken: any | null;
    private isKeyboardShowing: boolean;

    constructor(props: any) {
      super(props);

      this.state = {
        context: {
          setFieldInstance: this.setFieldInstance,
          focusNext: this.focusNext,
        },
        scrollViewHeight: 0,
        scrollViewContentHeight: 0,
        containerMinHeight: 0,
      };
      this.instanceMap = {};
      this.scrollViewRef = React.createRef<ScrollView>();
      this.subscriptions = [];
      this.adjustContentOffsetTimeoutToken = null;
      this.isKeyboardShowing = false;
    }

    componentDidMount() {
      this.subscriptions = [
        Keyboard.addListener("keyboardDidShow", this.onkeyboardDidShow),
        Keyboard.addListener("keyboardDidHide", this.onkeyboardDidHide),
      ];
    }

    componentWillUnmount() {
      this.clearAdjustContentOffsetTimeout();
      this.subscriptions.forEach(s => {
        s.remove();
      });
      this.subscriptions = [];
    }

    onkeyboardDidShow = () => {
      this.isKeyboardShowing = true;
      this.clearAdjustContentOffsetTimeout();
      this.adjustContentOffsetTimeoutToken = setTimeout(() => {
        this.scrollToFocusedTextInput();
      }, 100);
    };

    onkeyboardDidHide = () => {
      this.isKeyboardShowing = false;
    };

    setFieldInstance = (
      index: number,
      focusable: FocusableContainer | null
    ) => {
      this.instanceMap[index] = focusable;
    };

    focusNext = (index: number) => {
      const indice = Object.keys(this.instanceMap)
        .sort()
        .map(Number)
        .filter(i => i > index);
      const i = indice[0];
      if (i == null) {
        Keyboard.dismiss();
        return;
      }
      const focusableContainer = this.instanceMap[i];
      if (
        focusableContainer != null &&
        focusableContainer.focusableRef != null &&
        focusableContainer.focusableRef.current != null &&
        focusableContainer.focusableRef.current.focus
      ) {
        InteractionManager.runAfterInteractions(() => {
          const afterFocus = focusableContainer.focusableRef.current.focus();
          if (afterFocus != null) {
            if (afterFocus.dismissKeyboard) {
              Keyboard.dismiss();
              return;
            }
          }
          if (this.isKeyboardShowing) {
            InteractionManager.runAfterInteractions(() => {
              this.scrollToFocusedTextInput();
            });
          }
        });
        return;
      }
      Keyboard.dismiss();
    };

    private clearAdjustContentOffsetTimeout() {
      if (this.adjustContentOffsetTimeoutToken != null) {
        clearTimeout(this.adjustContentOffsetTimeoutToken);
        this.adjustContentOffsetTimeoutToken = null;
      }
    }

    private scrollToFocusedTextInput() {
      this.clearAdjustContentOffsetTimeout();
      const currentlyFocusedNodeId = TextInput.State.currentlyFocusedField();
      if (currentlyFocusedNodeId == null) {
        return;
      }
      this.scrollToFocusedField(currentlyFocusedNodeId);
    }

    private scrollToFocusedField(nodeID: number) {
      this.clearAdjustContentOffsetTimeout();

      if (this.scrollViewRef.current == null) {
        return;
      }

      const scrollViewNodeID = findNodeHandle(this.scrollViewRef.current);
      if (scrollViewNodeID == null) {
        return;
      }

      this.clearAdjustContentOffsetTimeout();

      if (!this.props.autoScrollToFocusedInput) {
        return;
      }

      (UIManager as any).viewIsDescendantOf(
        nodeID,
        scrollViewNodeID,
        (isAncestor: boolean) => {
          if (!isAncestor) {
            return;
          }
          UIManager.measureLayout(
            nodeID,
            scrollViewNodeID,
            () => {},
            (_x, y) => {
              const { scrollViewContentHeight, scrollViewHeight } = this.state;
              if (scrollViewContentHeight <= scrollViewHeight) {
                return;
              }
              const maxContentOffsetY =
                this.state.scrollViewContentHeight -
                this.state.scrollViewHeight;
              const desiredContentOffsetY = Math.min(
                y < 100 ? 0 : (y * 2) / 3,
                maxContentOffsetY
              );
              if (this.scrollViewRef.current) {
                this.scrollViewRef.current.scrollTo({
                  x: 0,
                  y: desiredContentOffsetY,
                  animated: true,
                });
              }
            }
          );
        }
      );
    }

    onScrollViewContentSizeChange = (
      contentWidth: number,
      contentHeight: number
    ) => {
      this.setState({
        scrollViewContentHeight: contentHeight,
      });
      if (this.props.onContentSizeChange) {
        this.props.onContentSizeChange(contentWidth, contentHeight);
      }
    };

    onScrollViewLayout = (e: LayoutChangeEvent) => {
      this.setState({
        scrollViewHeight: e.nativeEvent.layout.height,
        containerMinHeight: e.nativeEvent.layout.height,
      });
      if (this.props.onLayout) {
        this.props.onLayout(e);
      }
    };

    render() {
      const { children, ...restProps } = this.props;

      return (
        <Provider value={this.state.context}>
          <ScrollView
            ref={this.scrollViewRef}
            alwaysBounceVertical={false}
            {...restProps}
            onContentSizeChange={this.onScrollViewContentSizeChange}
            onLayout={this.onScrollViewLayout}
          >
            <View style={{ minHeight: this.state.containerMinHeight }}>
              {children}
            </View>
          </ScrollView>
        </Provider>
      );
    }
  }

  class FormField_ extends React.Component<FormFieldProps & FormContext> {
    focusableRef = React.createRef<any>();

    componentDidMount() {
      this.props.setFieldInstance(this.props.index, this);
    }

    componentWillUnmount() {
      this.props.setFieldInstance(this.props.index, null);
    }

    onSubmitEditing = (e: any) => {
      this.props.focusNext(this.props.index);
      if (this.props.onSubmitEditing != null) {
        this.props.onSubmitEditing(e);
      }
    };

    render() {
      return this.props.children({
        focusableRef: this.focusableRef,
        onSubmitEditing: this.onSubmitEditing,
        blurOnSubmit: false,
      });
    }
  }

  function FormField(props: FormFieldProps) {
    return <Consumer>{value => <FormField_ {...props} {...value} />}</Consumer>;
  }

  return {
    Form,
    FormField,
  };
}
