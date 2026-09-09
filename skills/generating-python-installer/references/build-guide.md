# Build Guide — Nuitka 极限优化 + Inno Setup（参考 参考项目）

核心理念：**Nuitka 文件夹模式(dist) + Inno Setup 封装**。拒绝单文件版，拒绝黑窗。脚本 prontos em `scripts/`。

## 参考案例（生产级 PySide2，323 MB，OpenCV / Playwright）

- 总体积 323 MB · PyInstaller 4.7 (32位) · PySide2 22.52 MB · OpenCV 62.38 MB · Playwright 76.74 MB · Python 3.8 (32位) · DLL 71 个共 93.23 MB
- PASS 策略：32 位 Python（−20~30%）· base_library.zip（0.74 MB）· 模块排除（无 pytest/unittest/setuptools）· Qt 插件精简

| 组件 | 体积 | 占比 | 优化建议 |
|------|------|------|---------|
| playwright | 76.74 MB | 23.8% | 非必要可移除 |
| OpenCV | 62.38 MB | 19.3% | 用 opencv-python-headless |
| PySide2 | 22.52 MB | 7.0% | 排除 WebEngine/3D/Charts |
| 其他依赖 | 161.36 MB | 49.9% | - |

| 项目类型 | Nuitka 原始 | 优化后 |
|---------|------------|--------|
| Tkinter + 标准库 | 150-250 MB | **80-120 MB** |
| PyQt/PySide | 200-400 MB | **120-250 MB** |
| 含 numpy/pandas | 300-600 MB | **180-350 MB** |

## 工作流（WARNING: 严格执行）

**步骤 1：强制参数确认（FAIL: 禁止默认值）** — 逐一向用户确认（等明确回复）：软件名称、版本号、发布者、主程序 exe、源路径（dist 绝对路径）、输出路径、图标 .ico（可选）、官网（可选）。可回复"跳过"用空值。

**步骤 2：编译检查（关键，Inno Setup 无法改变程序属性）** — 确认：① dist 用 `nuitka --windows-console-mode=disable`（去黑窗）；② `--lto=yes`（启动速度）；③ VC++ 运行库已含（纯净系统可运行）。回复"确认"才继续，否则重编。

**步骤 3：生成代码** — 输出完整元数据 + 卸载图标修复的 `setup.iss`。

## Nuitka 极限优化

**32 位 vs 64 位**：python3x.dll −15%，Qt5Core −37%，numpy −33%，总体 −20~30%。用 32 位当：内存 <2GB、不处理超大文件、目标是办公电脑。

```bash
# 32 位 Python（可与 64 位共存）：https://www.python.org/downloads/windows/
py -3.12-32 -m pip install -r requirements.txt
py -3.12-32 -m nuitka --standalone ...你的参数
```

**模块排除清单（安全，省 30-50 MB）**：`unittest,test,pytest,_pytest,doctest,pdb,pdbpp, setuptools,pip,distutils,pkg_resources, email.mime,http.server,xmlrpc,pydoc`

**Tkinter（最轻，目标 80-120 MB）**：
```bash
nuitka --standalone --windows-console-mode=disable --lto=yes --jobs=8 ^
    --enable-plugin=tk-inter --enable-plugin=anti-bloat ^
    --noinclude-pytest-mode=nofollow --noinclude-setuptools-mode=nofollow ^
    --nofollow-import-to=unittest,test,pytest,_pytest,doctest,pdb,pdbpp ^
    --nofollow-import-to=setuptools,pip,distutils,pkg_resources ^
    --nofollow-import-to=email.mime,http.server,xmlrpc,pydoc ^
    --python-flag=no_docstrings --output-dir=dist ^
    --windows-icon-from-ico=icon.ico --remove-output main.py
```

**PyQt5/PySide2（目标 120-250 MB）**：同上，`--enable-plugin=pyqt5`（或 pyside6），加 `--nofollow-import-to=PyQt5.QtWebEngine,PyQt5.QtWebEngineWidgets --nofollow-import-to=PyQt5.Qt3D,PyQt5.QtCharts`，`--include-qt-plugins=sensible,styles,platforms`。

