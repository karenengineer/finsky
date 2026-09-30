const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const script = path.join(__dirname, 'deploy-ftps.sh');

function fixture() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'finsky-ftps-'));
  const release = path.join(dir, 'release');
  fs.mkdirSync(release);
  fs.writeFileSync(path.join(release, 'index.html'), '<title>FinSky</title>');
  fs.writeFileSync(path.join(release, '.htaccess'), 'RewriteEngine On\n');
  const argsFile = path.join(dir, 'lftp-args');
  const fakeLftp = path.join(dir, 'lftp');
  fs.writeFileSync(fakeLftp, '#!/bin/sh\nprintf "%s\\n" "$@" > "$LFTP_ARGS_FILE"\n', { mode: 0o755 });
  return { dir, release, argsFile };
}

function run(envOverrides = {}) {
  const { dir, release, argsFile } = fixture();
  const result = spawnSync('bash', [script, release], {
    encoding: 'utf8',
    env: {
      ...process.env,
      PATH: `${dir}:${process.env.PATH}`,
      LFTP_ARGS_FILE: argsFile,
      FTPS_HOST: 'ftp.example.com',
      FTPS_USER: 'deploy@example.com',
      LFTP_PASSWORD: 'private-test-password',
      ...envOverrides,
    },
  });
  const args = fs.existsSync(argsFile) ? fs.readFileSync(argsFile, 'utf8') : '';
  fs.rmSync(dir, { recursive: true, force: true });
  return { result, args };
}

test('requires deployment credentials before invoking lftp', () => {
  const { result, args } = run({ LFTP_PASSWORD: '' });
  assert.notEqual(result.status, 0);
  assert.equal(args, '');
  assert.doesNotMatch(result.stderr, /private-test-password/);
});

test('uses verified FTPS and uploads index last without deleting server files', () => {
  const { result, args } = run();
  assert.equal(result.status, 0, result.stderr);
  assert.match(args, /ftp:ssl-force true/);
  assert.match(args, /ftp:ssl-protect-data true/);
  assert.match(args, /ssl:verify-certificate true/);
  assert.match(args, /open --env-password --user "deploy@example\.com" "ftp:\/\/ftp\.example\.com"/);
  assert.match(args, /\ncls index\.html\n/);
  assert.doesNotMatch(args, /get index\.html/);
  assert.match(args, /mirror --reverse/);
  assert.doesNotMatch(args, /--delete|private-test-password/);
  assert.ok(args.indexOf('put .htaccess') < args.indexOf('put index.html'));
});

test('rejects an unsafe FTPS host before invoking lftp', () => {
  const { result, args } = run({ FTPS_HOST: 'ftp.example.com"; exit 0' });
  assert.notEqual(result.status, 0);
  assert.equal(args, '');
});
