param(
  [Parameter(Mandatory = $true)][string]$Prompt,
  [Parameter(Mandatory = $true)][string]$OutPath,
  [ValidateSet("1024x1024", "1536x1024", "1024x1536")][string]$Size = "1024x1024",
  [ValidateSet("low", "medium", "high")][string]$Quality = "medium",
  [string]$Model = "gpt-image-2"
)

$ErrorActionPreference = "Stop"

if (-not $env:OPENAI_API_KEY) {
  throw "OPENAI_API_KEY is not set"
}

$body = @{
  model   = $Model
  prompt  = $Prompt
  size    = $Size
  quality = $Quality
  n       = 1
} | ConvertTo-Json -Depth 5 -Compress

$headers = @{
  "Authorization" = "Bearer $env:OPENAI_API_KEY"
  "Content-Type"  = "application/json"
}

try {
  $resp = Invoke-RestMethod `
    -Uri "https://api.openai.com/v1/images/generations" `
    -Method Post `
    -Headers $headers `
    -Body $body
}
catch {
  $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
  $errText = $reader.ReadToEnd()
  Write-Host "API error: $errText"
  throw
}

$b64 = $resp.data[0].b64_json
if (-not $b64) {
  Write-Host "No b64_json in response:"
  $resp | ConvertTo-Json -Depth 10
  throw "Empty image payload"
}

$dir = Split-Path -Parent $OutPath
if ($dir -and -not (Test-Path $dir)) {
  New-Item -ItemType Directory -Force -Path $dir | Out-Null
}

[System.IO.File]::WriteAllBytes($OutPath, [Convert]::FromBase64String($b64))
Write-Host "Saved: $OutPath ($((Get-Item $OutPath).Length) bytes)"
