$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$output = Join-Path $root 'dist'
$client = Join-Path $output 'client'

if (Test-Path -LiteralPath $output) {
  Remove-Item -LiteralPath $output -Recurse -Force
}

New-Item -ItemType Directory -Path $client -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $output 'server') -Force | Out-Null

Get-ChildItem -LiteralPath $root -File | Where-Object {
  $_.Extension -in '.html', '.jpeg', '.jpg', '.png', '.ico'
} | Copy-Item -Destination $client -Force

foreach ($folder in @('assets', 'products')) {
  Copy-Item -LiteralPath (Join-Path $root $folder) -Destination (Join-Path $client $folder) -Recurse -Force
}

@'
export default {
  fetch(request, env) {
    return env.ASSETS.fetch(request);
  }
};
'@ | Set-Content -LiteralPath (Join-Path $output 'server\index.js') -NoNewline
