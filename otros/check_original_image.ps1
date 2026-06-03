Add-Type -AssemblyName System.Drawing
$filePath = "C:\Users\madne\.gemini\antigravity\brain\dd9e3602-f5f7-4db2-bb55-c979a5fae5f5\media__1780501353553.png"
if (Test-Path $filePath) {
    $img = [System.Drawing.Bitmap]::FromFile($filePath)
    $transparent = 0
    $opaque = 0
    for ($y = 0; $y -lt $img.Height; $y++) {
        for ($x = 0; $x -lt $img.Width; $x++) {
            $pixel = $img.GetPixel($x, $y)
            if ($pixel.A -lt 255) {
                $transparent++
            } else {
                $opaque++
            }
        }
    }
    Write-Host "Total pixels: $($img.Width * $img.Height)"
    Write-Host "Transparent: $transparent"
    Write-Host "Opaque: $opaque"
    $img.Dispose()
} else {
    Write-Host "File not found"
}
