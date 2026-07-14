import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

const nodeCompatibleEsmPaths: Record<string, string> = {
  '@atlaskit/pragmatic-drag-and-drop/element/adapter': '@atlaskit/pragmatic-drag-and-drop/dist/cjs/entry-point/element/adapter.js',
  '@atlaskit/pragmatic-drag-and-drop/reorder': '@atlaskit/pragmatic-drag-and-drop/dist/cjs/entry-point/reorder.js'
}

function deterministicStyleBundle(): Plugin {
  return {
    name: 'aheart-dnd-deterministic-style-bundle',
    closeBundle() {
      const css = `${readFileSync(new URL('./src/style.css', import.meta.url), 'utf8').trimEnd()}\n`
      for (const file of ['es/style.css', 'lib/style.css']) {
        const target = new URL(`./${file}`, import.meta.url)
        if (existsSync(target)) writeFileSync(target, css)
      }
      writeFileSync(new URL('./es/package.json', import.meta.url), '{\n  "type": "module"\n}\n')
      writeFileSync(new URL('./lib/package.json', import.meta.url), '{\n  "type": "commonjs"\n}\n')
    }
  }
}

export default defineConfig({
  build: {
    target: 'modules',
    minify: false,
    rollupOptions: {
      external: (id) => id === 'vue' || id.startsWith('vue/') || id.startsWith('@atlaskit/pragmatic-drag-and-drop'),
      input: 'src/index.ts',
      output: [
        {
          format: 'es',
          exports: 'named',
          entryFileNames: '[name].js',
          preserveModules: true,
          dir: 'es',
          preserveModulesRoot: 'src',
          paths: (id) => nodeCompatibleEsmPaths[id] ?? id
        },
        { format: 'cjs', exports: 'named', entryFileNames: '[name].js', preserveModules: true, dir: 'lib', preserveModulesRoot: 'src' }
      ]
    },
    lib: { entry: './src/index.ts', name: 'AheartDnd' }
  },
  plugins: [vue(), dts({ outDir: 'es', tsconfigPath: './tsconfig.json' }), dts({ outDir: 'lib', tsconfigPath: './tsconfig.json' }), deterministicStyleBundle()]
})
