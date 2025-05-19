import * as vscode from "vscode";
import { ViewItem } from "./view-item";

export class DataProvider implements vscode.TreeDataProvider<ViewItem> {

    // 发布订阅模式
    // this._onDidChangeTreeData = new vscode.EventEmitter();
    // this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    // getTreeItem 方法用于获取树视图中每个节点的具体信息，比如标签、图标等。每当VSCode需要渲染树视图中的一个项目时，它就会调用这个方法。
    // getChildren 方法用于获取树视图中某个节点的子节点。当用户展开树视图中的一个节点时，这个方法会被调用。
    private _onDidChangeTreeData: vscode.EventEmitter<ViewItem | undefined | null> = new vscode.EventEmitter<ViewItem | undefined | null>();
    readonly onDidChangeTreeData: vscode.Event<ViewItem | undefined | null> = this._onDidChangeTreeData.event;

    public matches: ViewItem[] = [];

    constructor(private context: vscode.ExtensionContext) { }

    public setMatches(matches: string[]) {
        this.matches = matches.map(match => new ViewItem(match));
        this._onDidChangeTreeData.fire(null);
    }

    getTreeItem(element: ViewItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: ViewItem): Thenable<ViewItem[]> {
        if (!element) {
            return Promise.resolve(this.matches);
        }
        return Promise.resolve([]);
    }
}
