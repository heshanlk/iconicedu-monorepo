import { list } from '@vercel/blob';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const rootDir = process.cwd();
const sha =
  process.env.VERCEL_GIT_COMMIT_SHA ||
  process.env.GITHUB_SHA ||
  process.env.GIT_COMMIT_SHA ||
  null;

if (!sha) {
  console.warn('Missing commit SHA (VERCEL_GIT_COMMIT_SHA or GITHUB_SHA). Skipping.');
  process.exit(0);
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

const fetchBlobUrl = async (artifactName) => {
  const prefix = `build-artifacts/${sha}/${artifactName}.tar.gz`;
  const result = await list({ prefix, limit: 1 });
  return result.blobs[0]?.url ?? null;
};

const restoreArtifact = async (artifact) => {
  if (fs.existsSync(artifact.distPath)) {
    return;
  }

  const blobUrl = await fetchBlobUrl(artifact.name);
  if (!blobUrl) {
    console.warn(`No blob found for ${artifact.name}.`);
    return;
  }

  const response = await fetch(blobUrl);
  if (!response.ok) {
    console.warn(`Failed to download ${artifact.name} artifact.`);
    return;
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const tarPath = path.join(os.tmpdir(), `${artifact.name}-${sha}.tar.gz`);
  fs.writeFileSync(tarPath, buffer);

  fs.mkdirSync(artifact.distPath, { recursive: true });
  execFileSync('tar', ['-xzf', tarPath, '-C', artifact.distPath], {
    stdio: 'inherit',
  });
  console.log(`Restored ${artifact.name} from blob.`);
};

for (const artifact of artifacts) {
  // eslint-disable-next-line no-await-in-loop
  await restoreArtifact(artifact);
}
