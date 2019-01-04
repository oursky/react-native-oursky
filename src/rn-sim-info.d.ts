declare module "rn-sim-info" {
  export interface API {
    getCountryCode(defaultValue?: string): string;
    getMobileCountryCode(defaultValue?: string): string;
    getNetworkCode(defaultValue?: string): string;
    getCarrierName(defaultValue?: string): string;
  }
  const api: API;
  export default api;
}
