
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { defineConfig, type Plugin } from "vite";
import vue from "@vitejs/plugin-vue"
import dts from 'vite-plugin-dts'

import { componentEntries, fullStyleSources } from './build/entries.mjs'


function deterministicStyleBundle(): Plugin {
    return {
        name: 'aheart-deterministic-style-bundle',
        closeBundle() {
            const css = `${fullStyleSources
                .map((file) => readFileSync(new URL(`./src/${file}`, import.meta.url), 'utf8').trimEnd())
                .join('\n')}\n`

            for (const directory of ['es', 'lib']) {
                const emit = (file: string, contents: string) => {
                    const target = new URL(`./${directory}/${file}`, import.meta.url)
                    mkdirSync(new URL('.', target), { recursive: true })
                    writeFileSync(target, contents)
                }
                emit('style.css', css)
                emit('full.css', css)
                emit('theme.css', readFileSync(new URL('./src/theme/index.css', import.meta.url), 'utf8'))
                for (const entry of componentEntries) {
                    emit(`${entry.subpath}/style.css`, `${entry.styles.map((file: string) => readFileSync(new URL(`./src/${file}`, import.meta.url), 'utf8').trimEnd()).join('\n')}\n`)
                }
            }

            for (const source of fullStyleSources) {
                const output = source.replace(/\.css$/, '.css.js')
                const esTarget = new URL(`./es/${output}`, import.meta.url)
                const libTarget = new URL(`./lib/${output}`, import.meta.url)
                mkdirSync(new URL('.', esTarget), { recursive: true })
                mkdirSync(new URL('.', libTarget), { recursive: true })
                writeFileSync(esTarget, '')
                writeFileSync(libTarget, '"use strict";\n')
            }

            writeFileSync(new URL('./es/package.json', import.meta.url), '{\n  "type": "module",\n  "sideEffects": ["**/*.css"]\n}\n')
            writeFileSync(new URL('./lib/package.json', import.meta.url), '{\n  "type": "commonjs",\n  "sideEffects": ["**/*.css"]\n}\n')
        }
    }
}

export default defineConfig(
    {
        build: {
            target: 'modules',
            //打包文件目录
            outDir: "es",
            //压缩
            minify: false,
            //css分离
            //cssCodeSplit: true,
            rollupOptions: {
                //忽略打包vue文件
                external: ['vue', '@floating-ui/dom', '@lucide/vue', '@tanstack/vue-virtual', 'dayjs', /^dayjs\//],
                input: {
                    index: 'src/index.ts',
                    full: 'src/full.ts',
                    'constant/index': 'src/constant/index.ts',
                    'resolver/index': 'src/resolver/index.ts',
                    ...Object.fromEntries(componentEntries.map(({ subpath, sourceEntry }) => [`${subpath}/index`, sourceEntry])),
                    'message/index': 'src/message/index.ts',
                    'utils/floating': 'src/utils/floating.ts',
                    'utils/use-async-task': 'src/utils/use-async-task.ts',
                    'utils/use-collection': 'src/utils/use-collection.ts',
                    'utils/use-roving-focus': 'src/utils/use-roving-focus.ts',
                    'picker-core/index': 'src/picker-core/index.ts',
                    'date-picker/date-utils': 'src/date-picker/date-utils.ts'
                },
                output: [
                    {
                        format: 'es',
                        exports: 'named',
                        //不用打包成.es.js,这里我们想把它打包成.js
                        entryFileNames: '[name].js',
                        chunkFileNames: '[name].js',
                        //让打包目录和我们目录对应
                        preserveModules: true,
                        //配置打包根目录
                        dir: 'es',
                        preserveModulesRoot: 'src'
                    },
                    {
                        format: 'cjs',
                        exports: 'named',
                        entryFileNames: '[name].js',
                        chunkFileNames: '[name].js',
                        //让打包目录和我们目录对应
                        preserveModules: true,
                        //配置打包根目录
                        dir: 'lib',
                        preserveModulesRoot: 'src'
                    }
                ]
            },
            lib: {
                entry: './src/index.ts',
                name: 'AheartUI'
            }
        },
        plugins: [
            vue(),
            dts({
              tsconfigPath: './tsconfig.json'
            }),
            dts({
                outDir:'lib',
                tsconfigPath: './tsconfig.json'
            }),
            deterministicStyleBundle()
        ]
    }
)
