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

test('Academy backup keeps only the newest 30 backup packages after success', () => {
  const cmd = fs.readFileSync(backupPath, 'utf8');
  assert.match(cmd, /KEEP_BACKUPS=30/i);
  assert.match(cmd, /Webbased-Academy-Creator_Backup_\*\.zip/i);
  assert.match(cmd, /Sort-Object\s+LastWriteTime\s+-Descending/i);
  assert.match(cmd, /Select-Object\s+-Skip\s+\$keep/i);
  const successPos = cmd.indexOf('BACKUP ERFOLGREICH');
  const cleanupPos = cmd.indexOf('Select-Object -Skip $keep');
  assert.ok(successPos >= 0 && cleanupPos > successPos, 'old backups may only be deleted after the new backup was confirmed');
});
