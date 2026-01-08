import { execSync } from 'node:child_process';

function parsePortArg(argv: string[]): number {
  const raw = argv.find((a) => !a.startsWith('-'));
  if (!raw) return 3000;

  const port = Number(raw);
  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error(`Invalid port: "${raw}"`);
  }
  return port;
}

function run(command: string): string {
  return execSync(command, {
    stdio: ['ignore', 'pipe', 'pipe'],
    encoding: 'utf8',
  });
}

function tryRun(command: string): string | null {
  try {
    return run(command);
  } catch {
    return null;
  }
}

function uniqueNumbers(values: number[]): number[] {
  return [...new Set(values)].filter((n) => Number.isFinite(n) && n > 0);
}

function getListeningPidsWindows(port: number): number[] {
  const out = tryRun('netstat -ano -p tcp');
  if (!out) return [];

  // Example line:
  // TCP    0.0.0.0:3000           0.0.0.0:0              LISTENING       12345
  const pids: number[] = [];
  for (const line of out.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('TCP')) continue;
    if (!trimmed.includes(`:${port}`)) continue;
    if (!trimmed.toUpperCase().includes('LISTENING')) continue;

    const parts = trimmed.split(/\s+/);
    const pidStr = parts.at(-1);
    const pid = pidStr ? Number(pidStr) : NaN;
    if (Number.isInteger(pid) && pid > 0) pids.push(pid);
  }

  return uniqueNumbers(pids);
}

function getListeningPidsUnix(port: number): number[] {
  // Prefer lsof when available
  const lsofOut = tryRun(`lsof -nP -iTCP:${port} -sTCP:LISTEN -t`);
  if (lsofOut) {
    const pids = lsofOut
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => Number(s))
      .filter((n) => Number.isInteger(n) && n > 0);
    return uniqueNumbers(pids);
  }

  // Linux fallback: fuser can output "<port>/tcp: <pid> ..."
  const fuserOut = tryRun(`fuser -n tcp ${port} 2>/dev/null`);
  if (fuserOut) {
    const pids = fuserOut
      .split(/\s+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => Number(s))
      .filter((n) => Number.isInteger(n) && n > 0);
    return uniqueNumbers(pids);
  }

  return [];
}

function killPidWindows(pid: number): void {
  run(`taskkill /PID ${pid} /F`);
}

function killPidUnix(pid: number): void {
  // -9 to behave like taskkill /F (best-effort “force” kill)
  run(`kill -9 ${pid}`);
}

function usage(): string {
  return [
    'Usage: npm run kill-port -- [port]',
    'Examples:',
    '  npm run kill-port',
    '  npm run kill-port -- 3001',
  ].join('\n');
}

function main(): void {
  const argv = process.argv.slice(2);
  if (argv.includes('--help') || argv.includes('-h')) {
    // eslint-disable-next-line no-console
    console.log(usage());
    process.exit(0);
  }

  let port: number;
  try {
    port = parsePortArg(argv);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(String(err instanceof Error ? err.message : err));
    // eslint-disable-next-line no-console
    console.error(usage());
    process.exit(1);
  }

  const isWindows = process.platform === 'win32';
  const pids = isWindows
    ? getListeningPidsWindows(port)
    : getListeningPidsUnix(port);

  if (pids.length === 0) {
    // eslint-disable-next-line no-console
    console.log(`No listening process found on port ${port}.`);
    return;
  }

  for (const pid of pids) {
    try {
      if (isWindows) killPidWindows(pid);
      else killPidUnix(pid);
      // eslint-disable-next-line no-console
      console.log(`Killed PID ${pid} on port ${port}.`);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(
        `Failed to kill PID ${pid} on port ${port}: ${String(err)}`,
      );
      process.exitCode = 1;
    }
  }
}

main();
