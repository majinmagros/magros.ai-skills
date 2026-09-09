# slim_dist.ps1 — dist 瘦身清理（参考 参考项目策略）：.pdb/.pyi/__pycache__/tests/docs/.pyc/.dist-info
# Extraído de SKILL.md (2026-09-09). Uso: .\slim_dist.ps1 -DistPath "dist\APP.dist"
param(
    [string]$DistPath
)

$ErrorActionPreference = "Continue"  # 不静默吞错：删除失败会显示出来，避免假成功

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "dist 瘦身清理（参考 参考项目策略）" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

if (-not (Test-Path $DistPath)) {
    Write-Host "[错误] 找不到目录: $DistPath" -ForegroundColor Red
    exit 1
}

# 统计初始体积
$InitialSize = (Get-ChildItem -Path $DistPath -Recurse -File | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host "`n初始体积: $([math]::Round($InitialSize, 2)) MB" -ForegroundColor Yellow

# 参考项目特征：没有 .pdb, .pyi, __pycache__, test 等
Write-Host "`n[应用 参考项目的清理策略...]" -ForegroundColor Green

# 1. 删除调试符号
Write-Host "`n[1/7] 删除 .pdb 调试符号..." -ForegroundColor Green
$pdbFiles = Get-ChildItem -Path $DistPath -Recurse -Include *.pdb -File
$pdbSize = ($pdbFiles | Measure-Object -Property Length -Sum).Sum / 1MB
if ($pdbFiles.Count -gt 0) {
    $pdbFiles | Remove-Item -Force
    Write-Host "  删除 $($pdbFiles.Count) 个文件，节省 $([math]::Round($pdbSize, 2)) MB"
} else {
    Write-Host "  未发现 .pdb 文件（已优化）" -ForegroundColor Gray
}

# 2. 删除类型提示
Write-Host "`n[2/7] 删除 .pyi 类型提示..." -ForegroundColor Green
$pyiFiles = Get-ChildItem -Path $DistPath -Recurse -Include *.pyi -File
$pyiSize = ($pyiFiles | Measure-Object -Property Length -Sum).Sum / 1MB
if ($pyiFiles.Count -gt 0) {
    $pyiFiles | Remove-Item -Force
    Write-Host "  删除 $($pyiFiles.Count) 个文件，节省 $([math]::Round($pyiSize, 2)) MB"
} else {
    Write-Host "  未发现 .pyi 文件（已优化）" -ForegroundColor Gray
}

# 3. 删除 __pycache__
Write-Host "`n[3/7] 删除 __pycache__ 缓存..." -ForegroundColor Green
$pycacheDirs = Get-ChildItem -Path $DistPath -Recurse -Directory -Filter "__pycache__"
$pycacheSize = 0
foreach ($dir in $pycacheDirs) {
    $size = (Get-ChildItem -Path $dir.FullName -Recurse -File | Measure-Object -Property Length -Sum).Sum
    $pycacheSize += $size
    Remove-Item -Path $dir.FullName -Recurse -Force
}
if ($pycacheDirs.Count -gt 0) {
    Write-Host "  删除 $($pycacheDirs.Count) 个目录，节省 $([math]::Round($pycacheSize / 1MB, 2)) MB"
} else {
    Write-Host "  未发现 __pycache__（已优化）" -ForegroundColor Gray
}

# 4. 删除测试目录
Write-Host "`n[4/7] 删除 test/tests 测试目录..." -ForegroundColor Green
$testDirs = Get-ChildItem -Path $DistPath -Recurse -Directory | Where-Object { $_.Name -match '^tests?$' }
$testSize = 0
foreach ($dir in $testDirs) {
    $size = (Get-ChildItem -Path $dir.FullName -Recurse -File | Measure-Object -Property Length -Sum).Sum
    $testSize += $size
    Remove-Item -Path $dir.FullName -Recurse -Force
}
if ($testDirs.Count -gt 0) {
    Write-Host "  删除 $($testDirs.Count) 个目录，节省 $([math]::Round($testSize / 1MB, 2)) MB"
} else {
    Write-Host "  未发现测试目录（已优化）" -ForegroundColor Gray
}

# 5. 删除文档和示例
Write-Host "`n[5/7] 删除 docs/examples 文档目录..." -ForegroundColor Green
$docDirs = Get-ChildItem -Path $DistPath -Recurse -Directory | Where-Object { $_.Name -match '^(docs|examples|samples|demo)$' }
$docSize = 0
foreach ($dir in $docDirs) {
    $size = (Get-ChildItem -Path $dir.FullName -Recurse -File | Measure-Object -Property Length -Sum).Sum
    $docSize += $size
    Remove-Item -Path $dir.FullName -Recurse -Force
}
if ($docDirs.Count -gt 0) {
    Write-Host "  删除 $($docDirs.Count) 个目录，节省 $([math]::Round($docSize / 1MB, 2)) MB"
} else {
    Write-Host "  未发现文档目录（已优化）" -ForegroundColor Gray
}

# 6. 删除 .pyc 文件
Write-Host "`n[6/7] 删除 .pyc 字节码..." -ForegroundColor Green
$pycFiles = Get-ChildItem -Path $DistPath -Recurse -Include *.pyc -File
$pycSize = ($pycFiles | Measure-Object -Property Length -Sum).Sum / 1MB
if ($pycFiles.Count -gt 0) {
    $pycFiles | Remove-Item -Force
    Write-Host "  删除 $($pycFiles.Count) 个文件，节省 $([math]::Round($pycSize, 2)) MB"
} else {
    Write-Host "  未发现 .pyc 文件（已优化）" -ForegroundColor Gray
}

# 7. 精简 .dist-info 元数据
Write-Host "`n[7/7] 精简 .dist-info 元数据..." -ForegroundColor Green
$distInfoDirs = Get-ChildItem -Path $DistPath -Recurse -Directory -Filter "*.dist-info"
$removedCount = 0
$removedSize = 0
foreach ($infoDir in $distInfoDirs) {
    # 仅删安装期记账文件；保留 METADATA 与 entry_points.txt（运行期被 importlib.metadata 读取，删除会破坏插件发现）
    $filesToRemove = @("RECORD", "INSTALLER", "direct_url.json")
    foreach ($fileName in $filesToRemove) {
        $file = Join-Path $infoDir.FullName $fileName
        if (Test-Path $file) {
            $size = (Get-Item $file).Length
            $removedSize += $size
            Remove-Item $file -Force
            $removedCount++
        }
    }
}
if ($removedCount -gt 0) {
    Write-Host "  删除 $removedCount 个元数据文件，节省 $([math]::Round($removedSize / 1MB, 2)) MB"
} else {
    Write-Host "  未发现可清理的元数据（已优化）" -ForegroundColor Gray
}

# 统计最终体积
$FinalSize = (Get-ChildItem -Path $DistPath -Recurse -File | Measure-Object -Property Length -Sum).Sum / 1MB
$SavedSize = $InitialSize - $FinalSize
$SavedPercent = if ($InitialSize -gt 0) { ($SavedSize / $InitialSize) * 100 } else { 0 }

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "清理完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "初始体积: $([math]::Round($InitialSize, 2)) MB" -ForegroundColor Yellow
Write-Host "最终体积: $([math]::Round($FinalSize, 2)) MB" -ForegroundColor Green
Write-Host "节省空间: $([math]::Round($SavedSize, 2)) MB ($([math]::Round($SavedPercent, 1))%)" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# 对比 参考项目
Write-Host "[对比参考]" -ForegroundColor Yellow
Write-Host "参考项目总体积: 323 MB (包含 PyQt, OpenCV, Playwright 等重量级库)" -ForegroundColor Gray
Write-Host "如果你的项目是纯 Tkinter + 标准库，目标应该在 80-150 MB" -ForegroundColor Gray
