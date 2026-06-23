Add-Type -AssemblyName System.Drawing
$path = Join-Path $PSScriptRoot "..\assets\leaflock-logo.png"
$out = Join-Path $PSScriptRoot "..\assets\leaflock-logo-tmp.png"
$bmp = [System.Drawing.Bitmap]::FromFile($path)
$newBmp = New-Object System.Drawing.Bitmap $bmp.Width, $bmp.Height, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
for ($y = 0; $y -lt $bmp.Height; $y++) {
  for ($x = 0; $x -lt $bmp.Width; $x++) {
    $c = $bmp.GetPixel($x, $y)
    if ($c.R -gt 230 -and $c.G -gt 230 -and $c.B -gt 230) {
      $newBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
    } else {
      $newBmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $c.R, $c.G, $c.B))
    }
  }
}
$newBmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$newBmp.Dispose()
Move-Item -Force $out $path
Write-Output "Logo saved with transparent background"