/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Prompt {
  id: string;
  title: string;
  description: string;
  content: string;
  categoryId: string;
  tags: string[];
  variables: string[];
  status: 'active' | 'draft' | 'archived';
  isFavorite: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
  lastUsedAt?: string;
  version: number;
  notes?: string;
  source?: string;
  author?: string;
}

export interface PromptVersion {
  id: string;
  promptId: string;
  version: number;
  content: string;
  changeNote: string;
  createdAt: string;
}
