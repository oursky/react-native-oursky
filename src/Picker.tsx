import React from "react";
import {
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  StyleProp,
  ViewStyle,
} from "react-native";
import {PickerIOS} from "@react-native-picker/picker"
import DialogAndroid, { OptionsPicker } from "react-native-dialogs";
import Modal from "./Modal";

export interface Item {
  value: string;
  label: string;
}

export interface Props {
  visible: boolean;
  value: string;
  items: Item[];
  onDismiss: (value: string) => void;
  onDone: (value: string) => void;
  onCancel: (value: string) => void;
  // This must be provided because if there is no done button,
  // we cannot confirm select on Android.
  doneButtonLabel?: string;
  cancelButtonLabel?: string | null;
  ToolbarComponent?: React.ReactType<{}>;
  toolbarStyle?: StyleProp<ViewStyle>;
  itemsStyle?: StyleProp<ViewStyle>;
}

interface State {
  selectedValue: string;
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
  },
  toolbar: {
    height: 44,
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#B1B1B1",
    backgroundColor: "#F7F7F7",
  },
  toolbarButton: {
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  toolbarButtonCancel: {
    color: "#007AFF",
  },
  toolbarButtonDone: {
    color: "#007AFF",
    fontWeight: "bold",
  },
});

class ToolbarIOS extends React.Component<{
  cancelButtonLabel?: string | null;
  doneButtonLabel?: string;
  onDonePress: () => void;
  onCancelPress: () => void;
  toolbarStyle?: StyleProp<ViewStyle>;
}> {
  render() {
    let {
      cancelButtonLabel,
      doneButtonLabel,
      onDonePress,
      onCancelPress,
      toolbarStyle,
    } = this.props;
    let justifyContent: any = "";
    if (cancelButtonLabel === null && doneButtonLabel !== null) {
      justifyContent = "flex-end";
    }
    if (cancelButtonLabel !== null && doneButtonLabel !== null) {
      justifyContent = "space-between";
    }
    if (cancelButtonLabel === undefined) {
      cancelButtonLabel = "Cancel";
    }
    if (doneButtonLabel === undefined) {
      doneButtonLabel = "Done";
    }
    return (
      <View style={[styles.toolbar, { justifyContent }, toolbarStyle]}>
        {typeof cancelButtonLabel === "string" ? (
          <TouchableOpacity
            style={styles.toolbarButton}
            onPress={onCancelPress}
          >
            <Text allowFontScaling={false} style={styles.toolbarButtonCancel}>
              {cancelButtonLabel}
            </Text>
          </TouchableOpacity>
        ) : null}
        {typeof doneButtonLabel === "string" ? (
          <TouchableOpacity style={styles.toolbarButton} onPress={onDonePress}>
            <Text allowFontScaling={false} style={styles.toolbarButtonDone}>
              {doneButtonLabel}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }
}

function prepareValue(props: Props): string {
  // Pre-select the value of the first item to
  // match the behavior of UIPickerView.
  // Note that we still have an unhandled edge case
  // that the component is mounted with visible=false
  // and then items changes, followed by visible=true.
  // In this edge case, the pre-select value is stale.
  if (props.items.length <= 0) {
    return "";
  }
  if (props.value !== "") {
    return props.value;
  }
  return props.items[0].value;
}

class PickerImplIOS extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedValue: prepareValue(props),
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.visible && this.props.visible) {
      this.setState({
        selectedValue: prepareValue(this.props),
      });
    }
  }

  onRequestClose = () => {
    this.props.onDismiss(this.state.selectedValue);
  };

  onValueChange = (value: string | number) => {
    if (typeof value === "string") {
      this.setState({ selectedValue: value });
    }
  };

  onDonePress = () => {
    this.props.onDone(this.state.selectedValue);
  };

  onCancelPress = () => {
    this.props.onCancel(this.state.selectedValue);
  };

  renderItem = (item: Item) => {
    return (
      <PickerIOS.Item key={item.value} label={item.label} value={item.value} />
    );
  };

  render() {
    const {
      visible,
      items,
      cancelButtonLabel,
      doneButtonLabel,
      ToolbarComponent,
      toolbarStyle,
      itemsStyle,
    } = this.props;
    const { selectedValue } = this.state;
    return (
      <Modal visible={visible} onRequestClose={this.onRequestClose}>
        <View style={styles.container}>
          {ToolbarComponent != null ? (
            React.createElement(ToolbarComponent)
          ) : (
            <ToolbarIOS
              cancelButtonLabel={cancelButtonLabel}
              doneButtonLabel={doneButtonLabel}
              onDonePress={this.onDonePress}
              onCancelPress={this.onCancelPress}
              toolbarStyle={toolbarStyle}
            />
          )}
          <PickerIOS
            selectedValue={selectedValue}
            onValueChange={this.onValueChange}
            itemStyle={itemsStyle}
          >
            {items.map(this.renderItem)}
          </PickerIOS>
        </View>
      </Modal>
    );
  }
}

class PickerImplAndroid extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedValue: prepareValue(props),
    };
  }

  componentDidMount() {
    if (this.props.visible) {
      this._showPicker();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.visible && this.props.visible) {
      this.setState(
        {
          selectedValue: prepareValue(this.props),
        },
        this._showPicker
      );
    }
  }

  render() {
    return null;
  }

  _showPicker = () => {
    let { items, doneButtonLabel, cancelButtonLabel } = this.props;
    const { selectedValue } = this.state;

    const options: OptionsPicker = {
      type: DialogAndroid.listRadio,
      selectedId: selectedValue,
      items: items.map(item => ({
        label: item.label,
        id: item.value,
      })),
    };

    if (doneButtonLabel === undefined) {
      doneButtonLabel = "Done";
    }
    options.positiveText = doneButtonLabel;

    if (cancelButtonLabel === null) {
      options.negativeText = "";
    } else {
      if (cancelButtonLabel === undefined) {
        cancelButtonLabel = "Cancel";
      }
      options.negativeText = cancelButtonLabel;
    }

    const title = null;
    const content = null;
    DialogAndroid.showPicker(title, content, options)
      .then(response => {
        if (response.action === DialogAndroid.actionSelect) {
          // If the picker is opened with pre-selected value and
          // the user simply presses done, selectedItem will be
          // undefined, though we have prepareValue before we
          // open the picker. If we really hit this case,
          // we invoke onCancel.
          if (response.selectedItem != null) {
            const { id } = response.selectedItem as any;
            this.props.onDone(id);
          } else {
            this.props.onCancel(selectedValue);
          }
        } else if (response.action === DialogAndroid.actionDismiss) {
          this.props.onDismiss(selectedValue);
        } else if (response.action === DialogAndroid.actionNegative) {
          this.props.onCancel(selectedValue);
        }
      })
      .catch(() => {});
  };
}

export default function Picker(props: Props) {
  if (Platform.OS === "ios") {
    return <PickerImplIOS {...props} />;
  }
  if (Platform.OS === "android") {
    return <PickerImplAndroid {...props} />;
  }
  return null;
}
