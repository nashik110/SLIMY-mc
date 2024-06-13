const fs = require('fs/promises');
const path = require('path');

async function loadFiles(dirName) {
  const files = [];

  async function readFilesRecursively(directory) {
    const entries = await fs.readdir(directory);

    for (const entry of entries) {
      const entryPath = path.join(directory, entry);
      const stats = await fs.stat(entryPath);

      if (stats.isDirectory()) {
        await readFilesRecursively(entryPath);
      } else if (stats.isFile() && entry.endsWith('.js')) {
        files.push(entryPath);
        delete require.cache[require.resolve(entryPath)];
      }
    }
  }

  await readFilesRecursively(path.join(process.cwd(), dirName.replace(/\\/g, '/')));

  return files;
}

module.exports = { loadFiles };