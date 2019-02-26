import React from "react";
import {
  Platform,
  PickerIOS,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import DialogAndroid, { OptionsPicker } from "react-native-dialogs";
import Text from "./Text";
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
}

interface StateIOS {
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
}> {
  render() {
    let {
      cancelButtonLabel,
      doneButtonLabel,
      onDonePress,
      onCancelPress,
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
      <View style={[styles.toolbar, { justifyContent }]}>
        {typeof cancelButtonLabel === "string" ? (
          <TouchableOpacity
            style={styles.toolbarButton}
            onPress={onCancelPress}
          >
            <Text style={styles.toolbarButtonCancel}>{cancelButtonLabel}</Text>
          </TouchableOpacity>
        ) : null}
        {typeof doneButtonLabel === "string" ? (
          <TouchableOpacity style={styles.toolbarButton} onPress={onDonePress}>
            <Text style={styles.toolbarButtonDone}>{doneButtonLabel}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }
}

class PickerImplIOS extends React.Component<Props, StateIOS> {
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedValue: this._prepareValue(props),
    };
  }

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.visible && this.props.visible) {
      this.setState({
        selectedValue: this._prepareValue(this.props),
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
            />
          )}
          <PickerIOS
            selectedValue={selectedValue}
            onValueChange={this.onValueChange}
          >
            {items.map(this.renderItem)}
          </PickerIOS>
        </View>
      </Modal>
    );
  }

  private _prepareValue(props: Props): string {
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
}

class PickerImplAndroid extends React.Component<Props> {
  componentDidMount() {
    if (this.props.visible) {
      this._showPicker();
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.visible && this.props.visible) {
      this._showPicker();
    }
  }

  render() {
    return null;
  }

  private _showPicker() {
    let { value, items, doneButtonLabel, cancelButtonLabel } = this.props;

    const options: OptionsPicker = {
      type: DialogAndroid.listRadio,
      selectedId: value,
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
        if (
          response.action === DialogAndroid.actionSelect &&
          response.selectedItem != null
        ) {
          const { id } = response.selectedItem as any;
          this.props.onDone(id);
        } else if (response.action === DialogAndroid.actionDismiss) {
          this.props.onDismiss(value);
        } else if (response.action === DialogAndroid.actionNegative) {
          this.props.onCancel(value);
        }
      })
      .catch(() => {});
  }
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
