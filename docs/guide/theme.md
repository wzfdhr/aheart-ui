# 主题 Token

Aheart UI 当前使用 CSS 变量作为主题层。你可以在应用中覆盖这些变量，让组件贴合自己的品牌视觉。

```css
:root {
  --aheart-color-primary: #1677ff;
  --aheart-color-primary-hover: #4096ff;
  --aheart-color-success: #52c41a;
  --aheart-color-warning: #faad14;
  --aheart-color-danger: #ff4d4f;
  --aheart-color-text: #1f2329;
  --aheart-color-text-secondary: #646a73;
  --aheart-color-border: #d9d9d9;
  --aheart-color-bg: #ffffff;
  --aheart-color-bg-disabled: #f5f5f5;
  --aheart-font-size: 14px;
  --aheart-radius: 6px;
  --aheart-motion-duration: 0.2s;
}
```

在引入 Aheart UI 样式之后覆盖变量：

```css
:root {
  --aheart-color-primary: #0958d9;
  --aheart-radius: 4px;
}
```

## 暗色外观与减少动态效果

内置 token 是浅色默认值；文档站的暗色切换只改变文档外壳，不会为所有组件自动生成完整的暗色配色。应用需要暗色外观时，在 Aheart UI 样式之后按应用自己的主题标记覆盖变量，例如：

```css
html.dark {
  --aheart-color-text: #f0f2f5;
  --aheart-color-text-secondary: #aeb4bf;
  --aheart-color-text-disabled: #6f7682;
  --aheart-color-border: #414752;
  --aheart-color-border-secondary: #30343c;
  --aheart-color-fill: #272b32;
  --aheart-color-fill-secondary: #202329;
  --aheart-color-bg: #111318;
  --aheart-color-bg-elevated: #17191d;
  --aheart-color-bg-disabled: #202329;
  --aheart-color-bg-hover: #28384f;
}
```

检查弹层、禁用态、错误态和组件专属状态是否也符合应用配色；个别组件可能有自己的暗色规则，主题覆盖不等于完整的产品暗色主题。对于系统启用了 `prefers-reduced-motion: reduce` 的用户，基础动态时长 token 会自动变为 `0ms`。
