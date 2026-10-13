@echo off
setlocal enabledelayedexpansion
title Fleet Maintenance Tracker - Git Push Helper
color 0B

echo =======================================================
echo     Jasper FleetGuard - Easy GitHub Push Helper
echo =======================================================
echo.

:: Check git status first
echo Checking working directory changes...
git status --short
echo.

:: Prompt for custom commit message
set /p COMMIT_MSG="Enter commit message (Press Enter for auto-generated message): "

if "%COMMIT_MSG%"=="" (
    for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
    set "COMMIT_MSG=Update fleet maintenance system - !datetime:~0,4!-!datetime:~4,2!-!datetime:~6,2! !datetime:~8,2!:!datetime:~10,2!"
)

echo.
echo [1/3] Staging all files...
git add -A

echo.
echo [2/3] Committing with message: "%COMMIT_MSG%"...
git commit -m "%COMMIT_MSG%"

echo.
echo [3/3] Pushing to GitHub (origin/main)...
git push origin main

if %ERRORLEVEL% equ 0 (
    echo.
    color 0A
    echo =======================================================
    echo   [SUCCESS] All changes successfully pushed to GitHub!
    echo   Repository: https://github.com/vjhvhgv89/truck-maintenance
    echo =======================================================
) else (
    echo.
    color 0C
    echo =======================================================
    echo   [ERROR] Push failed. Please check your internet or git credentials.
    echo =======================================================
)

echo.
pause
