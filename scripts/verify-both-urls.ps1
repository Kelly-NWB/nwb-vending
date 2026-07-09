# After every push28: both URLs must match. Agent runs this — not Kelly.
param(
  [string]$Path = "/2nd-pages/america-250/",
  [string]$MustContain = ""
)

$preview = "https://kelly-nwb.github.io/nwb-vending$Path"
$live = "https://NWB-Vending.com$Path"

function Get-Body($url) {
  try {
    return (Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 25).Content
  } catch {
    return $null
  }
}

$p = Get-Body $preview
$l = Get-Body $live

if (-not $p) { Write-Error "FAIL: preview not reachable: $preview"; exit 1 }
if (-not $l) { Write-Error "FAIL: live domain not reachable: $live"; exit 1 }

Write-Host "OK  preview: $preview"
Write-Host "OK  live:    $live"

if ($MustContain) {
  $pHas = $p -match [regex]::Escape($MustContain)
  $lHas = $l -match [regex]::Escape($MustContain)
  Write-Host "preview contains '$MustContain': $pHas"
  Write-Host "live contains '$MustContain':    $lHas"
  if (-not $pHas) { Write-Error "FAIL: preview missing expected text"; exit 1 }
  if (-not $lHas) {
    Write-Error @"
FAIL: NWB-Vending.com is STALE (preview has change, .com does not).
git push updated GitHub Pages only. Run Cloudflare deploy:
  cd D:\GrokBuild\nwb-vending
  npx.cmd wrangler deploy
Or set GitHub secrets CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID (see SITE-DEPLOY.txt).
"@
    exit 1
  }
}

Write-Host "PASS: both URLs reachable$(if ($MustContain) { ' and in sync' })."
exit 0