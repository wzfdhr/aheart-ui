# Steps <span class="aheart-status aheart-status--ready">Ready</span>

Steps communicates progress through a multi-step workflow.



## Basic Usage

<div class="aheart-demo-panel">
  <ASteps
    :current="1"
    :items="[
      { title: 'Finished', description: 'This step is complete.' },
      { title: 'In Progress', description: 'This step is active.' },
      { title: 'Waiting', description: 'This step is upcoming.' }
    ]"
  />
</div>

```vue
<template>
  <ASteps
    :current="1"
    :items="[
      { title: 'Finished', description: 'This step is complete.' },
      { title: 'In Progress', description: 'This step is active.' },
      { title: 'Waiting', description: 'This step is upcoming.' }
    ]"
  />
</template>
```

## verticaldirection

<div class="aheart-demo-panel">
  <ASteps
    direction="vertical"
    size="small"
    :current="1"
    :items="[
      { title: 'Account', description: 'Create the account.' },
      { title: 'Billing', description: 'Add billing details.' },
      { title: 'Confirm', description: 'Review and publish.' }
    ]"
  />
</div>

```vue
<template>
  <ASteps
    direction="vertical"
    size="small"
    :current="1"
    :items="[
      { title: 'Account', description: 'Create the account.' },
      { title: 'Billing', description: 'Add billing details.' },
      { title: 'Confirm', description: 'Review and publish.' }
    ]"
  />
</template>
```

## errorstatus

<div class="aheart-demo-panel">
  <ASteps
    :current="1"
    :items="[
      { title: 'Account' },
      { title: 'Billing', status: 'error', description: 'Payment method was declined.' },
      { title: 'Confirm', disabled: true }
    ]"
  />
</div>

```vue
<template>
  <ASteps
    :current="1"
    :items="[
      { title: 'Account' },
      { title: 'Billing', status: 'error', description: 'Payment method was declined.' },
      { title: 'Confirm', disabled: true }
    ]"
  />
</template>
```

## typecontent

<div class="aheart-demo-panel aheart-demo-stack">
  <ASteps
    type="navigation"
    :current="1"
    :items="[
      { title: 'Draft' },
      { title: 'Review' },
      { title: 'Publish' }
    ]"
  />
  <ASteps
    type="panel"
    :current="1"
    :items="[
      { title: 'Account', content: 'Collect the profile details.' },
      { title: 'Billing', content: 'Confirm the payment method.' },
      { title: 'Confirm', content: 'Review before publishing.' }
    ]"
  />
  <ASteps
    type="inline"
    :current="1"
    :items="[
      { title: 'Queued', subTitle: '09:00' },
      { title: 'Running', subTitle: 'Now' },
      { title: 'Done' }
    ]"
  />
</div>

```vue
<template>
  <ASteps type="navigation" :current="1" :items="steps" />
  <ASteps type="panel" :current="1" :items="stepsWithContent" />
  <ASteps type="inline" :current="1" :items="inlineSteps" />
</template>
```

## titleplacement

<div class="aheart-demo-panel">
  <ASteps
    type="dot"
    orientation="vertical"
    title-placement="vertical"
    :initial="3"
    :current="1"
    :items="[
      { title: 'Create', description: 'Dot mode uses compact markers.' },
      { title: 'Process', description: 'The active item keeps zero-based current.' },
      { title: 'Finish', description: 'Generated numbers are hidden for dot markers.' }
    ]"
  />
</div>

```vue
<template>
  <ASteps
    type="dot"
    orientation="vertical"
    title-placement="vertical"
    :initial="3"
    :current="1"
    :items="steps"
  />
</template>
```

## contentandcontent

<div class="aheart-demo-panel">
  <ASteps
    :current="1"
    :percent="65"
    :items="[
      { title: 'Profile', icon: 'A', subTitle: 'Ready', content: 'Profile fields are complete.' },
      { title: 'Billing', subTitle: '65%', description: 'Payment verification is running.', content: 'Waiting for provider confirmation.' },
      { title: 'Confirm', icon: 'C', subTitle: 'Next' }
    ]"
  />
</div>

