import { put } from '@vercel/blob';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const rootDir = process.cwd();
const sha =
  process.env.GITHUB_SHA ||
  process.env.VERCEL_GIT_COMMIT_SHA ||
  process.env.GIT_COMMIT_SHA ||
  null;

if (!sha) {
  console.error('Missing commit SHA (GITHUB_SHA or VERCEL_GIT_COMMIT_SHA).');
  process.exit(1);
}

const artifacts = [
  {
    name: 'shared-types',
    distPath: path.join(rootDir, 'packages', 'shared-types', 'dist'),
  },
  {
    name: 'ui-web',
    distPath: path.join(rootDir, 'packages', 'ui-web', 'dist'),
  },
];

const ensureTarExists = (tarPath) => {
  if (!fs.existsSync(tarPath)) {
    throw new Error(`Failed to create tarball at ${tarPath}`);
  }
};

const uploadArtifact = async (artifact) => {
  if (!fs.existsSync(artifact.distPath)) {
    throw new Error(`Missing build output at ${artifact.distPath}`);
  }

  const tarPath = path.join(os.tmpdir(), `${artifact.name}-${sha}.tar.gz`);
  execFileSync('tar', ['-czf', tarPath, '-C', artifact.distPath, '.'], {
    stdio: 'inherit',
  });
  ensureTarExists(tarPath);

  const blobName = `build-artifacts/${sha}/${artifact.name}.tar.gz`;
  const file = fs.readFileSync(tarPath);
  const blob = await put(blobName, file, {
    access: 'private',
    addRandomSuffix: false,
    contentType: 'application/gzip',
  });

  console.log(`Uploaded ${artifact.name}: ${blob.url}`);
};

for (const artifact of artifacts) {
  // eslint-disable-next-line no-await-in-loop
  await uploadArtifact(artifact);
}
