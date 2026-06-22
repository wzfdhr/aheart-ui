
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { defineConfig, type Plugin } from "vite";
import vue from "@vitejs/plugin-vue"
import dts from 'vite-plugin-dts'

const styleSourceFiles = [
    'theme/index.css',
    'button/style.css',
    'config-provider/style.css',
    'space/style.css',
    'divider/style.css',
    'flex/style.css',
    'grid/style.css',
    'icon/style.css',
    'typography/style.css',
    'tag/style.css',
    'badge/style.css',
    'alert/style.css',
    'message/style.css',
    'modal/style.css',
    'drawer/style.css',
    'utils/floating.css',
    'tooltip/style.css',
    'popover/style.css',
    'popconfirm/style.css',
    'spin/style.css',
    'skeleton/style.css',
    'empty/style.css',
    'breadcrumb/style.css',
    'dropdown/style.css',
    'menu/style.css',
    'tabs/style.css',
    'steps/style.css',
    'input/style.css',
    'textarea/style.css',
    'input-number/style.css',
    'checkbox/style.css',
    'radio/style.css',
    'switch/style.css',
    'card/style.css',
    'descriptions/style.css',
    'pagination/style.css',
    'select/style.css',
    'form/style.css',
    'table/style.css'
]

function deterministicStyleBundle(): Plugin {
    return {
        name: 'aheart-deterministic-style-bundle',
        closeBundle() {
            const css = `${styleSourceFiles
                .map((file) => readFileSync(new URL(`./src/${file}`, import.meta.url), 'utf8').trimEnd())
                .join('\n')}\n`

            for (const file of ['es/style.css', 'lib/style.css']) {
                const target = new URL(`./${file}`, import.meta.url)

                if (existsSync(target)) {
                    writeFileSync(target, css)
                }
            }
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
                external: ['vue'],
                input: ['src/index.ts'],
                output: [
                    {
                        format: 'es',
                        exports: 'named',
                        //不用打包成.es.js,这里我们想把它打包成.js
                        entryFileNames: '[name].js',
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
