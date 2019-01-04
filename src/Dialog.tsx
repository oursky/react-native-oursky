import React from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
} from "react-native";
import Text from "./Text";

const defaultStyles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    paddingHorizontal: 39,
  },
  box: {
    paddingTop: 36,
    paddingBottom: 23,
    paddingHorizontal: 16,
    backgroundColor: "white",
    borderRadius: 6,
  },
  title: {
    alignSelf: "center",
    fontSize: 14,
    fontWeight: "bold",
    color: "rgb(51, 51, 51)",
  },
  description: {
    alignSelf: "center",
    textAlign: "center",
    fontSize: 14,
    color: "rgb(51, 51, 51)",
    marginTop: 18,
    paddingHorizontal: 16,
  },
  submitButton: {
    marginTop: 25,
    alignItems: "center",
    borderColor: "rgb(151, 151, 151)",
    borderWidth: 1,
    borderRadius: 25,
    paddingVertical: 8,
  },
  submitText: {
    fontSize: 16,
    color: "rgb(51, 51, 51)",
  },
  cancelButton: {
    alignItems: "center",
    marginTop: 16,
  },
  cancelText: {
    fontSize: 14,
    color: "rgb(170, 170, 170)",
  },
});

export interface LayoutProps {
  title: React.ReactNode;
  description: React.ReactNode;
  submitText: React.ReactNode;
  cancelText: React.ReactNode;

  backgroundStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  descriptionStyle?: StyleProp<TextStyle>;
  submitButtonStyle?: StyleProp<ViewStyle>;
  submitTextStyle?: StyleProp<TextStyle>;
  cancelButtonStyle?: StyleProp<ViewStyle>;
  cancelTextStyle?: StyleProp<TextStyle>;
}

interface ActivityProps {
  visible: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

export type Props = LayoutProps & ActivityProps;

export default class Dialog extends React.PureComponent<Props> {
  static defaultProps = {
    visible: false,
  };

  // hardware back button will trigger this.
  onRequestClose = () => {
    this.props.onCancel();
  };

  render() {
    const {
      visible,
      title,
      description,
      submitText,
      cancelText,

      backgroundStyle,
      style,
      titleStyle,
      descriptionStyle,
      submitButtonStyle,
      submitTextStyle,
      cancelButtonStyle,
      cancelTextStyle,

      onSubmit,
      onCancel,
    } = this.props;
    return (
      <Modal
        visible={visible}
        transparent={true}
        onRequestClose={this.onRequestClose}
      >
        <View style={[defaultStyles.background, backgroundStyle]}>
          <View style={[defaultStyles.box, style]}>
            <Text style={[defaultStyles.title, titleStyle]}>{title}</Text>
            <Text style={[defaultStyles.description, descriptionStyle]}>
              {description}
            </Text>
            <TouchableOpacity
              style={[defaultStyles.submitButton, submitButtonStyle]}
              onPress={onSubmit}
            >
              <Text style={[defaultStyles.submitText, submitTextStyle]}>
                {submitText}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[defaultStyles.cancelButton, cancelButtonStyle]}
              onPress={onCancel}
            >
              <Text style={[defaultStyles.cancelText, cancelTextStyle]}>
                {cancelText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}
