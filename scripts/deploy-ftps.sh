#!/usr/bin/env bash
set +x
set -euo pipefail

release_dir="${1:-}"
if [[ -z "$release_dir" || ! -f "$release_dir/index.html" || ! -f "$release_dir/.htaccess" ]]; then
  printf 'Expected a built FinSky release with index.html and .htaccess.\n' >&2
  exit 1
fi
if [[ -z "${FTPS_HOST:-}" || -z "${FTPS_USER:-}" || -z "${LFTP_PASSWORD:-}" ]]; then
  printf 'Configure FTPS_HOST, FTPS_USER and FTPS_PASSWORD in the production environment.\n' >&2
  exit 1
fi
if [[ ! "$FTPS_HOST" =~ ^[A-Za-z0-9.-]+$ || ! "$FTPS_USER" =~ ^[A-Za-z0-9@._-]+$ ]]; then
  printf 'Invalid FTPS host or username.\n' >&2
  exit 1
fi
if ! command -v lftp >/dev/null 2>&1; then
  printf 'lftp is required for FTPS deployment.\n' >&2
  exit 1
fi

cd "$release_dir"

# The dedicated FTP account must be rooted at public_html. Never delete
# remote files: cPanel owns .well-known and other files outside this build.
lftp --norc -c "
set cmd:fail-exit true
set ftp:ssl-force true
set ftp:ssl-protect-data true
set ftp:passive-mode true
set ssl:verify-certificate true
set ssl:check-hostname true
set net:max-retries 2
set net:timeout 20
open --env-password --user \"$FTPS_USER\" \"ftp://$FTPS_HOST\"
cd /
get index.html -o /dev/null
mirror --reverse --no-perms --exclude-glob index.html --exclude-glob .htaccess . .
put .htaccess -o .htaccess
put index.html -o index.html
bye
"
