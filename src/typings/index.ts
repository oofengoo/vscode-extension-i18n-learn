import { AxiosRequestConfig } from "axios";
import { DataProvider } from "../class/dataProvider";
import { ViewItem } from "../class/view-item";
export type Command = {
  name: string;
  handler: (provider: DataProvider,viewItem:ViewItem) => Promise<void>;
};



export interface WorkspaceConfiguration {
  translationI18nToken: string;
  translationI18nService: string;
  translationI18nProjectType: number;
}
// export interface RequestBaseConfig {
//   baseURL: string;
//   headers: string;
// }

export interface IAXIOS {

  request(config: AxiosRequestConfig): Promise<any>;
  get(url: string, data?: Record<string, any>, config?: AxiosRequestConfig): Promise<any>;
  post(url: string, data: Record<string, any>, config?: AxiosRequestConfig): Promise<any>;
}

