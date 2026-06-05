/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Activity {
  id: string;
  type: 'create' | 'edit' | 'use' | 'favorite' | 'archive';
  label: string;
  promptId?: string;
  createdAt: string;
}
