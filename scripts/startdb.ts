import { spawnSync } from 'node:child_process';

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

function main(): void {
  assertDockerEngineIsRunning();

  const result = spawnSync('docker', ['compose', 'up', '-d'], {
    stdio: 'inherit',
  });

  if (result.error) {
    throw result.error;
  }

  if (typeof result.status === 'number' && result.status !== 0) {
    process.exit(result.status);
  }
}

main();
