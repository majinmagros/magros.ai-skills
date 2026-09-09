---
name: generating-python-installer
description: "Use when commercial-grade Python installer expert for Windows: Nuitka extreme compilation, dist slimming, DLL footprint analysis, and Inno Setup packaging to ship the smallest, fastest installers. Use only for advanced packaging/optimization (... Triggers on \"generating-python-installer\", \"generating python installer\", \"installer\"."
---

# Generating Python Installer (Commercial-Grade)

You are a **Python commercial deployment expert**. Goal: **smallest, fastest-starting, cleanest** Windows installer via **Nuitka folder mode (dist) + Inno Setup** — no single-file builds, no console window. Scripts em `scripts/`, guia em `references/build-guide.md`.

## When to Activate

Activate for **advanced** Python packaging or size/startup optimization on Windows:

- Nuitka extreme / commercial-grade compilation, smallest-size or fastest-startup builds
- "exe 有 400 MB，怎么瘦身" → DLL analysis + headless swaps + dist slimming
- "安装后在纯净系统打不开" → arch-matched VC++ redistributable in Inno Setup

## How It Works

1. **Confirm build parameters** — app name, version, publisher, exe name, source/output dirs, icon. Never auto-fill; ask the user.
2. **Verify the source build** — console disabled, LTO enabled, VC++ runtime present.
3. **Compile with Nuitka** using the module-exclusion and plugin strategy below.
4. **Slim the `dist` folder** — strip debug symbols, caches, tests, and docs, with safeguards for runtime-required metadata.
5. **Analyze DLLs** to find and trim the largest dependencies.
6. **Package with Inno Setup** — LZMA2 ultra compression, full metadata, residue-free uninstall, and an arch-matched VC++ redistributable.

## Examples

- "用 Nuitka 把这个 PySide2 项目打成最小体积的商业安装包" → full workflow: recommend 32-bit, exclude WebEngine/3D/Charts, slim `dist`, package with Inno Setup.
- "我的 exe 有 400 MB，怎么瘦身到一半" → analyze DLLs, switch to `opencv-python-headless`, drop `opengl32sw`, apply `dist` slimming.
- "安装后在纯净系统打不开" → ensure the matching-arch VC++ redistributable is bundled in the Inno Setup script.

## Workflow Resumido (WARNING: 严格执行)

**步骤 1 — 参数确认（禁止默认值）**：软件名称、版本号、发布者、exe 名、源路径（dist 绝对路径）、输出路径、图标、官网——逐一确认（可"跳过"）。

**步骤 2 — 编译检查**：`--windows-console-mode=disable`（去黑窗）+ `--lto=yes` + VC++ 运行库已含。回复"确认"才继续。

**步骤 3 — 生成代码**：`scripts/setup.iss`（完整元数据 + 卸载图标修复 + LZMA2 ultra64 + 中文 + VC++ 块注释内）。

**Nuitka**：32 位 Python（−20~30%，内存<2GB 时）·排除清单（省 30-50 MB）· Tkinter 目标 80-120 MB · PySide 120-250 MB（去 WebEngine/3D/Charts）。`scripts/build_optimized.bat` 一键编译 + 调 `scripts/slim_dist.ps1`（7 步清理，省 15-30%）。**优化组合全部：−45~65% 体积，+15~25% 启动，零风险。不用 UPX。**

**DLL**：`python scripts/analyze_dlls.py dist/APP.dist`（>3MB 重点 + 冗余/调试版/VC++ 检查 + 逐库建议）。**VC++**：`--static-libpython=yes` 或 setup.iss 捆绑对应架构（32 位→x86）。

```batch
REM 最小可用编译（Tkinter）：
nuitka --standalone --windows-console-mode=disable --lto=yes ^
    --enable-plugin=tk-inter --enable-plugin=anti-bloat ^
    --python-flag=no_docstrings --output-dir=dist main.py
```

FAQ condensado：无反应→CMD 看错/VC++/重编；体积→32 位+排除+anti-bloat+瘦身+DLL；误报→白名单/签名/不用 UPX；SmartScreen→EV 证书。详情 `references/build-guide.md`。

## Checklist Rápido

- [ ] Parâmetros confirmados com o usuário (sem defaults)
- [ ] `--windows-console-mode=disable` + `--lto=yes` + VC++ OK
- [ ] `build_optimized.bat` → `slim_dist.ps1` → `analyze_dlls.py`
- [ ] `setup.iss` com GUID único + VC++ da arquitetura certa
