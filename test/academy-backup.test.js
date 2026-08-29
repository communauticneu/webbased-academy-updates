const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const backupPath = path.join(__dirname, '..', 'ACADEMY-BACKUP.cmd');

test('Academy backup is a safe one-click fileserver backup', () => {
  assert.ok(fs.existsSync(backupPath), 'ACADEMY-BACKUP.cmd must exist');
  const cmd = fs.readFileSync(backupPath, 'utf8');
  assert.match(cmd, /\\\\FILESERVER\\datenarchiv\\communautic_Ebenbichler_KG\\Webbased_Academy_Backups/i);
  assert.match(cmd, /Webbased-Academy-Creator_Backup_/i);
  assert.match(cmd, /Compress-Archive/i);
  assert.match(cmd, /BACKUP ERFOLGREICH/i);
  assert.match(cmd, /node_modules/i);
  assert.match(cmd, /academy-diagnostics\.txt/i);
  assert.match(cmd, /\.env/i);
  assert.doesNotMatch(cmd, /git push/i);
  assert.doesNotMatch(cmd, /\.github\\workflows/i);
});
