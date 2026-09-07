# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: q3-form-controls.spec.ts >> coarse-pointer controls provide reachable touch targets and reveal cascader columns
- Location: e2e/q3-form-controls.spec.ts:204:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('[data-cascader-value="zhejiang"]')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - link "跳至正文" [ref=e4] [cursor=pointer]:
    - /url: "#VPContent"
  - banner:
    - generic:
      - generic:
        - generic:
          - link "Aheart UI" [ref=e6] [cursor=pointer]:
            - /url: /
            - generic [ref=e7]: Aheart UI
          - button "mobile navigation" [ref=e9] [cursor=pointer]
  - generic [ref=e15]:
    - button "菜单" [ref=e16] [cursor=pointer]:
      - generic [ref=e18]: 菜单
    - button "本页内容" [ref=e20] [cursor=pointer]: 本页内容
  - complementary [ref=e22]:
    - navigation "Sidebar Navigation" [ref=e23]:
      - generic [ref=e24]: Sidebar Navigation
      - link "组件总览" [ref=e31] [cursor=pointer]:
        - /url: /components/overview.html
        - paragraph [ref=e32]: 组件总览
      - button "设计基础 · 3 toggle section" [ref=e35] [cursor=pointer]:
        - heading "设计基础 · 3" [level=2] [ref=e37]
        - button "toggle section" [ref=e38]
      - button "通用构建 · 5 toggle section" [ref=e42] [cursor=pointer]:
        - heading "通用构建 · 5" [level=2] [ref=e44]
        - button "toggle section" [ref=e45]
      - button "导航与流程 · 5 toggle section" [ref=e49] [cursor=pointer]:
        - heading "导航与流程 · 5" [level=2] [ref=e51]
        - button "toggle section" [ref=e52]
      - generic [ref=e55]:
        - button "表单与选择 · 13 toggle section" [ref=e56] [cursor=pointer]:
          - heading "表单与选择 · 13" [level=2] [ref=e58]
          - button "toggle section" [ref=e59]
        - generic [ref=e61]:
          - link "Input 输入框" [ref=e65] [cursor=pointer]:
            - /url: /components/input.html
            - paragraph [ref=e66]: Input 输入框
          - link "Textarea 文本域" [ref=e70] [cursor=pointer]:
            - /url: /components/textarea.html
            - paragraph [ref=e71]: Textarea 文本域
          - link "InputNumber 数字输入框" [ref=e75] [cursor=pointer]:
            - /url: /components/input-number.html
            - paragraph [ref=e76]: InputNumber 数字输入框
          - link "Select 选择器" [ref=e80] [cursor=pointer]:
            - /url: /components/select.html
            - paragraph [ref=e81]: Select 选择器
          - link "Checkbox 复选框" [ref=e85] [cursor=pointer]:
            - /url: /components/checkbox.html
            - paragraph [ref=e86]: Checkbox 复选框
          - link "Radio 单选框" [ref=e90] [cursor=pointer]:
            - /url: /components/radio.html
            - paragraph [ref=e91]: Radio 单选框
          - link "Switch 开关" [ref=e95] [cursor=pointer]:
            - /url: /components/switch.html
            - paragraph [ref=e96]: Switch 开关
          - link "DatePicker 日期选择器" [ref=e100] [cursor=pointer]:
            - /url: /components/date-picker.html
            - paragraph [ref=e101]: DatePicker 日期选择器
          - link "TimePicker 时间选择器" [ref=e105] [cursor=pointer]:
            - /url: /components/time-picker.html
            - paragraph [ref=e106]: TimePicker 时间选择器
          - link "Cascader 级联选择" [ref=e110] [cursor=pointer]:
            - /url: /components/cascader.html
            - paragraph [ref=e111]: Cascader 级联选择
          - link "TreeSelect 树选择" [ref=e115] [cursor=pointer]:
            - /url: /components/tree-select.html
            - paragraph [ref=e116]: TreeSelect 树选择
          - link "Upload 上传" [ref=e120] [cursor=pointer]:
            - /url: /components/upload.html
            - paragraph [ref=e121]: Upload 上传
          - link "Form 表单" [ref=e125] [cursor=pointer]:
            - /url: /components/form.html
            - paragraph [ref=e126]: Form 表单
      - button "数据与状态 · 11 toggle section" [ref=e129] [cursor=pointer]:
        - heading "数据与状态 · 11" [level=2] [ref=e131]
        - button "toggle section" [ref=e132]
      - button "浮层与反馈 · 6 toggle section" [ref=e136] [cursor=pointer]:
        - heading "浮层与反馈 · 6" [level=2] [ref=e138]
        - button "toggle section" [ref=e139]
      - button "高级交互与工作区 · 2 toggle section" [ref=e143] [cursor=pointer]:
        - heading "高级交互与工作区 · 2" [level=2] [ref=e145]
        - button "toggle section" [ref=e146]
      - button "智能产品能力 · 3 toggle section" [ref=e150] [cursor=pointer]:
        - heading "智能产品能力 · 3" [level=2] [ref=e152]
        - button "toggle section" [ref=e153]
  - generic [ref=e159]:
    - navigation "组件定位" [ref=e160]:
      - generic [ref=e161]: 表单与选择
      - generic [ref=e162]: 任务组 · 采集与选择
      - generic [ref=e163]: aheart-ui
      - generic [ref=e164]:
        - generic [ref=e165]: 相关组件
        - link "Input" [ref=e166] [cursor=pointer]:
          - /url: /components/input
        - link "Textarea" [ref=e167] [cursor=pointer]:
          - /url: /components/textarea
        - link "InputNumber" [ref=e168] [cursor=pointer]:
          - /url: /components/input-number
        - link "Select" [ref=e169] [cursor=pointer]:
          - /url: /components/select
    - main [ref=e170]:
      - generic [ref=e172]:
        - heading "Cascader 级联选择 已完成 Permalink to \"Cascader 级联选择 <span class=\"aheart-status aheart-status--ready\">已完成</span>\"" [level=1] [ref=e173]:
          - text: Cascader 级联选择
          - generic [ref=e174]: 已完成
          - link "Permalink to \"Cascader 级联选择 <span class=\"aheart-status aheart-status--ready\">已完成</span>\"" [ref=e175] [cursor=pointer]:
            - /url: "#cascader-级联选择-已完成"
            - text: "#"
        - paragraph [ref=e176]: 从多级选项中选择一条或多条路径，支持搜索、禁用与按需加载。
        - heading "基础用法 Permalink to \"基础用法\"" [level=2] [ref=e177]:
          - text: 基础用法
          - link "Permalink to \"基础用法\"" [ref=e178] [cursor=pointer]:
            - /url: "#基础用法"
            - text: "#"
        - combobox [active] [ref=e181] [cursor=pointer]:
          - generic [ref=e182]: 选择地区
          - img [ref=e184]
        - generic [ref=e186]:
          - button "Copy Code" [ref=e187] [cursor=pointer]
          - generic [ref=e188]: vue
          - code [ref=e190]:
            - generic [ref=e191]: <ACascader v-model="value" :options="options" allow-clear />
        - paragraph [ref=e192]:
          - text: 单选值是完整路径：
          - code [ref=e193]: "['zhejiang', 'hangzhou', 'xihu']"
          - text: 。
        - heading "多选与搜索 Permalink to \"多选与搜索\"" [level=2] [ref=e194]:
          - text: 多选与搜索
          - link "Permalink to \"多选与搜索\"" [ref=e195] [cursor=pointer]:
            - /url: "#多选与搜索"
            - text: "#"
        - combobox [ref=e198] [cursor=pointer]:
          - generic [ref=e199]: 请选择
          - img [ref=e201]
        - generic [ref=e203]:
          - button "Copy Code" [ref=e204] [cursor=pointer]
          - generic [ref=e205]: vue
          - code [ref=e207]:
            - generic [ref=e208]: <ACascader v-model="values" :options="options" multiple show-search />
        - paragraph [ref=e209]:
          - text: 多选值是路径数组集合：
          - code [ref=e210]: "[['zhejiang', 'ningbo'], ['jiangsu', 'nanjing']]"
          - text: 。
        - heading "按需加载 Permalink to \"按需加载\"" [level=2] [ref=e211]:
          - text: 按需加载
          - link "Permalink to \"按需加载\"" [ref=e212] [cursor=pointer]:
            - /url: "#按需加载"
            - text: "#"
        - combobox [ref=e215] [cursor=pointer]:
          - generic [ref=e216]: 选择并加载地区
          - img [ref=e218]
        - generic [ref=e220]:
          - button "Copy Code" [ref=e221] [cursor=pointer]
          - generic [ref=e222]: vue
          - code [ref=e224]:
            - generic [ref=e225]: <script setup lang="ts">
            - generic [ref=e226]: "const options = [{ value: 'china', label: '中国', isLeaf: false }]"
            - generic [ref=e227]: "const loadData = async () => {"
            - generic [ref=e228]: await new Promise((resolve) => setTimeout(resolve, 350))
            - generic [ref=e229]: "return [{ value: 'shanghai', label: '上海' }]"
            - generic [ref=e230]: "}"
            - generic [ref=e231]: </script>
            - generic [ref=e232]: <template><ACascader :options="options" :load-data="loadData" /></template>
        - paragraph [ref=e233]:
          - text: 当选项设置
          - code [ref=e234]: "isLeaf: false"
          - text: 且未提供子节点时，组件调用
          - code [ref=e235]: loadData
          - text: 获取子节点。组件会显示加载状态，隔离切换路径、替换
          - code [ref=e236]: options
          - text: 、关闭面板或卸载后的过期响应；失败后显示“重试”，可再次点击或按 Enter 重试。数据请求和持久缓存仍由业务层负责。
        - heading "API Permalink to \"API\"" [level=2] [ref=e237]:
          - text: API
          - link "Permalink to \"API\"" [ref=e238] [cursor=pointer]:
            - /url: "#api"
            - text: "#"
        - table [ref=e239]:
          - rowgroup [ref=e240]:
            - row "属性 说明 类型 默认值" [ref=e241]:
              - columnheader "属性" [ref=e242]
              - columnheader "说明" [ref=e243]
              - columnheader "类型" [ref=e244]
              - columnheader "默认值" [ref=e245]
          - rowgroup [ref=e246]:
            - row "options 级联选项 CascaderOption[] []" [ref=e247]:
              - cell "options" [ref=e248]
              - cell "级联选项" [ref=e249]
              - cell "CascaderOption[]" [ref=e250]:
                - code [ref=e251]: CascaderOption[]
              - cell "[]" [ref=e252]:
                - code [ref=e253]: "[]"
            - row "modelValue 受控值；单选为路径，多选为路径集合 CascaderPath | CascaderPath[] -" [ref=e254]:
              - cell "modelValue" [ref=e255]
              - cell "受控值；单选为路径，多选为路径集合" [ref=e256]
              - cell "CascaderPath | CascaderPath[]" [ref=e257]:
                - code [ref=e258]: CascaderPath | CascaderPath[]
              - cell "-" [ref=e259]
            - row "defaultValue 非受控初始值 CascaderPath | CascaderPath[] -" [ref=e260]:
              - cell "defaultValue" [ref=e261]
              - cell "非受控初始值" [ref=e262]
              - cell "CascaderPath | CascaderPath[]" [ref=e263]:
                - code [ref=e264]: CascaderPath | CascaderPath[]
              - cell "-" [ref=e265]
            - row "multiple 是否多选 boolean false" [ref=e266]:
              - cell "multiple" [ref=e267]
              - cell "是否多选" [ref=e268]
              - cell "boolean" [ref=e269]:
                - code [ref=e270]: boolean
              - cell "false" [ref=e271]:
                - code [ref=e272]: "false"
            - row "showSearch 是否显示搜索框 boolean false" [ref=e273]:
              - cell "showSearch" [ref=e274]
              - cell "是否显示搜索框" [ref=e275]
              - cell "boolean" [ref=e276]:
                - code [ref=e277]: boolean
              - cell "false" [ref=e278]:
                - code [ref=e279]: "false"
            - row "placeholder 无选中值时的提示文字 string 请选择" [ref=e280]:
              - cell "placeholder" [ref=e281]
              - cell "无选中值时的提示文字" [ref=e282]
              - cell "string" [ref=e283]:
                - code [ref=e284]: string
              - cell "请选择" [ref=e285]:
                - code [ref=e286]: 请选择
            - row "disabled 是否禁用 boolean false" [ref=e287]:
              - cell "disabled" [ref=e288]
              - cell "是否禁用" [ref=e289]
              - cell "boolean" [ref=e290]:
                - code [ref=e291]: boolean
              - cell "false" [ref=e292]:
                - code [ref=e293]: "false"
            - row "allowClear 是否允许清除当前路径 boolean false" [ref=e294]:
              - cell "allowClear" [ref=e295]
              - cell "是否允许清除当前路径" [ref=e296]
              - cell "boolean" [ref=e297]:
                - code [ref=e298]: boolean
              - cell "false" [ref=e299]:
                - code [ref=e300]: "false"
            - row "maxTagCount 多选模式最多展示的路径标签数量 number -" [ref=e301]:
              - cell "maxTagCount" [ref=e302]
              - cell "多选模式最多展示的路径标签数量" [ref=e303]
              - cell "number" [ref=e304]:
                - code [ref=e305]: number
              - cell "-" [ref=e306]
            - row "open 受控浮层状态 boolean -" [ref=e307]:
              - cell "open" [ref=e308]
              - cell "受控浮层状态" [ref=e309]
              - cell "boolean" [ref=e310]:
                - code [ref=e311]: boolean
              - cell "-" [ref=e312]
            - row "defaultOpen 非受控初始展开状态 boolean false" [ref=e313]:
              - cell "defaultOpen" [ref=e314]
              - cell "非受控初始展开状态" [ref=e315]
              - cell "boolean" [ref=e316]:
                - code [ref=e317]: boolean
              - cell "false" [ref=e318]:
                - code [ref=e319]: "false"
            - row "placement 浮层位置 topLeft | topRight | bottomLeft | bottomRight bottomLeft" [ref=e320]:
              - cell "placement" [ref=e321]
              - cell "浮层位置" [ref=e322]
              - cell "topLeft | topRight | bottomLeft | bottomRight" [ref=e323]:
                - code [ref=e324]: topLeft
                - text: "|"
                - code [ref=e325]: topRight
                - text: "|"
                - code [ref=e326]: bottomLeft
                - text: "|"
                - code [ref=e327]: bottomRight
              - cell "bottomLeft" [ref=e328]:
                - code [ref=e329]: bottomLeft
            - row "autoAdjustOverflow 是否自动翻转与避让 boolean true" [ref=e330]:
              - cell "autoAdjustOverflow" [ref=e331]
              - cell "是否自动翻转与避让" [ref=e332]
              - cell "boolean" [ref=e333]:
                - code [ref=e334]: boolean
              - cell "true" [ref=e335]:
                - code [ref=e336]: "true"
            - 'row "getPopupContainer 自定义浮层挂载容器 (triggerNode: HTMLElement) => HTMLElement document.body" [ref=e337]':
              - cell "getPopupContainer" [ref=e338]
              - cell "自定义浮层挂载容器" [ref=e339]
              - 'cell "(triggerNode: HTMLElement) => HTMLElement" [ref=e340]':
                - code [ref=e341]: "(triggerNode: HTMLElement) => HTMLElement"
              - cell "document.body" [ref=e342]:
                - code [ref=e343]: document.body
            - 'row "loadData 按需加载子节点；第二参数提供当前请求的 AbortSignal (option, { signal }) => Promise<CascaderOption[]> -" [ref=e344]':
              - cell "loadData" [ref=e345]
              - cell "按需加载子节点；第二参数提供当前请求的 AbortSignal" [ref=e346]:
                - text: 按需加载子节点；第二参数提供当前请求的
                - code [ref=e347]: AbortSignal
              - 'cell "(option, { signal }) => Promise<CascaderOption[]>" [ref=e348]':
                - code [ref=e349]: "(option, { signal }) => Promise<CascaderOption[]>"
              - cell "-" [ref=e350]
        - paragraph [ref=e351]:
          - code [ref=e352]: CascaderOption
          - text: 包含
          - code [ref=e353]: value
          - text: 、
          - code [ref=e354]: label
          - text: 、可选的
          - code [ref=e355]: children
          - text: 、
          - code [ref=e356]: disabled
          - text: 与
          - code [ref=e357]: isLeaf
          - text: 。
        - paragraph [ref=e358]:
          - code [ref=e359]: loadData
          - text: 仍兼容只接收
          - code [ref=e360]: option
          - text: 的旧回调。需要主动取消网络请求时，可读取
          - code [ref=e361]: context?.signal
          - text: ；组件会在切换路径、替换
          - code [ref=e362]: options
          - text: 、关闭或禁用浮层以及卸载时将当前请求标记为
          - code [ref=e363]: aborted
          - text: 。迟到的成功或失败结果不会修改新的路径状态，也不会抢回键盘焦点。
        - table [ref=e364]:
          - rowgroup [ref=e365]:
            - row "事件 说明" [ref=e366]:
              - columnheader "事件" [ref=e367]
              - columnheader "说明" [ref=e368]
          - rowgroup [ref=e369]:
            - row "update:modelValue 选择值变化" [ref=e370]:
              - cell "update:modelValue" [ref=e371]
              - cell "选择值变化" [ref=e372]
            - row "change 选择值变化" [ref=e373]:
              - cell "change" [ref=e374]
              - cell "选择值变化" [ref=e375]
            - row "openChange 浮层状态请求变化" [ref=e376]:
              - cell "openChange" [ref=e377]
              - cell "浮层状态请求变化" [ref=e378]
            - row "clear 清除当前值" [ref=e379]:
              - cell "clear" [ref=e380]
              - cell "清除当前值" [ref=e381]
    - contentinfo [ref=e382]:
      - paragraph [ref=e385]:
        - text: "最后更新:"
        - time [ref=e386]: 9/7/26, 6:06 PM
      - navigation "Pager" [ref=e387]:
        - generic [ref=e388]: Pager
        - link "上一页 TimePicker 时间选择器" [ref=e390] [cursor=pointer]:
          - /url: /components/time-picker.html
          - generic [ref=e391]: 上一页
          - generic [ref=e392]: TimePicker 时间选择器
        - link "下一页 TreeSelect 树选择" [ref=e394] [cursor=pointer]:
          - /url: /components/tree-select.html
          - generic [ref=e395]: 下一页
          - generic [ref=e396]: TreeSelect 树选择
