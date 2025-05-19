import * as vscode from 'vscode';

import { Command, } from '../typings';
import workspace from '../class/workspace';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
// 复制多语言到项目
export function copyI18nCommand(): Command {
    // 返回一个Command对象
    return {
        // 命令名称
        name: 'workExtension.copyI18n',
        // 命令处理函数
        handler: async (
        ) => {

            // 获取当前活动的工作区文件夹
            const workspaceFolder = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0] : null;
            if (!workspaceFolder) {
                vscode.window.showErrorMessage('没有打开的工作区文件夹。');
                return;
            }
            const translationI18nProjectType = workspace.get('translationI18nProjectType')
            let langArr = [{ name: 'ZhCn', value: 1, filePath: 'ZhCn.js' },]
            // 目前只有企业版需要英文文件
            if (translationI18nProjectType === 5500) {
                langArr.push({ name: 'EnUs', value: 2, filePath: 'EnUs.js' })
            }
            // 获取工作区根路径
            const rootPath = workspaceFolder.uri.fsPath;
            async function downFile(language: number) {
                const translationI18nService = workspace.get('translationI18nService')
                const translationI18nToken = workspace.get('translationI18nToken')
                const res = await axios({
                    method: 'get',
                    url: `/MultiLanguageResource/DownWebJson?language=${language}`,
                    baseURL: translationI18nService,
                    responseType: 'stream',
                    headers: {
                        'Cookie': translationI18nToken, // 添加 token 到请求头

                    }
                })
                return res
            }
            try {
                for (let lang of langArr) {
                    const langTargetPath = path.join(rootPath, 'src/lang/source', lang.filePath);
                    const tempFilePath = path.join(rootPath, lang.filePath);
                    // 创建一个写入流
                    const writer = fs.createWriteStream(tempFilePath);
                    const res = await downFile(lang.value)
                    res.data.pipe(writer)
                    await new Promise((resolve, reject) => {
                        writer.on('finish', resolve);
                        writer.on('error', reject);
                    });
                    fs.copyFileSync(tempFilePath, langTargetPath);
                    fs.unlinkSync(tempFilePath);
                    vscode.window.showInformationMessage(lang.name + '文件复制成功');

                }

            } catch (error) {
                vscode.window.showInformationMessage('文件复制失败！');

            }

        },
    };
}
