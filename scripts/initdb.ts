import { spawn, spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const DB_SERVICE = 'db';
const ROOT_USER = 'root';
const ROOT_PASSWORD = 'devroot';

function assertDockerEngineIsRunning(): void {
  const check = spawnSync('docker', ['info'], { stdio: 'ignore' });

  if (check.error) {
    throw check.error;
  }

  if (typeof check.status === 'number' && check.status !== 0) {
    throw new Error(
      'Docker est installé mais le moteur ne répond pas. Démarrez Docker Desktop (Linux containers) puis réessayez.',
    );
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runDocker(
  args: string[],
  options?: { stdin?: string },
): Promise<{ exitCode: number }> {
  return new Promise((resolve, reject) => {
    const child = spawn('docker', args, {
      stdio: ['pipe', 'inherit', 'inherit'],
    });

    child.on('error', reject);

    if (options?.stdin) {
      child.stdin.write(options.stdin);
    }
    child.stdin.end();

    child.on('close', (code) => {
      resolve({ exitCode: code ?? 1 });
    });
  });
}

async function waitForDbReady(): Promise<void> {
  const startedAt = Date.now();
  const timeoutMs = 60_000;

  while (Date.now() - startedAt < timeoutMs) {
    const { exitCode } = await runDocker([
      'compose',
      'exec',
      '-T',
      DB_SERVICE,
      'mariadb-admin',
      'ping',
      '-h',
      'localhost',
      `-u${ROOT_USER}`,
      `-p${ROOT_PASSWORD}`,
    ]);

    if (exitCode === 0) return;

    await sleep(1500);
  }

  throw new Error(
    'La base MariaDB ne répond pas après 60s. Vérifiez Docker Desktop et le conteneur.',
  );
}

async function applySqlFile(sqlFileRelativePath: string): Promise<void> {
  const sqlPath = path.resolve(process.cwd(), sqlFileRelativePath);
  const sql = await readFile(sqlPath, 'utf-8');

  const { exitCode } = await runDocker(
    [
      'compose',
      'exec',
      '-T',
      DB_SERVICE,
      'mariadb',
      `-u${ROOT_USER}`,
      `-p${ROOT_PASSWORD}`,
    ],
    { stdin: sql },
  );

  if (exitCode !== 0) {
    throw new Error(`Échec de l\'initialisation SQL (exitCode=${exitCode}).`);
  }
}

async function main(): Promise<void> {
  assertDockerEngineIsRunning();
  await waitForDbReady();
  await applySqlFile('sql/init.sql');
}

main().catch((error) => {
  const message =
    error instanceof Error ? (error.stack ?? error.message) : String(error);
  process.stderr.write(`${message}\n`);
  process.exit(1);
});
