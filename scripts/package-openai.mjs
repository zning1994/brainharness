import * as fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const inside = (root, file) => file === root || file.startsWith(root + path.sep);

// Build an allowlisted, materialized distribution without changing the source.
export async function packagePlugin(sourcePath, outputPath) {
  const source = await fs.realpath(sourcePath);
  const requested = path.resolve(outputPath);
  const output = path.join(await fs.realpath(path.dirname(requested)), path.basename(requested));
  if (inside(source, output)) throw new Error('Output must be outside source');
  try {
    await fs.lstat(output);
    throw new Error('Output already exists');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  const manifest = JSON.parse(await fs.readFile(path.join(source, 'plugin.json'), 'utf8'));
  const claude = JSON.parse(await fs.readFile(path.join(source, '.claude-plugin/plugin.json'), 'utf8'));
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(manifest.name) || !/^\d+\.\d+\.\d+$/.test(manifest.version)) {
    throw new Error('Invalid plugin name or version');
  }
  if (manifest.name !== claude.name || manifest.version !== claude.version) throw new Error('Plugin manifest mismatch');
  const entries = [];
  async function collect(relative, ancestors = new Set()) {
    if (relative.split(path.sep).some(part => part.startsWith('.'))) throw new Error(`Unexpected hidden resource: ${relative}`);
    const real = await fs.realpath(path.join(source, relative));
    if (!inside(source, real)) throw new Error(`Resource outside source: ${relative}`);
    if (path.relative(source, real).split(path.sep).some(part => part.startsWith('.'))) throw new Error(`Unexpected hidden target: ${relative}`);
    if (ancestors.has(real)) throw new Error(`Resource cycle: ${relative}`);
    const stat = await fs.stat(real);
    if (stat.isDirectory()) {
      const next = new Set([...ancestors, real]);
      for (const child of (await fs.readdir(real)).sort()) await collect(path.join(relative, child), next);
    } else if (stat.isFile()) {
      entries.push({ relative, bytes: await fs.readFile(real), mode: stat.mode & 0o111 ? 0o755 : 0o644 });
    } else throw new Error(`Unsupported resource: ${relative}`);
  }
  await collect('plugin.json');
  await collect(path.join('skills', manifest.name));
  const skill = entries.find(entry => entry.relative === path.join('skills', manifest.name, 'SKILL.md'));
  const header = skill?.bytes.toString('utf8').match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1];
  if (!header || !header.split(/\r?\n/).includes(`name: ${manifest.name}`) || !header.split(/\r?\n/).includes(`version: ${manifest.version}`)) {
    throw new Error('Missing or mismatched skill metadata');
  }
  for (const optional of ['LICENSE', 'CHANGELOG.md']) {
    try { await fs.lstat(path.join(source, optional)); }
    catch (error) { if (error.code === 'ENOENT') continue; throw error; }
    await collect(optional);
  }
  const repository = typeof manifest.repository === 'string' && /^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(manifest.repository)
    ? manifest.repository : null;
  const readme = `# ${manifest.name} ${manifest.version}\n\nGenerated OpenAI distribution. Do not edit this branch by hand.\n\nThe skill entry is [SKILL.md](skills/${manifest.name}/SKILL.md). Run bundled scripts from \`skills/${manifest.name}/\`; resources are relative to that directory.\n`
    + (repository ? `\nSee [source documentation](${repository}/blob/main/README.md) for usage and requirements.\n` : '');
  entries.push({ relative: 'README.md', bytes: Buffer.from(readme), mode: 0o644 });
  // Validate the entire input before reserving a new output directory.
  await fs.mkdir(output);
  for (const entry of entries) {
    const destination = path.join(output, entry.relative);
    await fs.mkdir(path.dirname(destination), { recursive: true });
    await fs.writeFile(destination, entry.bytes, { flag: 'wx', mode: entry.mode });
  }
  return { name: manifest.name, version: manifest.version, ref: `openai/v${manifest.version}`, files: entries.length, output };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  if (process.argv.length !== 4) {
    console.error('Usage: node scripts/package-openai.mjs SOURCE NEW_OUTPUT_DIRECTORY');
    process.exitCode = 1;
  } else {
    try { console.log(JSON.stringify(await packagePlugin(process.argv[2], process.argv[3]), null, 2)); }
    catch (error) { console.error(error.message); process.exitCode = 1; }
  }
}
