/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Backup {
  id: string;
  type: 'manual' | 'auto';
  size: string;
  status: 'success' | 'failed' | 'pending';
  createdAt: string;
  path: string;
}
