import * as vscode from 'vscode';
import { Command, } from '../typings';

/**
 * 实现左侧视图匹配并显示文件中的多语言标记
 * 该命令会扫描当前打开的文件，查找所有 ##...## 格式的多语言标记
 * 并将结果显示在左侧视图中
 */
export function matchAndShowCommand(): Command {
    return {
        name: 'workExtension.matchAndShow',
        handler: async (
            provider, // TreeDataProvider实例，用于更新左侧视图
            viewItem  // 视图项数据
        ) => {
            console.log("🚀 ~ matchAndShowCommand ~ provider:", provider.matches)

            // 获取当前活动的编辑器
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                return; // 如果没有打开的编辑器，则直接返回
            }

            // 获取当前文档的全部文本内容
            const documentText = editor.document.getText();
            
            // 使用正则表达式匹配所有 ##...## 格式的文本
            // [\S\s] 匹配任意字符（包括换行）
            // +? 非贪婪模式匹配，确保正确匹配嵌套的标记
            const matches = documentText.match(/##([\S\s]+?)##/g); 

            // 更新左侧视图的数据
            if (matches) {
                provider.setMatches(matches); // 有匹配项时更新数据
            } else {
                provider.setMatches([]); // 没有匹配项时清空数据
            }
        },
    };
}
