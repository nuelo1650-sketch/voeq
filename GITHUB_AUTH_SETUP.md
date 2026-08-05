# GitHub Authentication Setup Guide

## Problem
The current environment is authenticated as `davidowi2`, but the repository `nuelo1650-sketch/voeq` requires authentication as `nuelo1650-sketch`.

## Solution Options

### Option 1: Personal Access Token (PAT) - RECOMMENDED

#### Step 1: Create a Personal Access Token
1. Sign in to GitHub as **nuelo1650-sketch** (the repository owner)
2. Go to: https://github.com/settings/tokens
3. Click **"Generate new token"** → **"Generate new token (classic)"**
4. Configure the token:
   - **Note**: `voeq-local-push`
   - **Expiration**: 90 days (or longer)
   - **Scopes**: Check **`repo`** (Full control of private repositories)
5. Click **"Generate token"**
6. **COPY THE TOKEN** (you'll only see it once!)

#### Step 2: Configure Git to Use the Token

Run this command in your terminal (replace `YOUR_TOKEN_HERE` with the token you copied):

```bash
git remote set-url origin https://nuelo1650-sketch:YOUR_TOKEN_HERE@github.com/nuelo1650-sketch/voeq.git
```

#### Step 3: Push to GitHub

```bash
git push -u origin main
```

---

### Option 2: SSH Key Authentication

#### Step 1: Generate SSH Key (if you don't have one)

```bash
ssh-keygen -t ed25519 -C "your-email@example.com"
```

Press Enter to accept default location, optionally add a passphrase.

#### Step 2: Add SSH Key to GitHub

1. Copy your public key:
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```
2. Go to: https://github.com/settings/keys
3. Click **"New SSH key"**
4. Paste your public key
5. Click **"Add SSH key"**

#### Step 3: Change Remote to SSH

```bash
git remote set-url origin git@github.com:nuelo1650-sketch/voeq.git
```

#### Step 4: Push to GitHub

```bash
git push -u origin main
```

---

### Option 3: GitHub CLI (gh)

If you have GitHub CLI installed:

```bash
# Login as nuelo1650-sketch
gh auth login

# Follow the prompts to authenticate

# Push
git push -u origin main
```

---

### Option 4: Web Upload (No Git Required)

1. Zip your project folder (exclude `node_modules`, `.turbo`, `.next`, `dist`)
2. Go to: https://github.com/nuelo1650-sketch/voeq
3. Click **"Add file"** → **"Upload files"**
4. Drag the files or click to select
5. Add commit message
6. Click **"Commit changes"**

---

## Verification

After setting up authentication, verify it works:

```bash
# Check current remote
git remote -v

# Try pushing
git push -u origin main
```

You should see output like:
```
Enumerating objects: X, done.
Counting objects: 100% (X/X), done.
...
To https://github.com/nuelo1650-sketch/voeq.git
   abc1234..def5678  main -> main
```

---

## Security Notes

1. **Never commit tokens or keys** to the repository
2. **Tokens are like passwords** - keep them secret
3. **Use environment variables** for sensitive data
4. **Rotate tokens regularly** (every 90 days)
5. **Revoke tokens** you're not using anymore at https://github.com/settings/tokens

---

## Troubleshooting

### Still getting 403 Forbidden?
- Verify you're logged in as the correct user: `gh auth status`
- Check the token has `repo` scope
- Ensure the token hasn't expired

### Permission denied (publickey)?
- Check SSH key is added to GitHub: https://github.com/settings/keys
- Test SSH connection: `ssh -T git@github.com`

### Need to add collaborator?
If you want `davidowi2` to have write access:
1. Go to: https://github.com/nuelo1650-sketch/voeq/settings/access
2. Click **"Add people"**
3. Add `davidowi2` as a collaborator
4. They'll receive an invitation email

---

## For Kiro/Hermes Agent

Once you've set up authentication using one of the methods above, the agent will be able to push successfully. The key is that the git remote URL needs to include authentication credentials (PAT) or the environment needs to have valid SSH keys/GitHub CLI authentication.
