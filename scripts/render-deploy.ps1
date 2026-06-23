$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

$playwrightRoot = Join-Path (Split-Path $PSScriptRoot -Parent) "leaflock-pharmacy-crm"
if (Test-Path (Join-Path $playwrightRoot "node_modules\playwright")) {
  $env:NODE_PATH = Join-Path $playwrightRoot "node_modules"
} else {
  & npm.cmd install playwright --no-save
}

Write-Host "Starting Render deploy for leaflock-store..." -ForegroundColor Cyan
& node.exe scripts\render-deploy.mjs