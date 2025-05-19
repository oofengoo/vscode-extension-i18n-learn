

import * as vscode from "vscode";
export class ViewItem extends vscode.TreeItem {
    constructor(
        public readonly label: string
    ) {
        super(label);
        this.tooltip = this.label;
        this.description = '匹配到的内容';
    }
}
