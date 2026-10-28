$ErrorActionPreference = "Stop"

$DemoPath = $PSScriptRoot
$ProjectRoot = Split-Path -Parent $DemoPath
$SourceWebshop = Join-Path $ProjectRoot "Webshop_Prototyp\Frontend\webshop"
$SourceImages = Join-Path $ProjectRoot "Webshop_Prototyp\Frontend\images"

Write-Host ""
Write-Host "=============================================" -ForegroundColor DarkGreen
Write-Host " WEBshop-Demo aktualisieren" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor DarkGreen
Write-Host ""

if (-not (Test-Path $SourceWebshop)) {
    throw "Quellordner nicht gefunden: $SourceWebshop"
}

if (-not (Test-Path $SourceImages)) {
    throw "Bilderordner nicht gefunden: $SourceImages"
}

if (-not (Test-Path (Join-Path $DemoPath ".git"))) {
    throw "Dieser Ordner ist kein Git-Repository: $DemoPath"
}

Write-Host "1/4 Alte Demo-Dateien entfernen ..." -ForegroundColor Cyan

Get-ChildItem -LiteralPath $DemoPath -Force |
    Where-Object {
        $_.Name -notin @(
            ".git",
            ".gitignore",
            "update-demo.ps1"
        )
    } |
    Remove-Item -Recurse -Force

Write-Host "2/4 Webshop-Dateien kopieren ..." -ForegroundColor Cyan

Copy-Item `
    -Path (Join-Path $SourceWebshop "*") `
    -Destination $DemoPath `
    -Recurse `
    -Force

Write-Host "3/4 Bilder kopieren ..." -ForegroundColor Cyan

Copy-Item `
    -Path $SourceImages `
    -Destination $DemoPath `
    -Recurse `
    -Force

Write-Host "4/4 Bildpfade fuer die Demo anpassen ..." -ForegroundColor Cyan

$Utf8NoBom = New-Object System.Text.UTF8Encoding($false)

Get-ChildItem `
    -LiteralPath $DemoPath `
    -Recurse `
    -File |
    Where-Object {
        $_.Extension -in @(".html", ".css", ".js")
    } |
    ForEach-Object {
        $Content = [System.IO.File]::ReadAllText(
            $_.FullName,
            [System.Text.Encoding]::UTF8
        )

        $Content = $Content.Replace(
            "../images/",
            "images/"
        )

        [System.IO.File]::WriteAllText(
            $_.FullName,
            $Content,
            $Utf8NoBom
        )
    }

$IndexFile = Join-Path $DemoPath "index.html"

if (-not (Test-Path $IndexFile)) {
    throw "index.html fehlt nach der Aktualisierung. Demo wurde nicht korrekt erstellt."
}

Write-Host ""
Write-Host "=============================================" -ForegroundColor DarkGreen
Write-Host " Demo erfolgreich aktualisiert." -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor DarkGreen
Write-Host ""
Write-Host "Naechste Schritte:" -ForegroundColor Yellow
Write-Host "  1. Demo kurz mit Live Server testen"
Write-Host "  2. git status"
Write-Host "  3. git add ."
Write-Host '  4. git commit -m "Webshop-Demo aktualisiert"'
Write-Host "  5. git push"
Write-Host ""
