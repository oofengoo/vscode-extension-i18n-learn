import * as vscode from 'vscode';
import workspace from "../class/workspace";
import { Command } from '../typings';
import fs from 'fs/promises';
import path from 'path';
import dayjs from 'dayjs';
import http from '../class/request';

export function translationI18nCommand(): Command {
  return {
    name: 'workExtension.translationI18n',
    handler: async () => {
      const baseConfig = workspace.getRequestConfig();
      const translationI18nProjectType = workspace.get('translationI18nProjectType');

      // 获取多语言的Alias
      async function geti18n(params: any) {
        const res = await http.post('/MultiLanguageResource/AddResource', params, baseConfig);
        if (res.Data) {
          return res.Data.ResourceAlias;
        } else {
          // 处理错误
          vscode.window.showErrorMessage('Error: 翻译报错');
          const formattedTime = dayjs().format('YYYY-MM-DD HH:mm');
          const errorMessage = `错误消息：${formattedTime}：${JSON.stringify(res)}`;
          const workspaceFolder = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0] : null;
          if (!workspaceFolder) {
            vscode.window.showErrorMessage('Error: 无法写入日志文件，因为未找到工作区文件夹。');
            return '';
          }
          const logFilePath = path.join(workspaceFolder.uri.fsPath, 'log.txt');
          await fs.appendFile(logFilePath, errorMessage);
          return '';
        }
      }

      // 翻译中文为英文
      async function TranslateToEn(text: string) {
        const res = await http.get('/MultiLanguageResource/TranslateToEn', { text }, baseConfig);
        return res;
      }

      // 使用 withProgress 来显示进度
      await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "正在翻译文档...",
        cancellable: true
      }, async (progress, token) => {
        token.onCancellationRequested(() => {

          // 这里可以添加取消翻译逻辑
        });

        // 获取配置
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
          vscode.window.showErrorMessage('Error: 没有打开的编辑器');

          return; // 没有打开的编辑器
        }
        // 获取编辑器的内容
        let documentContent = editor.document.getText();
        // 正则表达式 匹配所有 ##...## 格式的文本
        const regex = /##([\S\s]+?)##/g;


        const matches = documentContent.matchAll(regex)
        const matchesArray = [...matches];
        let progressIndex = 0;
        vscode.window.showInformationMessage('开始翻译,数量' + matchesArray.length);

        for (const match of matchesArray) {
          if (token.isCancellationRequested) {
            return; // 如果用户请求取消，则退出循环
          }

          let value = match[1];
          if (!value) continue;

          let params: Record<string, any> = {
            "language": 1,
            "autoAlias": true,
            value: value,
          };

          if (translationI18nProjectType === 5500) {
            params.valueEn = await TranslateToEn(value);
          }

          const text = await geti18n(params);
          if (text) {
            documentContent = documentContent.replace(match[0], text);
          }

          // 更新进度
          progress.report({ increment: 100 / matchesArray.length });
          progressIndex++;
        }
        vscode.window.showInformationMessage('翻译完成,数量' + progressIndex);

        // 使用编辑器的 edit 方法来修改内容
        editor.edit(editBuilder => {
          const start = new vscode.Position(0, 0);
          const end = editor.document.positionAt(documentContent.length);
          editBuilder.replace(new vscode.Range(start, end), documentContent);
        });
      });
    },
  };
}
