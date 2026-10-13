# Easy GitHub Commit & Push PowerShell Script
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "    Jasper FleetGuard - Easy GitHub Push Helper       " -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Checking current changes..." -ForegroundColor Yellow
git status --short
Write-Host ""

$commitMsg = Read-Host "Enter commit message (Press Enter for auto timestamp)"
if ([string]::IsNullOrWhiteSpace($commitMsg)) {
    $commitMsg = "Update fleet maintenance system - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
}

Write-Host ""
Write-Host "[1/3] Staging all files..." -ForegroundColor Gray
git add -A

Write-Host "[2/3] Committing changes with: '$commitMsg'..." -ForegroundColor Gray
git commit -m "$commitMsg"

Write-Host "[3/3] Pushing to GitHub (origin/main)..." -ForegroundColor Gray
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "=======================================================" -ForegroundColor Green
    Write-Host "  [SUCCESS] Pushed to https://github.com/vjhvhgv89/truck-maintenance" -ForegroundColor Green
    Write-Host "=======================================================" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "=======================================================" -ForegroundColor Red
    Write-Host "  [ERROR] Git push encountered an error." -ForegroundColor Red
    Write-Host "=======================================================" -ForegroundColor Red
}

Write-Host ""
Read-Host "Press Enter to exit"
