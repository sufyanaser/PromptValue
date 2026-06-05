/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Settings {
  theme: 'light' | 'dark' | 'system';
  language: 'ar' | 'en';
  defaultView: 'card' | 'list' | 'compact';
  autosaveEnabled: boolean;
  autosaveInterval: number; // minutes
  databasePath: string;
  backupEnabled: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  backupRetention: number;
  showPromptPreview: boolean;
  showTooltips: boolean;
  geminiApiKey?: string;
  openaiApiKey?: string;
  claudeApiKey?: string;
  copilotApiKey?: string;
  googleDriveEnabled?: boolean;
  googleDriveApiKey?: string;
  dropboxEnabled?: boolean;
  dropboxApiKey?: string;
}
