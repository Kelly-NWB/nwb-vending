# Load .env.buyer and run one unlock test
# Usage:
#   .\scripts\run-test-unlock.ps1
#   .\scripts\run-test-unlock.ps1 -Url "https://nwb-vending.com/2nd-pages/materials-factory/tools/ai-task-fit/full/rules.json"

param(
  [string]$Url = "https://nwb-vending.com/2nd-pages/materials-factory/tools/ai-task-fit/full/rules.json"
)

$repo = Split-Path $PSScriptRoot -Parent
$envFile = Join-Path $repo ".env.buyer"

if (-not (Test-Path $envFile)) {
  Write-Error "Missing $envFile — copy .env.buyer.example and add your key."
  exit 1
}

Get-Content $envFile | ForEach-Object {
  $line = $_.Trim()
  if (-not $line -or $line.StartsWith("#")) { return }
  $eq = $line.IndexOf("=")
  if ($eq -lt 1) { return }
  $name = $line.Substring(0, $eq).Trim()
  $value = $line.Substring($eq + 1).Trim().Trim('"')
  Set-Item -Path "env:$name" -Value $value
}

$env:X402_URL = $Url
Set-Location $repo
node scripts/test-x402-unlock.mjs