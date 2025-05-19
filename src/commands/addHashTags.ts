import * as vscode from 'vscode';
import { Command, } from '../typings';

/**
 * 添加多语言翻译标记命令
 * 该命令用于在选中的文本前后添加 ## 标记，用于后续的多语言翻译处理
 * 使用方式：选中文本后按下快捷键或通过命令面板触发
 */
export function addHashTagsCommand(): Command {
    return {
        // 注册的命令名称，在 package.json 中需要与 contributes.commands 对应
        name: 'workExtension.addHashTags',
        
        /**
         * 命令处理函数
         * 将选中的文本添加 ## 前后缀标记
         * 例如：'用户名' -> '##用户名##'
         */
        handler: async () => {
            // 获取当前活动的编辑器实例
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                return; // 如果没有打开的编辑器，直接返回
            }

            // 使用 editor.edit 进行文本编辑
            editor.edit((editBuilder: vscode.TextEditorEdit) => {
                // 获取当前选中的文本区域
                const selection = editor.selection;
                // 获取选中区域的文本内容
                const text = editor.document.getText(selection);
                // 在文本前后添加 ## 标记
                const modifiedText = `##${text}##`;
                // 使用新文本替换选中区域的内容
                editBuilder.replace(selection, modifiedText);
            });
        },
    };
}