一键编译 + 瘦身：`scripts/build_optimized.bat`（配 APP_NAME/MAIN_FILE/ICON_FILE）→ 调 `scripts/slim_dist.ps1`：删 .pdb/.pyi/__pycache__/tests/docs/.pyc + 精简 .dist-info（仅 RECORD/INSTALLER/direct_url.json，保留 METADATA/entry_points.txt）。**预期省 15-30%。**

## 完整工作流

1. 改 `build_optimized.bat` 三行（APP_NAME/MAIN_FILE/ICON_FILE）→ 2. 执行 → 3. `python scripts/analyze_dlls.py dist/APP.dist` → 4. 按结果优化：OpenCV→headless（`pip install opencv-python-headless`）；Qt→排除模块；删 `opengl32sw.dll`（硬件渲染时）。

## VC++ 运行库

- 方案一（推荐）：`nuitka --static-libpython=yes ...`
- 方案二（商业发布）：`setup.iss` 顶部注释块捆绑 `vc_redist.x86.exe`（32 位）/`.x64.exe`（64 位），`/quiet /norestart`。下载：[Microsoft VC++ Redistributable](https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist)

## 占位符（setup.iss）

| 占位符 | 说明 | 示例 |
|--------|------|--------|
| `{{APP_NAME}}` / `{{APP_VERSION}}` / `{{PUBLISHER}}` | 显示名/版本/发布者 | `红墨批注` / `1.0.0` / `MyCompany` |
| `{{APP_URL}}` | 官网 | `https://example.com` |
| `{{EXE_NAME}}` | 主程序 | `RedInk.exe` |
| `{{SOURCE_DIR}}` | dist 绝对路径 | `D:\project\dist\RedInk.dist` |
| `{{OUTPUT_DIR}}` / `{{ICON_PATH}}` | 输出/图标 | `D:\project\output` / `D:\project\icon.ico` |
| `{{GENERATE_RANDOM_GUID}}` | AppId 唯一 | Inno Setup Tools > Generate GUID |

## FAQ

- **Q1 安装后无反应**：CMD 手动运行看错；查 VC++；查 Nuitka 是否成功。
- **Q2 体积过大**：32 位 → 模块排除 → anti-bloat → dist 瘦身 → DLL 分析。
- **Q3 杀毒误报**：白名单申请；代码签名（Sectigo/DigiCert）；**不用 UPX**。
- **Q4 SmartScreen**：EV 证书立即信任；普通证书靠安装量积累。

## 实战问题记录

- 缺 python3xx.dll：必须 `--standalone`；确认 dist 内存在；不打单文件版。
- 点击无反应：重依赖阻塞启动 → 延迟 import 到"开始导出"；加日志。
- MinGW + 非 ASCII 路径报错：复制到 ASCII 目录；`PYTHONIOENCODING=utf-8`。
- Inno `x64` 弃用警告：`ArchitecturesInstallIn64BitMode=x64compatible`（仅 64 位）。
- `--disable-console` 废弃：用 `--windows-console-mode=disable`。
- dist 出现 `_nuitka_temp.exe`：[Files] 排除。

## 优化效果预期

| 优化组合 | 体积减少 | 启动提升 | 风险 |
|----------|----------|----------|------|
| 基础编译 | 基准 | 基准 | 无 |
| + `--lto=yes` | 5-10% | 10-20% | 无 |
| + anti-bloat | 15-25% | - | 无 |
| + 模块排除 | 20-35% | 5% | 无 |
| + dist 瘦身 | 25-40% | - | 无 |
| + 32 位编译 | 40-60% | - | 无 |
| **全部组合** | **45-65%** | **15-25%** | **无风险** |

> WARNING: **不建议 UPX**——体积再小也易触发误报。

**基于 参考项目实战经验优化，助你打造商业级安装包！**
