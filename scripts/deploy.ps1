# Run from repo root after: gh auth login
param(
  [string]$RepoName = "leaflock-store-v2",
  [ValidateSet("public", "private")]
  [string]$Visibility = "public"
)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..

if (-not (gh auth status 2>$null)) {
  Write-Host "GitHub CLI not logged in. Run: gh auth login" -ForegroundColor Yellow
  gh auth login -h github.com -p https -w
}

if (-not (Test-Path .git)) {
  git init
  git branch -M main
}

git add -A
$status = git status --porcelain
if ($status) {
  git commit -m "Deploy: LeafLock Store v2"
}

$remotes = git remote 2>$null
if ($remotes -notcontains "origin") {
  gh repo create $RepoName --$Visibility --source=. --remote=origin --push
} else {
  git push -u origin main
}

Write-Host ""
Write-Host "Done. Repo pushed to GitHub." -ForegroundColor Green
Write-Host "Next: https://dashboard.render.com -> New -> Blueprint -> connect $RepoName" -ForegroundColor Cyan