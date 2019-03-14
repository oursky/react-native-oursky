import * as React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { createForm, KeyboardAvoidingView } from "@oursky/react-native-oursky";

const { Form, FormField } = createForm();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  header: {
    height: 200,
    backgroundColor: "pink",
  },
  form: {
    flex: 1,
  },
  formContent: {
    paddingHorizontal: 10,
  },
  inputContainer: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "black",
    padding: 10,
  },
  label: {
    marginTop: 10,
    fontSize: 18,
  },
});

export default class FormScreen extends React.PureComponent {
  render() {
    return (
      <KeyboardAvoidingView style={styles.container}>
        <View style={styles.header}>
          <Text>Header</Text>
        </View>
        <Form style={styles.form} contentContainerStyle={styles.formContent}>
          <Text style={styles.label}>Label 1</Text>
          <FormField index={0} style={styles.input}>
            {props => (
              <View style={styles.inputContainer}>
                <TextInput
                  ref={props.focusableRef}
                  onSubmitEditing={props.onSubmitEditing}
                  blurOnSubmit={props.blurOnSubmit}
                  placeholder="Input 1"
                />
              </View>
            )}
          </FormField>
          <Text style={styles.label}>Label 2</Text>
          <FormField index={1} style={styles.input}>
            {props => (
              <View style={styles.inputContainer}>
                <TextInput
                  ref={props.focusableRef}
                  onSubmitEditing={props.onSubmitEditing}
                  blurOnSubmit={props.blurOnSubmit}
                  placeholder="Input 2"
                />
              </View>
            )}
          </FormField>
          <Text style={styles.label}>Label 3</Text>
          <FormField index={2} style={styles.input}>
            {props => (
              <View style={styles.inputContainer}>
                <TextInput
                  ref={props.focusableRef}
                  onSubmitEditing={props.onSubmitEditing}
                  blurOnSubmit={props.blurOnSubmit}
                  placeholder="Input 3"
                />
              </View>
            )}
          </FormField>
          <Text style={styles.label}>Label 4</Text>
          <FormField index={3} style={styles.input}>
            {props => (
              <View style={styles.inputContainer}>
                <TextInput
                  ref={props.focusableRef}
                  onSubmitEditing={props.onSubmitEditing}
                  blurOnSubmit={props.blurOnSubmit}
                  placeholder="Input 4"
                />
              </View>
            )}
          </FormField>
          <Text style={styles.label}>Label 5</Text>
          <FormField index={4} style={styles.input}>
            {props => (
              <View style={styles.inputContainer}>
                <TextInput
                  ref={props.focusableRef}
                  onSubmitEditing={props.onSubmitEditing}
                  blurOnSubmit={props.blurOnSubmit}
                  placeholder="Input 5"
                />
              </View>
            )}
          </FormField>
        </Form>
      </KeyboardAvoidingView>
    );
  }
}
