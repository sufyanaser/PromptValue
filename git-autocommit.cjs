const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const WATCH_DIR = __dirname;
const DEBOUNCE_MS = 15000; // Wait 15 seconds after the last change before pushing
let debounceTimer = null;
let changedFiles = new Set();

// Directories and files to ignore
const IGNORED_PATHS = [
  '.git',
  'node_modules',
  'dist',
  'build',
  'coverage',
  '.DS_Store',
  'git-autocommit.js',
  'git-autocommit.cjs'
];

function shouldIgnore(relativeFilePath) {
  return IGNORED_PATHS.some(ignored => {
    return relativeFilePath === ignored || relativeFilePath.startsWith(ignored + path.sep) || relativeFilePath.startsWith(ignored + '/');
  }) || relativeFilePath.endsWith('.log') || relativeFilePath.includes('.tmp');
}

function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, { cwd: WATCH_DIR }, (error, stdout, stderr) => {
      if (error) {
        reject({ error, stdout, stderr });
      } else {
        resolve(stdout.trim());
      }
    });
  });
}

async function runGitSync() {
  console.log(`[Auto-Sync] ${new Date().toLocaleTimeString('ar-EG')}: Starting Git sync for changes in: ${Array.from(changedFiles).join(', ')}`);
  changedFiles.clear();

  try {
    // Stage all changes
    await runCommand('git add -A');

    // Check if there are staged changes to commit
    try {
      await runCommand('git diff --cached --quiet');
      console.log('[Auto-Sync] No changes to commit.');
      return;
    } catch (diffError) {
      // exit code 1 from diff --quiet means there are staged changes
    }

    const timestamp = new Date().toLocaleString('ar-EG');
    const commitMsg = `auto: sync changes on ${timestamp}`;
    await runCommand(`git commit -m "${commitMsg}"`);
    console.log(`[Auto-Sync] Committed: "${commitMsg}"`);

    console.log('[Auto-Sync] Pushing to GitHub...');
    await runCommand('git push origin main');
    console.log('[Auto-Sync] Push successful!');
  } catch (err) {
    console.error('[Auto-Sync] Sync failed:', err.stderr || err.error || err);
  }
}

function handleFileChange(eventType, filename) {
  if (!filename) return;

  const relativePath = path.relative(WATCH_DIR, path.join(WATCH_DIR, filename));
  if (shouldIgnore(relativePath)) return;

  changedFiles.add(relativePath);

  // Reset debounce timer
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(() => {
    if (changedFiles.size > 0) {
      runGitSync();
    }
  }, DEBOUNCE_MS);
}

console.log(`[Auto-Sync] Watching ${WATCH_DIR} recursively for changes...`);

// fs.watch supports recursion on Windows
fs.watch(WATCH_DIR, { recursive: true }, handleFileChange);
