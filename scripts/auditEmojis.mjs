import fs from 'fs';
import path from 'path';

// True pictographic emoji ranges (smileys, gestures, pictographs, symbols)
const trueEmojiRegex = /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}\u{1F1E6}-\u{1F1FF}]/u;

function scanDir(dir) {
  let count = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      count += scanDir(full);
    } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
      const content = fs.readFileSync(full, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (trueEmojiRegex.test(line)) {
          console.log(`EMOJI in ${full}:${idx + 1} -> ${line.trim().slice(0, 80)}`);
          count++;
        }
      });
    }
  }
  return count;
}

const total = scanDir(path.resolve('src'));
console.log('Total true emojis found in src/: ' + total);
