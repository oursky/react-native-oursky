import * as React from "react";
import {
  EmitterSubscription,
  findNodeHandle,
  InteractionManager,
  LayoutChangeEvent,
  Keyboard,
  NativeSyntheticEvent,
  ScrollView,
  ScrollViewProps,
  TextInput,
  UIManager,
  View,
  TextInputSubmitEditingEventData,
} from "react-native";

interface FocusableContainer {
  focusableRef: React.RefObject<any>;
}

interface FormContext {
  focusNext: (index: number) => void;
  setFieldInstance: (
    index: number,
    focusable: FocusableContainer | null
  ) => void;
}

interface FormRootState {
  context: FormContext;

  scrollViewHeight: number;
  scrollViewContentHeight: number;
}

interface FormProps extends ScrollViewProps {
  autoScrollToFocusedInput?: boolean;
  scrollToInputThresholds: number;
  getScrollToTextInputOffset?: (
    data: {
      inputY: number;
      scrollViewContentHeight: number;
      scrollViewHeight: number;
    }
  ) => number;
}

interface FormFieldRenderProps {
  focusableRef: React.Ref<any>;
  onSubmitEditing: (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => void;
  blurOnSubmit: false;
}

interface FormFieldProps {
  index: number;
  children: (props: FormFieldRenderProps) => React.ReactNode;
  onSubmitEditing?: (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => void;
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
    static defaultProps = {
      autoScrollToFocusedInput: true,
      scrollToInputThresholds: 100, // Magic number, don't ask
    };

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
              if (!this.scrollViewRef.current) {
                return;
              }
              const { scrollViewContentHeight, scrollViewHeight } = this.state;
              if (this.props.getScrollToTextInputOffset) {
                const offset = this.props.getScrollToTextInputOffset({
                  inputY: y,
                  scrollViewContentHeight,
                  scrollViewHeight,
                });
                this.scrollViewRef.current.scrollTo({
                  x: 0,
                  y: offset,
                  animated: true,
                });
                return;
              }
              const { scrollToInputThresholds } = this.props;
              if (
                scrollViewContentHeight <= scrollViewHeight ||
                y - scrollToInputThresholds < scrollToInputThresholds
              ) {
                return;
              }
              const maxContentOffsetY =
                this.state.scrollViewContentHeight -
                this.state.scrollViewHeight;
              const desiredContentOffsetY = Math.min(
                y - scrollToInputThresholds,
                maxContentOffsetY
              );
              this.scrollViewRef.current.scrollTo({
                x: 0,
                y: desiredContentOffsetY,
                animated: true,
              });
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
            alwaysBounceVertical={
              // Why set this false by default?
              // It is because I dont want the form can be scrolled if the
              // content size is smaller than the scrollview size.
              // Imagine there is only 1 input field and if the form can be
              // scrolled, that will be a weird UX-wise
              false
            }
            {...restProps}
            onContentSizeChange={this.onScrollViewContentSizeChange}
            onLayout={this.onScrollViewLayout}
          >
            {
              // We make the content view at least have the height of scrollview
              // to make developer able to put submit button at the bottom of
              // the form
              // It is a trick to workaround  we can't set flex 1 in
              // scrollview's contentContainerStyle
              // To achieve putting submit button at screen bottom,
              // we simply need to do:
              /*
                <Form>
                  <View style={{flex: 1}}>
                    <FormField />
                    <FormField />
                    <FormField />
                  </View>
                  <Button />
                </Form>
              */
            }
            <View style={{ minHeight: this.state.scrollViewHeight }}>
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

    onSubmitEditing = (
      e: NativeSyntheticEvent<TextInputSubmitEditingEventData>
    ) => {
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