```

# Test source

```ts
  146 |   const lazy = page.locator('.aheart-demo-panel').nth(2).locator('.aheart-cascader')
  147 |   await lazy.getByRole('combobox').click()
  148 |   const option = page.locator('[data-cascader-value="china"]')
  149 |   await option.click()
  150 |   await expect(option).toHaveAttribute('aria-busy', 'true')
  151 |   await expect(option.locator('.aheart-icon--spin')).toBeVisible()
  152 |   await expect(page.locator('[data-cascader-value="shanghai"]')).toBeVisible()
  153 |   await expect(option).not.toHaveAttribute('aria-busy', 'true')
  154 | })
  155 | 
  156 | test('Q3 controls preserve sizing, status colors, theme states, and visible keyboard focus', async ({ page }) => {
  157 |   await page.goto('/components/select')
  158 |   await waitForHydration(page)
  159 |   const select = page.locator('.aheart-demo-panel').first().locator('.aheart-select')
  160 |   const selectSizing = await select.evaluate((element) => {
  161 |     const root = element.getBoundingClientRect()
  162 |     const selector = element.querySelector('.aheart-select__selector')!.getBoundingClientRect()
  163 |     return { root: root.width, selector: selector.width }
  164 |   })
  165 |   expect(Math.abs(selectSizing.root - selectSizing.selector)).toBeLessThanOrEqual(1)
  166 |   await select.evaluate((element) => {
  167 |     element.classList.remove('aheart-select--outlined')
  168 |     element.classList.add('aheart-select--underlined', 'aheart-select--error')
  169 |   })
  170 |   await expect(select.locator('.aheart-select__selector')).toHaveCSS('border-bottom-color', 'rgb(255, 77, 79)')
  171 | 
  172 |   await page.goto('/components/textarea')
  173 |   const textarea = page.locator('.aheart-demo-panel').first().locator('.aheart-textarea')
  174 |   await textarea.evaluate((element) => {
  175 |     element.classList.remove('aheart-textarea--outlined')
  176 |     element.classList.add('aheart-textarea--underlined', 'aheart-textarea--error')
  177 |   })
  178 |   await expect(textarea.locator('textarea')).toHaveCSS('border-bottom-color', 'rgb(255, 77, 79)')
  179 | 
  180 |   await page.goto('/components/input-number')
  181 |   const inputNumber = page.locator('.aheart-demo-panel').first().locator('.aheart-input-number').first()
  182 |   await inputNumber.evaluate((element) => {
  183 |     element.classList.remove('aheart-input-number--outlined')
  184 |     element.classList.add('aheart-input-number--underlined', 'aheart-input-number--error')
  185 |   })
  186 |   await expect(inputNumber).toHaveCSS('border-bottom-color', 'rgb(255, 77, 79)')
  187 | 
  188 |   await page.goto('/components/checkbox')
  189 |   const checkbox = page.locator('.aheart-demo-panel').first().getByRole('checkbox').first()
  190 |   await checkbox.focus()
  191 |   const focusShadow = await checkbox.evaluate((element) =>
  192 |     getComputedStyle(element.nextElementSibling as HTMLElement).boxShadow
  193 |   )
  194 |   expect(focusShadow).not.toBe('none')
  195 | 
  196 |   const tokens = await page.evaluate(() => {
  197 |     const style = getComputedStyle(document.documentElement)
  198 |     return ['--aheart-color-border-secondary', '--aheart-color-fill-secondary', '--aheart-color-primary-bg', '--aheart-color-text-disabled']
  199 |       .map((name) => style.getPropertyValue(name).trim())
  200 |   })
  201 |   expect(tokens.every(Boolean)).toBe(true)
  202 | })
  203 | 
  204 | test('coarse-pointer controls provide reachable touch targets and reveal cascader columns', async ({ page }) => {
  205 |   test.skip(!await page.evaluate(() => matchMedia('(pointer: coarse)').matches), 'Mobile coarse-pointer coverage')
  206 | 
  207 |   const expectTouchTarget = async (selector: string) => {
  208 |     const size = await page.locator(selector).first().evaluate((element) => {
  209 |       const rect = element.getBoundingClientRect()
  210 |       return { width: rect.width, height: rect.height }
  211 |     })
  212 |     expect(size.width).toBeGreaterThanOrEqual(44)
  213 |     expect(size.height).toBeGreaterThanOrEqual(44)
  214 |   }
  215 | 
  216 |   await page.goto('/components/input-number')
  217 |   await expectTouchTarget('.aheart-input-number__increase')
  218 | 
  219 |   await page.goto('/components/checkbox')
  220 |   await expectTouchTarget('.aheart-checkbox')
  221 | 
  222 |   await page.goto('/components/textarea')
  223 |   await expectTouchTarget('.aheart-textarea__clear')
  224 | 
  225 |   await page.goto('/components/time-picker')
  226 |   await waitForHydration(page)
  227 |   await page.locator('.aheart-demo-panel').nth(2).getByRole('combobox').focus()
  228 |   const timePanel = page.locator('.aheart-time-picker__panel')
  229 |   await expect(timePanel).toHaveClass(/is-entered/)
  230 |   await expect.poll(() => timePanel.evaluate((element) => getComputedStyle(element).transform)).toBe('matrix(1, 0, 0, 1, 0, 0)')
  231 |   await expectTouchTarget('.aheart-time-picker__footer button')
  232 | 
  233 |   await page.goto('/components/tree-select')
  234 |   await expectTouchTarget('.aheart-tree-select__trigger')
  235 |   await page.locator('.aheart-demo-panel').first().getByRole('combobox').click()
  236 |   const treePanel = page.locator('.aheart-tree-select__panel')
  237 |   await expect(treePanel).toHaveClass(/is-entered/)
  238 |   await expect.poll(() => treePanel.evaluate((element) => getComputedStyle(element).transform)).toBe('matrix(1, 0, 0, 1, 0, 0)')
  239 |   await expectTouchTarget('.aheart-tree__node')
  240 | 
  241 |   await page.goto('/components/cascader')
  242 |   const cascader = page.locator('.aheart-demo-panel').first().locator('.aheart-cascader')
  243 |   await expectTouchTarget('.aheart-cascader__trigger')
  244 |   await cascader.getByRole('combobox').click()
  245 |   const columns = page.locator('.aheart-cascader__columns')
> 246 |   await page.locator('[data-cascader-value="zhejiang"]').click()
      |                                                          ^ Error: locator.click: Test timeout of 30000ms exceeded.
  247 |   await page.locator('[data-cascader-value="hangzhou"]').click()
  248 |   await expect.poll(() => columns.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0)
  249 | 
  250 |   await page.goto('/components/select')
  251 |   await expectTouchTarget('.aheart-select__selector')
  252 | })
  253 | 
```