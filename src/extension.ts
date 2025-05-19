import * as vscode from 'vscode';
// import { CONFIG_TAG } from './constants';
import { Command } from './typings';
import { getAllCommands } from './commands';
import { DataProvider } from './class/dataProvider';
import { ViewItem } from './class/view-item';
// import { createAxios } from './request';

export function activate(context: vscode.ExtensionContext) {
  // 获取所有命令
  const commands: Array<Command> = getAllCommands();
  // 遍历所有命令，注册命令
  for (const { name, handler } of commands) {
    const disposable = vscode.commands.registerCommand(name, (viewItem:ViewItem) => {
      handler(provider,viewItem);
    });
    context.subscriptions.push(disposable)
  }
  const provider = new DataProvider(context);
  vscode.window.registerTreeDataProvider('workExtensionActivity', provider);

}


export function deactivate() { }
