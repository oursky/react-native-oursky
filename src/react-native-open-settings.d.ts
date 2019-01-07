declare module "react-native-open-settings" {
  export interface API {
    openSettings(): void;
  }
  const api: API;
  export default api;
}
