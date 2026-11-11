import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { entryInput, getComponentEntries } from '../build/package-entries.mjs'
import { splitPackageStyles } from '../build/split-styles.mjs'

const entries = getComponentEntries('ai')

export default defineConfig({
  build: {
    target: 'modules',
    minify: 'esbuild',
    rollupOptions: {
      external: (id) => id === 'vue' || id.startsWith('vue/') || id === 'aheart-ui' || (id === '@aheart-ui/dnd' || id.startsWith('@aheart-ui/dnd/')),
      input: entryInput(entries),
      output: [
        { format: 'es', exports: 'named', entryFileNames: '[name].js', preserveModules: true, dir: 'es', preserveModulesRoot: 'src' },
        { format: 'cjs', exports: 'named', entryFileNames: '[name].js', preserveModules: true, dir: 'lib', preserveModulesRoot: 'src' }
      ]
    },
    lib: { entry: './src/index.ts', name: 'AheartAI' }
  },
  plugins: [vue(), dts({ outDir: 'es', tsconfigPath: './tsconfig.json' }), dts({ outDir: 'lib', tsconfigPath: './tsconfig.json' }), splitPackageStyles(new URL('./', import.meta.url), 'ai', entries)]
})
