/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Prompt, PromptVersion } from './prompt';
import { Category } from './category';
import { Tag } from './tag';
import { Activity } from './activity';
import { Backup } from './backup';
import { Settings } from './settings';

export * from './prompt';
export * from './category';
export * from './tag';
export * from './activity';
export * from './backup';
export * from './settings';

export interface AppData {
  prompts: Prompt[];
  categories: Category[];
  tags: Tag[];
  activities: Activity[];
  backups: Backup[];
  settings: Settings;
  versions: PromptVersion[];
}
