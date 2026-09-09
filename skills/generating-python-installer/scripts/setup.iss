; setup.iss — 商业级 Python 安装脚本模板 (Inno Setup 6.x)
; 特性：LZMA2 极限压缩 | 全中文 | 完整元数据 | 无残留卸载
; 参考：参考项目(323 MB, LZMA2 压缩)
; Extraído de SKILL.md (2026-09-09). Substitua os {{PLACEHOLDERS}} (tabela em references/build-guide.md).
; GUID: gere um único em Inno Setup > Tools > Generate GUID e cole em AppId.
;
; VC++ 运行库（商业发布推荐，架构必须与 Python/Nuitka 构建一致——本 skill 推荐 32 位，
; 默认 vc_redist.x86.exe；64 位构建改两处为 x64）：
;   [Files]
;   Source: "{#MySourceDir}\..\vc_redist.x86.exe"; DestDir: "{tmp}"; Flags: deleteafterinstall
;   [Run]
;   Filename: "{tmp}\vc_redist.x86.exe"; Parameters: "/quiet /norestart"; StatusMsg: "正在安装运行库..."; Flags: waituntilterminated
; 下载：https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist

; --- 1. 参数定义 ---
#define MyAppName        "{{APP_NAME}}"
#define MyAppVersion     "{{APP_VERSION}}"
#define MyAppPublisher   "{{PUBLISHER}}"
#define MyAppURL         "{{APP_URL}}"
#define MyAppExeName     "{{EXE_NAME}}"
#define MySourceDir      "{{SOURCE_DIR}}"
#define MyOutputDir      "{{OUTPUT_DIR}}"
;#define MyIconPath      "{{ICON_PATH}}"

[Setup]
; --- 身份识别 ---
AppId={{GENERATE_RANDOM_GUID}}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}

; --- 安装路径与权限 ---
DefaultDirName={autopf}\{#MyAppName}
DefaultGroupName={#MyAppName}
DisableDirPage=no
DisableProgramGroupPage=no
PrivilegesRequired=admin

; --- 输出设置 ---
OutputDir={#MyOutputDir}
OutputBaseFilename=Setup_{#MyAppName}_v{#MyAppVersion}

; --- 视觉体验 ---
WizardStyle=modern
#ifdef MyIconPath
SetupIconFile={#MyIconPath}
UninstallDisplayIcon={app}\{#MyAppExeName}
#endif

; ---  核心压缩 (参考 参考项目) ---
Compression=lzma2/ultra64
SolidCompression=yes
LZMAUseSeparateProcess=yes

; --- 架构 ---
; 注意：仅 64 位 Python 构建才设此项。本 skill 推荐 32 位 Python——
; 32 位构建请保持注释，使应用按 32 位安装并与上面捆绑的 vc_redist.x86.exe 匹配。
; 仅当用 64 位 Python 编译时才取消注释。
;ArchitecturesInstallIn64BitMode=x64compatible

[Languages]
Name: "chinesesimplified"; MessagesFile: "compiler:Languages\ChineseSimplified.isl"

[Files]
Source: "{#MySourceDir}\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs createallsubdirs

[UninstallDelete]
Type: filesandordirs; Name: "{app}\*"

[Icons]
Name: "{autodesktop}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"; Tasks: desktopicon
Name: "{group}\{#MyAppName}"; Filename: "{app}\{#MyAppExeName}"
Name: "{group}\卸载 {#MyAppName}"; Filename: "{uninstallexe}"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"; Flags: unchecked

[Run]
Filename: "{app}\{#MyAppExeName}"; Description: "{cm:LaunchProgram,{#MyAppName}}"; Flags: nowait postinstall skipifsilent
