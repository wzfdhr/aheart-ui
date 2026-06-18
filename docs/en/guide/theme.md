# Theme Tokens

Aheart UI currently uses CSS variables as its theme layer. Override these variables in your app to align components with your brand.

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

Override variables after importing Aheart UI styles:

```css
:root {
  --aheart-color-primary: #0958d9;
  --aheart-radius: 4px;
}
```
