# Quick Git Commands Reference

## The Fastest Way (PAT Method)

### Step 1: Get Your Token
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Name: `voeq-push`
4. Check: `repo` scope
5. Click "Generate token"
6. **Copy the token** (looks like: `ghp_xxxxxxxxxxxxxxxxxxxx`)

### Step 2: One Command to Rule Them All

```bash
# Replace YOUR_TOKEN with the token you just copied
git remote set-url origin https://nuelo1650-sketch:YOUR_TOKEN@github.com/nuelo1650-sketch/voeq.git
```

### Step 3: Push!

```bash
git push -u origin main
```

**That's it!** You're done. 🎉

---

## Common Git Workflows

### First Time Push
```bash
git add .
git commit -m "Initial commit"
git push -u origin main
```

### Regular Updates
```bash
git add .
git commit -m "Your commit message"
git push
```

### Check Status
```bash
git status
```

### View Recent Commits
```bash
git log --oneline -5
```

### See What Changed
```bash
git diff
```

### Undo Last Commit (Keep Changes)
```bash
git reset --soft HEAD~1
```

### Pull Latest Changes
```bash
git pull origin main
```

---

## Troubleshooting

### 403 Forbidden Error
**Problem**: You don't have write access or wrong credentials.

**Solution**: Use the PAT method above.

### Remote already exists
```bash
git remote remove origin
git remote add origin https://nuelo1650-sketch:YOUR_TOKEN@github.com/nuelo1650-sketch/voeq.git
```

### Large files causing issues
```bash
# Add to .gitignore
echo "node_modules/" >> .gitignore
echo ".turbo/" >> .gitignore
echo "dist/" >> .gitignore
echo ".next/" >> .gitignore
```

### Committed secret by accident
```bash
# Remove from last commit
git reset HEAD~1
# Edit the file to remove secret
# Commit again
git add .
git commit -m "Your message"
```

---

## For the Agent (Kiro/Hermes)

Once you (the user) run the PAT setup command above, the agent will be able to push successfully because the git remote URL will contain the authentication token.

**Example**:
```bash
# After you set up PAT, the agent can run:
git push
# And it will work! ✅
```

The token is stored in the git config, so it persists across agent sessions.

---

## Security Reminder

⚠️ **Never commit your token to the repository!**

The token is only in:
- Your local git config (`.git/config`)
- Never in tracked files

To view your current remote (token will be visible):
```bash
git remote get-url origin
```

To remove the token later:
```bash
git remote set-url origin https://github.com/nuelo1650-sketch/voeq.git
```

---

## Alternative: Add Collaborator

If you want `davidowi2` to have permanent write access:

1. Go to: https://github.com/nuelo1650-sketch/voeq/settings/access
2. Click "Add people"
3. Enter: `davidowi2`
4. Choose role: "Write" or "Admin"
5. Send invitation

Once accepted, `davidowi2` can push without a PAT.
