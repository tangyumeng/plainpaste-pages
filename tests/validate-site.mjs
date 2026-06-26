import { readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { cwd, exit } from 'node:process';

const root = cwd();

const requiredFiles = [
  'index.html',
  'support/index.html',
  'privacy/index.html',
  'assets/site.css',
  'assets/icon.png',
  '.nojekyll',
];

const requiredText = {
  'index.html': [
    'PlainPaste',
    'Paste copied content without unwanted formatting',
    'Support',
    'Privacy Policy',
    'Command + Shift + V',
  ],
  'support/index.html': [
    'PlainPaste Support',
    'Contact',
    'macOS version',
    'PlainPaste version',
    'Accessibility permission',
  ],
  'privacy/index.html': [
    'PlainPaste Privacy Policy',
    'does not collect personal data',
    'does not require an account',
    'does not upload clipboard contents',
    'Accessibility permission is used only when you choose automatic paste',
    'Last updated: June 26, 2026',
  ],
};

const errors = [];

for (const file of requiredFiles) {
  try {
    const stats = statSync(join(root, file));
    if (!stats.isFile()) {
      errors.push(`${file} exists but is not a file`);
    }
  } catch {
    errors.push(`${file} is missing`);
  }
}

for (const [file, snippets] of Object.entries(requiredText)) {
  let text = '';
  try {
    text = readFileSync(join(root, file), 'utf8');
  } catch {
    continue;
  }

  for (const snippet of snippets) {
    if (!text.includes(snippet)) {
      errors.push(`${file} is missing required text: ${snippet}`);
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  exit(1);
}

console.log('Site contract passed.');
