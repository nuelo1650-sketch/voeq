# GitHub Authentication Setup Script for voeq (PowerShell)
# This script helps configure git authentication for pushing to nuelo1650-sketch/voeq

Write-Host "🔐 GitHub Authentication Setup for voeq" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check current remote
Write-Host "📍 Current remote URL:" -ForegroundColor Yellow
git remote -v | Select-String "origin"
Write-Host ""

# Prompt for authentication method
Write-Host "Choose authentication method:" -ForegroundColor Green
Write-Host "1) Personal Access Token (PAT) - Recommended"
Write-Host "2) SSH Key"
Write-Host "3) GitHub CLI (gh)"
Write-Host ""
$choice = Read-Host "Enter choice (1-3)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "📝 Personal Access Token Setup" -ForegroundColor Cyan
        Write-Host "------------------------------" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Steps:" -ForegroundColor Yellow
        Write-Host "1. Go to: https://github.com/settings/tokens"
        Write-Host "2. Click 'Generate new token (classic)'"
        Write-Host "3. Name: voeq-local-push"
        Write-Host "4. Scopes: Check 'repo'"
        Write-Host "5. Generate and copy the token"
        Write-Host ""
        
        $token = Read-Host "Paste your token here" -AsSecureString
        $tokenPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto(
            [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($token)
        )
        
        if ([string]::IsNullOrWhiteSpace($tokenPlain)) {
            Write-Host "❌ No token provided. Exiting." -ForegroundColor Red
            exit 1
        }
        
        # Set remote URL with token
        git remote set-url origin "https://nuelo1650-sketch:$tokenPlain@github.com/nuelo1650-sketch/voeq.git"
        
        Write-Host "✅ Remote URL updated with token" -ForegroundColor Green
        Write-Host ""
        Write-Host "Testing connection..." -ForegroundColor Yellow
        
        $testResult = git ls-remote origin HEAD 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Authentication successful!" -ForegroundColor Green
            Write-Host ""
            Write-Host "You can now push with: git push -u origin main" -ForegroundColor Cyan
        }
        else {
            Write-Host "❌ Authentication failed. Check your token and try again." -ForegroundColor Red
            exit 1
        }
    }
    
    "2" {
        Write-Host ""
        Write-Host "🔑 SSH Key Setup" -ForegroundColor Cyan
        Write-Host "----------------" -ForegroundColor Cyan
        Write-Host ""
        
        $sshPath = "$env:USERPROFILE\.ssh"
        $keyPath = "$sshPath\id_ed25519.pub"
        $rsaKeyPath = "$sshPath\id_rsa.pub"
        
        # Check if SSH key exists
        if (-not (Test-Path $keyPath) -and -not (Test-Path $rsaKeyPath)) {
            Write-Host "No SSH key found. Generating one..." -ForegroundColor Yellow
            ssh-keygen -t ed25519 -C "voeq-deploy"
        }
        
        # Display public key
        Write-Host ""
        Write-Host "📋 Copy this public key and add it to GitHub:" -ForegroundColor Yellow
        Write-Host "   https://github.com/settings/keys" -ForegroundColor Cyan
        Write-Host ""
        
        if (Test-Path $keyPath) {
            Get-Content $keyPath
        }
        elseif (Test-Path $rsaKeyPath) {
            Get-Content $rsaKeyPath
        }
        
        Write-Host ""
        Read-Host "Press Enter after adding the key to GitHub"
        
        # Set remote URL to SSH
        git remote set-url origin "git@github.com:nuelo1650-sketch/voeq.git"
        
        Write-Host "Testing SSH connection..." -ForegroundColor Yellow
        $sshTest = ssh -T git@github.com 2>&1
        
        if ($sshTest -match "successfully authenticated") {
            Write-Host "✅ SSH authentication successful!" -ForegroundColor Green
            Write-Host ""
            Write-Host "You can now push with: git push -u origin main" -ForegroundColor Cyan
        }
        else {
            Write-Host "⚠️  SSH test inconclusive. Try pushing to verify." -ForegroundColor Yellow
        }
    }
    
    "3" {
        Write-Host ""
        Write-Host "🔧 GitHub CLI Setup" -ForegroundColor Cyan
        Write-Host "-------------------" -ForegroundColor Cyan
        Write-Host ""
        
        # Check if gh is installed
        $ghInstalled = Get-Command gh -ErrorAction SilentlyContinue
        
        if (-not $ghInstalled) {
            Write-Host "❌ GitHub CLI (gh) is not installed." -ForegroundColor Red
            Write-Host "Install it from: https://cli.github.com/" -ForegroundColor Yellow
            exit 1
        }
        
        Write-Host "Running GitHub CLI login..." -ForegroundColor Yellow
        gh auth login
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ GitHub CLI authentication successful!" -ForegroundColor Green
            Write-Host ""
            Write-Host "You can now push with: git push -u origin main" -ForegroundColor Cyan
        }
        else {
            Write-Host "❌ GitHub CLI authentication failed." -ForegroundColor Red
            exit 1
        }
    }
    
    default {
        Write-Host "❌ Invalid choice. Exiting." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "🎉 Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. git add ."
Write-Host "2. git commit -m 'your message'"
Write-Host "3. git push -u origin main"
