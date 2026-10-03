import test from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { packagePlugin } from './package-openai.mjs';

async function fixture() {
  const base = await fs.mkdtemp(path.join(os.tmpdir(), 'brainharness-package-'));
  const source = path.join(base, 'source');
  await fs.mkdir(path.join(source, 'skills/demo'), { recursive: true });
  await fs.mkdir(path.join(source, '.claude-plugin'));
  const manifest = { name: 'demo', version: '1.0.0' };
  await fs.writeFile(path.join(source, 'plugin.json'), JSON.stringify(manifest));
  await fs.writeFile(path.join(source, '.claude-plugin/plugin.json'), JSON.stringify(manifest));
  await fs.writeFile(path.join(source, 'SKILL.md'), '---\nname: demo\nversion: 1.0.0\n---\n中文技能\n');
  await fs.symlink('../../SKILL.md', path.join(source, 'skills/demo/SKILL.md'));
  return { base, source, output: path.join(base, 'output') };
}

test('materializes resources and excludes unrelated repository files', async () => {
  const { source, output } = await fixture();
  await fs.mkdir(path.join(source, 'references'));
  await fs.writeFile(path.join(source, 'references/guide.md'), '参考资料');
  await fs.symlink('../../references', path.join(source, 'skills/demo/references'));
  await fs.writeFile(path.join(source, '.env'), 'not for publication');
  const result = await packagePlugin(source, output);
  assert.equal(result.ref, 'openai/v1.0.0');
  assert.equal((await fs.lstat(path.join(output, 'skills/demo/SKILL.md'))).isSymbolicLink(), false);
  assert.equal(await fs.readFile(path.join(output, 'skills/demo/references/guide.md'), 'utf8'), '参考资料');
  assert.deepEqual((await fs.readdir(output)).sort(), ['README.md', 'plugin.json', 'skills']);
});

test('rejects symlinks outside the source without creating output', async () => {
  const { base, source, output } = await fixture();
  await fs.writeFile(path.join(base, 'outside'), 'private');
  await fs.symlink('../../../outside', path.join(source, 'skills/demo/leak'));
  await assert.rejects(packagePlugin(source, output), /outside source/);
  await assert.rejects(fs.stat(output), { code: 'ENOENT' });
});

test('rejects cycles and hidden resource files', async () => {
  const a = await fixture();
  await fs.symlink('.', path.join(a.source, 'skills/demo/loop'));
  await assert.rejects(packagePlugin(a.source, a.output), /cycle/);
  const b = await fixture();
  await fs.writeFile(path.join(b.source, 'skills/demo/.env'), 'private');
  await assert.rejects(packagePlugin(b.source, b.output), /hidden/);
});

test('rejects mismatched versions and missing skill entry', async () => {
  const a = await fixture();
  await fs.writeFile(path.join(a.source, 'plugin.json'), '{"name":"demo","version":"2.0.0"}');
  await assert.rejects(packagePlugin(a.source, a.output), /manifest mismatch/);
  const b = await fixture();
  await fs.writeFile(path.join(b.source, 'SKILL.md'), '---\nname: demo\nversion: 2.0.0\n---');
  await assert.rejects(packagePlugin(b.source, b.output), /skill metadata/);
});

test('never overwrites a destination or writes inside source', async () => {
  const a = await fixture();
  await fs.mkdir(a.output);
  await fs.writeFile(path.join(a.output, 'keep'), 'user data');
  await assert.rejects(packagePlugin(a.source, a.output), /exists/);
  assert.equal(await fs.readFile(path.join(a.output, 'keep'), 'utf8'), 'user data');
  await assert.rejects(packagePlugin(a.source, path.join(a.source, 'dist')), /outside source/);
});

test('writes distribution instructions instead of broken source-relative links', async () => {
  const { source, output } = await fixture();
  await fs.writeFile(path.join(source, 'README.md'), '[Missing](examples/not-packaged.md)');
  await packagePlugin(source, output);
  const readme = await fs.readFile(path.join(output, 'README.md'), 'utf8');
  assert.match(readme, /skills\/demo\/SKILL.md/);
  assert.doesNotMatch(readme, /not-packaged/);
});
