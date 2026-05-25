# cleanup-tracked-ignored.ps1
# PowerShell script to untrack files that should be ignored by Git.
# Run this from the repository root in PowerShell.

param(
    [switch]$WhatIf
)

function Run {
    if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
        Write-Error "git not found in PATH. Install Git or run this from Git Bash/PowerShell with Git available."
        return
    }

    Write-Host "Showing number of currently tracked files..." -ForegroundColor Cyan
    & git ls-files | Measure-Object -Line | ForEach-Object { Write-Host "Tracked files: $($_.Lines)" }

    $patterns = @(
        'node_modules',
        'client/node_modules',
        'server/vendor',
        'vendor',
        'client/dist',
        'client/.vite',
        'public/build',
        'dist',
        'coverage'
    )

    Write-Host "\nDetected tracked files matching common ignored patterns:" -ForegroundColor Cyan
    $matches = @{}
    foreach ($p in $patterns) {
        $found = git ls-files | Select-String -Pattern ([regex]::Escape($p)) -SimpleMatch | ForEach-Object { $_.ToString().Trim() }
        if ($found) { $matches[$p] = $found.Count }
    }

    if ($matches.Count -eq 0) {
        Write-Host "No tracked files found for common ignored patterns." -ForegroundColor Green
    } else {
        foreach ($k in $matches.Keys) { Write-Host "$k : $($matches[$k])" }

        if ($WhatIf) {
            Write-Host "\nWhatIf mode: showing the git rm commands that would run:" -ForegroundColor Yellow
            foreach ($p in $patterns) { Write-Host "git rm -r --cached $p  # (if exists)" }
            Write-Host "git add .gitignore"; Write-Host "git commit -m 'Remove ignored files from repo'"; Write-Host "git push"
            return
        }

        $confirm = Read-Host "Proceed and remove these from Git index (they will remain on disk)? (y/N)"
        if ($confirm -ne 'y' -and $confirm -ne 'Y') { Write-Host "Aborted."; return }

        foreach ($p in $patterns) {
            Write-Host "Removing from index: $p" -ForegroundColor Magenta
            git rm -r --cached $p 2>$null
            if ($LASTEXITCODE -ne 0) {
                Write-Host "Nothing to untrack for $p" -ForegroundColor DarkGray
            }
        }

        Write-Host "Staging .gitignore and committing the cleanup..." -ForegroundColor Cyan
        git add .gitignore
        git commit -m "Remove ignored files from repo and update .gitignore" 2>$null
        if ($LASTEXITCODE -ne 0) { Write-Host "No changes to commit." -ForegroundColor DarkGray }

        Write-Host "Push to remote? (y/N)" -NoNewline
        $push = Read-Host
        if ($push -eq 'y' -or $push -eq 'Y') {
            git push
        } else {
            Write-Host "Skipped pushing. Please push when ready." -ForegroundColor Yellow
        }
    }
}

Run
