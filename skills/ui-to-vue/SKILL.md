---
name: ui-to-vue
description: Use when the user has UI screenshots or design exports that need batch conversion into Vue 3 components, especially with Vant, Element Plus, or Ant Design Vue.
metadata:
  origin: community
---

# UI To Vue

Batch-convert UI design screenshots into Vue 3 Composition API component code.

## When to Use

- The user provides a directory of design screenshots or design-export images.
- The target application is Vue 3.
- The user wants a first pass of page components, shared components, and router wiring.
- The user specifies Vant, Element Plus, or Ant Design Vue as the component library.

## When Not to Use

- The user has only one screenshot and wants a bespoke component.
- The target project is not Vue.
- The design requires detailed interaction logic, data flow, or accessibility review.
- The screenshots contain private customer data that cannot be sent to an external model API.

## Inputs

Use an input directory that groups screenshots by module and page state:

```text
screenshots/
|-- HomePage/
|   |-- List/
|   |   |-- HomePage-List-Default@3x.png
|   |   `-- cut-images/
|   |-- cut-images/
|   `-- HomePage-Default@3x.png
`-- cut-images/
```

Supported cut-image directory names include `assets`, `icons`, `sprites`, `cut`, `images`, and `cut-images`.

## Conversion Model

- Page grouping: combine related screenshots into one page component when they represent list, detail, form, loading, or empty states.
- UI library mapping: map native visual elements to Vant, Element Plus, or Ant Design Vue components where practical.
- Cut-image priority: prefer page-level assets, then module-level assets, then global shared assets.
- Component extraction: extract repeated UI regions into shared components when they appear more than once.

## CLI Usage

Run the converter with `npx` so the documented command works without relying on a global binary:

```bash
export DASHSCOPE_API_KEY=your_key
npx ui-to-vue-converter@1.0.2 --input ./screenshots --ui vant --output ./src
```

For desktop UI libraries:

```bash
npx ui-to-vue-converter@1.0.2 --input ./designs --ui element-plus --output ./src
npx ui-to-vue-converter@1.0.2 --input ./designs --ui antd-vue --output ./src
```
