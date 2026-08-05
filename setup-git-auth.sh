#!/bin/bash

# GitHub Authentication Setup Script for voeq
# This script helps configure git authentication for pushing to nuelo1650-sketch/voeq

echo "🔐 GitHub Authentication Setup for voeq"
echo "========================================"
echo ""

# Check current remote
echo "📍 Current remote URL:"
git remote -v | grep origin
echo ""

# Prompt for authentication method
echo "Choose authentication method:"
echo "1) Personal Access Token (PAT) - Recommended"
echo "2) SSH Key"
echo "3) GitHub CLI (gh)"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
  1)
    echo ""
    echo "📝 Personal Access Token Setup"
    echo "------------------------------"
    echo ""
    echo "Steps:"
    echo "1. Go to: https://github.com/settings/tokens"
    echo "2. Click 'Generate new token (classic)'"
    echo "3. Name: voeq-local-push"
    echo "4. Scopes: Check 'repo'"
    echo "5. Generate and copy the token"
    echo ""
    read -p "Paste your token here: " token
    
    if [ -z "$token" ]; then
      echo "❌ No token provided. Exiting."
      exit 1
    fi
    
    # Set remote URL with token
    git remote set-url origin "https://nuelo1650-sketch:${token}@github.com/nuelo1650-sketch/voeq.git"
    
    echo "✅ Remote URL updated with token"
    echo ""
    echo "Testing connection..."
    git ls-remote origin HEAD > /dev/null 2>&1
    
    if [ $? -eq 0 ]; then
      echo "✅ Authentication successful!"
      echo ""
      echo "You can now push with: git push -u origin main"
    else
      echo "❌ Authentication failed. Check your token and try again."
      exit 1
    fi
    ;;
    
  2)
    echo ""
    echo "🔑 SSH Key Setup"
    echo "----------------"
    echo ""
    
    # Check if SSH key exists
    if [ ! -f ~/.ssh/id_ed25519.pub ] && [ ! -f ~/.ssh/id_rsa.pub ]; then
      echo "No SSH key found. Generating one..."
      ssh-keygen -t ed25519 -C "voeq-deploy"
    fi
    
    # Display public key
    echo ""
    echo "📋 Copy this public key and add it to GitHub:"
    echo "   https://github.com/settings/keys"
    echo ""
    
    if [ -f ~/.ssh/id_ed25519.pub ]; then
      cat ~/.ssh/id_ed25519.pub
    else
      cat ~/.ssh/id_rsa.pub
    fi
    
    echo ""
    read -p "Press Enter after adding the key to GitHub..."
    
    # Set remote URL to SSH
    git remote set-url origin "git@github.com:nuelo1650-sketch/voeq.git"
    
    echo "Testing SSH connection..."
    ssh -T git@github.com 2>&1 | grep -q "successfully authenticated"
    
    if [ $? -eq 0 ]; then
      echo "✅ SSH authentication successful!"
      echo ""
      echo "You can now push with: git push -u origin main"
    else
      echo "⚠️  SSH test inconclusive. Try pushing to verify."
    fi
    ;;
    
  3)
    echo ""
    echo "🔧 GitHub CLI Setup"
    echo "-------------------"
    echo ""
    
    # Check if gh is installed
    if ! command -v gh &> /dev/null; then
      echo "❌ GitHub CLI (gh) is not installed."
      echo "Install it from: https://cli.github.com/"
      exit 1
    fi
    
    echo "Running GitHub CLI login..."
    gh auth login
    
    if [ $? -eq 0 ]; then
      echo "✅ GitHub CLI authentication successful!"
      echo ""
      echo "You can now push with: git push -u origin main"
    else
      echo "❌ GitHub CLI authentication failed."
      exit 1
    fi
    ;;
    
  *)
    echo "❌ Invalid choice. Exiting."
    exit 1
    ;;
esac

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. git add ."
echo "2. git commit -m 'your message'"
echo "3. git push -u origin main"
