# Load .env.buyer and run bulk-x402-index.mjs
# Usage:
#   .\scripts\run-bulk-buy.ps1
#   .\scripts\run-bulk-buy.ps1 --skip mf-tool-001
#   .\scripts\run-bulk-buy.ps1 --only mf-train-001 --verbose

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

Set-Location $repo
node scripts/bulk-x402-index.mjs @args