import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { entryInput, getComponentEntries } from '../build/package-entries.mjs'
import { splitPackageStyles } from '../build/split-styles.mjs'

const nodeCompatibleEsmPaths: Record<string, string> = {
  '@atlaskit/pragmatic-drag-and-drop/element/adapter': '@atlaskit/pragmatic-drag-and-drop/dist/cjs/entry-point/element/adapter.js',
  '@atlaskit/pragmatic-drag-and-drop/reorder': '@atlaskit/pragmatic-drag-and-drop/dist/cjs/entry-point/reorder.js',
  '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element': '@atlaskit/pragmatic-drag-and-drop-auto-scroll/dist/cjs/entry-point/element.js'
}

const entries = getComponentEntries('dnd')

export default defineConfig({
  build: {
    target: 'modules',
    minify: false,
    rollupOptions: {
      external: (id) => id === 'vue' || id.startsWith('vue/') || id.startsWith('@atlaskit/pragmatic-drag-and-drop'),
      input: entryInput(entries),
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
  plugins: [vue(), dts({ outDir: 'es', tsconfigPath: './tsconfig.json' }), dts({ outDir: 'lib', tsconfigPath: './tsconfig.json' }), splitPackageStyles(new URL('./', import.meta.url), 'dnd', entries)]
})