```vue
<template>
  <ASteps
    :current="1"
    :percent="65"
    :items="[
      { title: 'Profile', icon: 'A', subTitle: 'Ready', content: 'Profile fields are complete.' },
      { title: 'Billing', subTitle: '65%', description: 'Payment verification is running.', content: 'Waiting for provider confirmation.' },
      { title: 'Confirm', icon: 'C', subTitle: 'Next' }
    ]"
  />
</template>
```

`StepItem` title, description, icon, subtitle, and extra content accept `VNodeChild`, so rendered nodes can be passed for richer labels, buttons, or icons.

## contentstyle

<div class="aheart-demo-panel">
  <ASteps
    root-class-name="steps-semantic-demo"
    :current="1"
    :class-names="{ activeItem: 'steps-semantic-demo__active', connector: 'steps-semantic-demo__connector' }"
    :styles="{
      root: { maxWidth: '720px' },
      item: { minWidth: '160px' },
      activeItem: { fontWeight: 700 },
      connector: { backgroundColor: 'var(--aheart-color-primary)' }
    }"
    :items="[
      { title: 'Configured', description: 'Root and item hooks are available.' },
      { title: 'Styled', description: 'The active item receives a dedicated hook.' },
      { title: 'Connected', description: 'Connector is a real semantic element.' }
    ]"
  />
</div>

```vue
<template>
  <ASteps
    root-class-name="steps-semantic-demo"
    :current="1"
    :class-names="{ activeItem: 'steps-semantic-demo__active', connector: 'steps-semantic-demo__connector' }"
    :styles="{ activeItem: { fontWeight: 700 }, connector: { backgroundColor: 'var(--aheart-color-primary)' } }"
    :items="steps"
  />
</template>
```

## API

| Property | Description | Type | Default |
| --- | --- | --- | --- |
| items | Configures `items`. | `StepItem[]` | `[]` |
| current | Configures `current`. | `number` | `0` |
| status | Configures `status`. | `wait` \| `process` \| `finish` \| `error` | `process` |
| direction | Configures `direction`. | `horizontal` \|`vertical` | `horizontal` |
| orientation | Configures `orientation`. | `horizontal` \|`vertical` | - |
| size | Configures `size`. | `large` \| `middle` \| `small` | ConfigProvider size |
| type | Configures `type`. | `default` \| `dot` \| `navigation` \| `panel` \| `inline` | `default` |
| titlePlacement | Configures `titlePlacement`. | `horizontal` \| `vertical` | `horizontal` |
| initial | Configures `initial`. | `number` | `1` |
| percent | Configures `percent`. | `number` | - |
| className | Configures `className`. | `string` | - |
| rootClassName | Configures `rootClassName`. | `string` | - |
| style | Configures `style`. | `StyleValue` | - |
| classNames | Configures `classNames`. | `Partial<Record<StepsSemanticPart, string>>` | - |
| styles | Configures `styles`. | `Partial<Record<StepsSemanticPart, StyleValue>>` | - |

### StepItem

| Field | Description | Type | Default |
| --- | --- | --- | --- |
| title | Configures `title`. | `VNodeChild` | - |
| description | Configures `description`. | `VNodeChild` | - |
| status | Configures `status`. | `wait` \| `process` \| `finish` \| `error` | content |
| disabled | Configures `disabled`. | `boolean` | `false` |
| icon | Configures `icon`. | `VNodeChild` | - |
| subTitle | Configures `subTitle`. | `VNodeChild` | - |
| content | Configures `content`. | `VNodeChild` | - |

### StepsSemanticPart

| value | Description |
| --- | --- |
| root | Provides the `root` entry. |
| item | Provides the `item` entry. |
| activeItem | Provides the `activeItem` entry. |
| button | Provides the `button` entry. |
| indicator | Provides the `indicator` entry. |
| icon | Provides the `icon` entry. |
| content | Provides the `content` entry. |
| title | Provides the `title` entry. |
| subTitle | Provides the `subTitle` entry. |
| description | Provides the `description` entry. |
| connector | Provides the `connector` entry. |

## Events

| Event | Description | Parameters |
| --- | --- | --- |
| change | Emitted when `change` occurs. | `(current: number) => void` |

## Theme Tokens

- `--aheart-color-primary`
- `--aheart-color-primary-hover`
- `--aheart-color-danger`
- `--aheart-color-text`
- `--aheart-color-text-secondary`
- `--aheart-color-border`
- `--aheart-control-height`
