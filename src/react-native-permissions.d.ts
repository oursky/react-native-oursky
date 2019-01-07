declare module "react-native-permissions" {
  export type AndroidPermission =
    | "photo"
    | "location"
    | "camera"
    | "microphone"
    | "contacts"
    | "event"
    | "storage"
    | "callPhone"
    | "readSms"
    | "receiveSms";

  export type IOSPermission =
    | "notification"
    | "photo"
    | "location"
    | "camera"
    | "microphone"
    | "contacts"
    | "event"
    | "bluetooth"
    | "reminder"
    | "backgroundRefresh"
    | "speechRecognition"
    | "mediaLibrary"
    | "motion";

  export type Permission = AndroidPermission | IOSPermission;

  export type PermissionResult =
    | "authorized"
    | "denied"
    | "restricted"
    | "undetermined";

  export interface API {
    check(permission: Permission): Promise<PermissionResult>;
    request(permission: Permission): Promise<PermissionResult>;
  }
  const api: API;
  export default api;
}
