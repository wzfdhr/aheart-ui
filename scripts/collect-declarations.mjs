import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

// A macOS copy onto an external volume may create AppleDouble files beside
// installed declarations. They are filesystem metadata, not package sources.
export const collectDeclarations = async (directory, ignoredMetadata = []) => {
  const entries = await readdir(directory, { withFileTypes: true })
  const ordinaryFiles = new Set(entries.filter(entry => entry.isFile()).map(entry => entry.name))
  const files = []
  for (const entry of entries) {
    const target = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...await collectDeclarations(target, ignoredMetadata))
    else if (entry.isFile() && entry.name.endsWith('.d.ts')) {
      if (entry.name.startsWith('._') && ordinaryFiles.has(entry.name.slice(2))) {
        const data = await readFile(target)
        if (data.length >= 26 && data.readUInt32BE(0) === 0x00051607 && data.readUInt32BE(4) === 0x00020000) {
          ignoredMetadata.push(target)
          continue
        }
      }
      files.push(target)
    }
  }
  return files.sort()
}
