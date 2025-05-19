
import * as vscode from "vscode";
import { WorkspaceConfiguration } from "../typings";
import { CONFIG_TAG } from "../constants";
import { AxiosRequestConfig } from "axios";
// 用于获取配置项的类
export class Workspace {


    public constructor() {

    }
    // keyof WorkspaceConfiguration 获取 WorkspaceConfiguration 接口的所有属性名的联合类型
    // extends 表示 T 必须是 WorkspaceConfiguration 的键名之一
    // 获取配置项
    public get<T extends keyof WorkspaceConfiguration>(key: T): WorkspaceConfiguration[T] {
        const config = vscode.workspace.getConfiguration(CONFIG_TAG);
        return config.get(key) as WorkspaceConfiguration[T];
    }
    // 获取翻译服务的请求配置
    public getRequestConfig(): AxiosRequestConfig {
        const config = vscode.workspace.getConfiguration(CONFIG_TAG);
        const requestConfig = {
            baseURL: config.get<string>('translationI18nService') || '',
            headers: {
                'Cookie': config.get<string>('translationI18nToken') || '', // 添加 token 到请求头
                'Content-Type': 'application/json' // 或者其他你需要的请求头
            }
        }

        return requestConfig
    }
    // 获取全局配置项
    public getGlobal(key: string): any {
        const config = vscode.workspace.getConfiguration();
        return config.get(key);
    }
// 保存配置项
    public save<T extends keyof WorkspaceConfiguration>(key: T, value: WorkspaceConfiguration[T]): Promise<void> {
        const config = vscode.workspace.getConfiguration(CONFIG_TAG);

        config.update(key, value, false);
        return Promise.resolve();

    }


}

export default new Workspace();
