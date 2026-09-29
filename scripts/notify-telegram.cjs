const https = require('node:https');

function buildMessage({ status, commit, runUrl }) {
  if (!['success', 'failure'].includes(status) || !/^[a-f0-9]{40}$/i.test(commit)) {
    throw new Error('Invalid deployment status or commit');
  }
  const url = new URL(runUrl);
  if (url.origin !== 'https://github.com' ||
      !/^\/karenengineer\/finsky\/actions\/runs\/\d+(?:\/attempts\/\d+)?$/.test(url.pathname) ||
      url.search || url.hash) {
    throw new Error('Invalid GitHub Actions run URL');
  }
  return [
    'FinSky production',
    `Status: ${status}`,
    `Commit: ${commit.slice(0, 7)}`,
    `Run: ${runUrl}`,
    'Site: https://finsky.am/',
  ].join('\n');
}

function sendMessage(token, chatId, text) {
  const payload = Buffer.from(JSON.stringify({ chat_id: chatId, text }));
  return new Promise((resolve, reject) => {
    const request = https.request(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'content-length': payload.length },
    }, response => {
      const chunks = [];
      let size = 0;
      response.on('data', chunk => {
        size += chunk.length;
        if (size > 65536) request.destroy();
        else chunks.push(chunk);
      });
      response.on('end', () => {
        try {
          const body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
          if (response.statusCode === 200 && body.ok === true) resolve();
          else reject(new Error('Telegram did not confirm delivery'));
        } catch {
          reject(new Error('Telegram did not confirm delivery'));
        }
      });
    });
    request.setTimeout(15000, () => request.destroy());
    request.on('error', () => reject(new Error('Telegram delivery failed')));
    request.end(payload);
  });
}

if (require.main === module) {
  const env = process.env;
  try {
    if (!/^[A-Za-z0-9:_-]{1,256}$/.test(env.TELEGRAM_BOT_TOKEN || '') ||
        !/^-?\d{1,20}$/.test(env.TELEGRAM_CHAT_ID || '')) {
      throw new Error('Missing or invalid Telegram credentials');
    }
    const text = buildMessage({
      status: env.DEPLOY_STATUS,
      commit: env.DEPLOY_COMMIT,
      runUrl: env.DEPLOY_RUN_URL,
    });
    sendMessage(env.TELEGRAM_BOT_TOKEN, env.TELEGRAM_CHAT_ID, text)
      .then(() => process.stdout.write('Telegram notification delivered.\n'))
      .catch(() => {
        process.stderr.write('Telegram notification could not be confirmed.\n');
        process.exitCode = 1;
      });
  } catch {
    process.stderr.write('Telegram notification configuration is incomplete or invalid.\n');
    process.exitCode = 1;
  }
}

module.exports = { buildMessage };
