declare module "react-native-dialogs" {
  export type ListItem = { label: string } | { label: string; id: any } | {};

  export interface OptionsCommon {
    cancelable?: boolean;
    content?: string;
    contentColor?: string;
    contentIsHtml?: boolean;
    forceStacking?: boolean;
    linkColor?: string;
    negativeColor?: string;
    negativeText?: string;
    neutralColor?: string;
    neutralText?: string;
    positiveColor?: string;
    positiveText?: string; // default "OK"
    title?: string;
    titleColor?: string;
  }

  export type OptionsPicker = OptionsCommon & {
    idKey?: string;
    items: ListItem[];
    labelKey?: string;
    neutralIsClear?: boolean;
    selectedId?: any;
    selectedIds?: any[];
    type?: string;
    widgetColor?: string;
  };

  export default class DialogAndroid {
    static listPlain: "listPlain";
    static listRadio: "listRadio";
    static listCheckbox: "listCheckbox";
    static actionDismiss: "actionDismiss";
    static actionNegative: "actionNegative";
    static actionNeutral: "actionNeutral";
    static actionPositive: "actionPositive";
    static actionSelect: "actionSelect";
    static progressHorizontal: "progressHorizontal";
    static showPicker(
      title: string | null,
      content: string | null,
      options: OptionsPicker
    ): Promise<
      | { action: "actionNegative" | "actionNeutral" | "actionDismiss" }
      | {
          action: "actionNegative" | "actionNeutral" | "actionDismiss";
          checked: boolean;
        }
      | { action: "actionSelect"; selectedItem: ListItem }
      | { action: "actionSelect"; selectedItem: ListItem; checked: boolean }
      // | { action: 'actionSelect'; selectedItems: ListItem[] }
      // | { action: 'actionSelect'; selectedItems: ListItem[]; checked: boolean }
    >;
  }
}
