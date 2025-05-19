import { Command } from '../typings';
import { addHashTagsCommand } from './addHashTags';
import { translationI18nCommand } from './translationI18n';
import { copyI18nCommand } from './copyI18n';
import { matchAndShowCommand } from './matchAndShow';
//获取所有命令
export function getAllCommands(): Array<Command> {
  return [
    translationI18nCommand(),
    addHashTagsCommand(),
    copyI18nCommand(),
    matchAndShowCommand(),


  ];
}
