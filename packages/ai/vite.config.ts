import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

function deterministicStyleBundle(): Plugin {
  return {
    name: 'aheart-ai-deterministic-style-bundle',
    closeBundle() {
      const css = `${readFileSync(new URL('./src/style.css', import.meta.url), 'utf8').trimEnd()}\n`

      for (const file of ['es/style.css', 'lib/style.css']) {
        const target = new URL(`./${file}`, import.meta.url)
        if (existsSync(target)) writeFileSync(target, css)
      }
    }
  }
}

export default defineConfig({
  build: {
    target: 'modules',
    minify: false,
    rollupOptions: {
      external: (id) => id === 'vue' || id.startsWith('vue/') || id === 'aheart-ui',
      input: 'src/index.ts',
      output: [
        { format: 'es', exports: 'named', entryFileNames: '[name].js', preserveModules: true, dir: 'es', preserveModulesRoot: 'src' },
        { format: 'cjs', exports: 'named', entryFileNames: '[name].js', preserveModules: true, dir: 'lib', preserveModulesRoot: 'src' }
      ]
    },
    lib: { entry: './src/index.ts', name: 'AheartAI' }
  },
  plugins: [vue(), dts({ tsconfigPath: './tsconfig.json' }), dts({ outDir: 'lib', tsconfigPath: './tsconfig.json' }), deterministicStyleBundle()]
})
