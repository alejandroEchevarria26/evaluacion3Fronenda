#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ "${SITES_ENV_READY:-}" != "1" ]]; then
  exec "${script_dir}/sites-env.sh" -- "$0" "$@"
fi

command -v flock >/dev/null || {
  echo "install-ci.sh requires Linux flock." >&2
  exit 69
}
command -v timeout >/dev/null || {
  echo "install-ci.sh requires GNU timeout." >&2
  exit 69
}
command -v curl >/dev/null || {
  echo "install-ci.sh requires curl for the locked-tarball preflight." >&2
  exit 69
}

lock_file="${SITES_PROJECT_ROOT}/.sites-runtime/install.lock"
exec 9>"${lock_file}"
if ! flock -n 9; then
  echo "Another dependency install is already running for ${SITES_PROJECT_ROOT}." >&2
  exit 75
fi

# Catch an installer started outside this helper. Linux exposes both its command
# line and working directory through /proc, so avoid broad process-name matches.
for process in /proc/[0-9]*; do
  pid="${process##*/}"
  [[ "${pid}" != "$$" && "${pid}" != "${PPID}" ]] || continue
  process_cwd="$(readlink -f "${process}/cwd" 2>/dev/null || true)"
  [[ "${process_cwd}" == "${SITES_PROJECT_ROOT}" ]] || continue
  process_command="$(tr '\0' ' ' <"${process}/cmdline" 2>/dev/null || true)"
  if [[ "${process_command}" == *"npm ci"* ]]; then
    echo "Another npm ci is visible in ${SITES_PROJECT_ROOT}; refusing to overlap installs." >&2
    exit 75
  fi
done

locked_tarball="$({ node --input-type=module - "${SITES_PROJECT_ROOT}/package-lock.json" <<'NODE'
import { readFile } from "node:fs/promises";

const lock = JSON.parse(await readFile(process.argv[2], "utf8"));
const vinext = lock.packages?.["node_modules/vinext"];
if (!vinext?.resolved || !vinext?.integrity) {
  throw new Error("package-lock.json does not contain a resolved, integrity-pinned vinext tarball");
}
process.stdout.write(vinext.resolved);
NODE
} 2>/dev/null)" || {
  echo "Could not read the integrity-pinned vinext tarball from package-lock.json." >&2
  exit 65
}

registry="$(npm config get registry)"
preflight_url="$({ node --input-type=module - "${locked_tarball}" "${registry}" <<'NODE'
const locked = new URL(process.argv[2]);
const registry = new URL(process.argv[3]);
if (locked.hostname === "registry.npmjs.org") {
  locked.protocol = registry.protocol;
  locked.host = registry.host;
  locked.pathname = `${registry.pathname.replace(/\/$/, "")}${locked.pathname}`;
}
process.stdout.write(locked.href);
NODE
} 2>/dev/null)" || {
  echo "Could not construct the locked-tarball preflight URL." >&2
  exit 65
}

echo "Preflighting locked vinext tarball..."
curl \
  --fail \
  --location \
  --silent \
  --show-error \
  --retry 0 \
  --connect-timeout 10 \
  --max-time 30 \
  --range 0-0 \
  --output /dev/null \
  "${preflight_url}"

echo "Running one bounded npm ci..."
export npm_config_maxsockets=1
export npm_config_fetch_retries=0
export npm_config_fetch_timeout=30000
timeout \
  --signal=TERM \
  --kill-after="${SITES_INSTALL_KILL_AFTER:-15s}" \
  "${SITES_INSTALL_TIMEOUT:-8m}" \
  npm ci
