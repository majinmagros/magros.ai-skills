---
name: ios-icon-gen
description: Generate iOS app icons as PNG imagesets for Xcode asset catalogs from SF Symbols (5000+ Apple-native) or Iconify API (275k+ open source icons from 200+ collections). Use when generating icons, creating icon assets, adding icons to asset catalog, or searching for icons for iOS projects.
metadata:
  origin: community
---

# iOS Icon Generator

Generate PNG icon imagesets for Xcode asset catalogs from two sources.

## When to Activate

- Generating icon assets for an iOS/macOS Xcode project
- Searching for icons across open source collections
- Creating PNG imagesets (1x, 2x, 3x) for asset catalogs
- Replacing placeholder icons with production-quality assets
- Matching existing icon styles in an Xcode project

## Core Principles

### 1. Two Sources, One Output Format
Both sources produce identical Xcode-compatible imagesets. Choose based on need:

| Source | Icons | Requires | Best for |
|--------|-------|----------|----------|
| **Iconify API** | 275,000+ from 200+ collections | Internet | Wide selection, specific styles, open source icons |
| **SF Symbols** | 5,000+ Apple symbols | macOS only | Apple-native style, offline use |

### 2. Always Match Existing Style
Before generating, check the project's existing icons for size, color, and weight consistency.

### 3. Output Structure
Both methods produce a complete Xcode imageset:

```
<output-dir>/<asset-name>.imageset/
  Contents.json
  <asset-name>.png        # 1x (68px default)
  <asset-name>@2x.png     # 2x (136px default)
  <asset-name>@3x.png     # 3x (204px default)
```

## Examples

### Step 1: Assess Requirements

Determine icon needs: what the icon represents, preferred style, target color, and size.

If the project already has icons, check existing style:
```bash
# Check dimensions of existing icon
sips -g pixelWidth -g pixelHeight path/to/existing@2x.png
```

### Step 2: Search for Icons

**Iconify API (recommended for wide selection):**
```bash
# Search all collections
$SKILL_DIR/scripts/iconify_gen.sh search "receipt"

# Search within a specific collection
$SKILL_DIR/scripts/iconify_gen.sh search "business card" --prefix mdi
