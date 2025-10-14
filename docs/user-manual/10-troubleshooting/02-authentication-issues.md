# Authentication Issues

Diagnose and resolve authentication and credential problems with the Cakemail CLI.

## Overview

Common authentication issues:
- Missing or invalid credentials
- Expired access tokens
- Account access problems
- Permission errors
- Multi-account conflicts

## Missing Credentials

### Error: "No credentials found in .env file"

**Cause:** The CLI cannot find your credentials.

**Solutions:**

```bash
# Option 1: Run interactive setup
$ cakemail config init
? Email: your@email.com
? Password: ********
✓ Configuration saved

# Option 2: Create .env file manually
$ cat > .env << EOF
CAKEMAIL_EMAIL=your@email.com
CAKEMAIL_PASSWORD=your_password
EOF

# Option 3: Use environment variables
$ export CAKEMAIL_EMAIL="your@email.com"
$ export CAKEMAIL_PASSWORD="your_password"

# Verify setup
$ cakemail account test
✓ Authentication successful
```

### Error: "Cannot read .env file"

**Cause:** File permissions or path issues.

**Solutions:**

```bash
# Check if .env exists
$ ls -la .env
-rw-------  1 user  staff  89 Oct 13 12:00 .env

# Fix permissions if needed
$ chmod 600 .env

# Verify file contents (redact password)
$ cat .env | grep -v PASSWORD
CAKEMAIL_EMAIL=your@email.com

# Check file location
$ pwd
/your/project/directory

# CLI looks for .env in:
# 1. Current directory
# 2. ~/.cakemail/.env
# 3. Environment variables
```

## Invalid Credentials

### Error: "Invalid credentials" or "Authentication failed"

**Cause:** Email or password is incorrect.

**Solutions:**

```bash
# Test login on web interface first
# Visit: https://app.cakemail.com

# Verify email format
$ echo $CAKEMAIL_EMAIL
your@email.com  # Must be valid email

# Check for typos in .env
$ cat .env
# Common issues:
# - Extra spaces: " your@email.com" (wrong)
# - Quotes: "your@email.com" (may cause issues)
# - Wrong variable name: CAKEMAIL_USER (wrong)

# Re-initialize with correct credentials
$ cakemail config init

# Test authentication
$ cakemail account test
```

### Special Characters in Password

**Problem:** Password contains special characters that break parsing.

**Solutions:**

```bash
# Quote password in .env
CAKEMAIL_PASSWORD='p@ssw0rd!$pecial'

# Or use environment variable with proper quoting
export CAKEMAIL_PASSWORD='p@ssw0rd!$pecial'

# Avoid in .env (unquoted):
CAKEMAIL_PASSWORD=p@ssw0rd!$pecial  # May fail

# Use interactive setup (handles escaping)
$ cakemail config init
```

## Expired or Invalid Tokens

### Error: "Access token expired" or "Invalid token"

**Cause:** Stored access token is no longer valid.

**Solutions:**

```bash
# Option 1: Remove token (CLI will get new one)
$ sed -i '/CAKEMAIL_ACCESS_TOKEN/d' .env

# Option 2: Delete token file
$ rm ~/.cakemail/token

# Option 3: Re-initialize
$ cakemail config init

# Test - CLI will automatically refresh token
$ cakemail account show

# Check token in .env (if curious)
$ grep ACCESS_TOKEN .env
CAKEMAIL_ACCESS_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Not Refreshing

**Problem:** CLI not automatically refreshing expired tokens.

**Solutions:**

```bash
# Force token refresh
$ rm .env
$ cakemail config init

# Check CLI version (bug in older versions)
$ cakemail --version

# Update if needed
$ npm update -g @cakemail-org/cakemail-cli

# Manual token refresh (advanced)
$ cakemail config refresh-token
```

## Account Access Issues

### Error: "Account not found" or "Account not accessible"

**Cause:** Your account doesn't exist or you don't have access.

**Solutions:**

```bash
# Verify account exists
# Log into: https://app.cakemail.com

# Check accessible accounts
$ cakemail account list
Available accounts:
  [456] Agency Account
  [457] Client Account

# Verify current account
$ cakemail account show
Account ID: 456
Account Name: Agency Account

# Switch if needed
$ cakemail account use 457
✓ Switched to account 457

# Test access
$ cakemail lists list
```

### Multiple Accounts Confusion

**Problem:** Working with wrong account.

**Solutions:**

```bash
# List all accessible accounts
$ cakemail account list

# Check current account
$ cakemail account show

# Switch to correct account
$ cakemail account use 456

# Verify resources exist in this account
$ cakemail lists list
$ cakemail senders list

# Use account ID in resource URLs
# Instead of: cakemail lists get 123
# Try: cakemail account use 456 && cakemail lists get 123
```

## Permission Errors

### Error: "Insufficient permissions" or "Forbidden"

**Cause:** Your account doesn't have required permissions.

**Solutions:**

```bash
# Check account type
$ cakemail account show -f json | jq '.account_type'
"standard"  # vs "admin"

# Verify permissions
$ cakemail account show -f json | jq '.permissions'
["campaigns:read", "lists:read"]

# Contact account admin for permissions
# Or use account with appropriate access

# Switch to admin account if available
$ cakemail account list
$ cakemail account use ADMIN_ACCOUNT_ID
```

### API Key vs Password Authentication

**Problem:** Using wrong authentication method.

**Current status:** CLI uses email/password .

```bash
# API key support not yet available
# Use email/password:
CAKEMAIL_EMAIL=your@email.com
CAKEMAIL_PASSWORD=your_password

# Not supported (yet):
# CAKEMAIL_API_KEY=abc123...

# Check roadmap for API key support
```

## Multi-User Scenarios

### Team Member Access Issues

**Problem:** Multiple team members using same credentials.

**Solutions:**

```bash
# Each team member should have own account
# Don't share credentials

# Create separate accounts at:
# https://app.cakemail.com/settings/team

# Each member uses own credentials
# Member 1:
CAKEMAIL_EMAIL=member1@company.com
CAKEMAIL_PASSWORD=password1

# Member 2:
CAKEMAIL_EMAIL=member2@company.com
CAKEMAIL_PASSWORD=password2
```

### CI/CD Authentication

**Problem:** Authenticating in automated environments.

**Solutions:**

```bash
# Use environment variables (secure)
export CAKEMAIL_EMAIL="${SECRETS_EMAIL}"
export CAKEMAIL_PASSWORD="${SECRETS_PASSWORD}"

# Don't commit .env to git
echo ".env" >> .gitignore

# GitHub Actions example:
env:
  CAKEMAIL_EMAIL: ${{ secrets.CAKEMAIL_EMAIL }}
  CAKEMAIL_PASSWORD: ${{ secrets.CAKEMAIL_PASSWORD }}

# Create .env from secrets
echo "CAKEMAIL_EMAIL=$CAKEMAIL_EMAIL" > .env
echo "CAKEMAIL_PASSWORD=$CAKEMAIL_PASSWORD" >> .env
```

## Configuration File Issues

### Wrong Configuration Directory

**Problem:** CLI using wrong config location.

**Solutions:**

```bash
# Check config locations (in order):
# 1. Current directory: ./env
$ ls -la .env

# 2. Home directory: ~/.cakemail/.env
$ ls -la ~/.cakemail/.env

# 3. Environment variables
$ env | grep CAKEMAIL

# Force specific location
$ cd /path/to/project
$ cakemail config init  # Creates .env here

# Or use home directory
$ mkdir -p ~/.cakemail
$ cd ~/.cakemail
$ cakemail config init
```

### Corrupted Configuration

**Problem:** .env file is corrupted or malformed.

**Solutions:**

```bash
# Validate .env format
$ cat .env
CAKEMAIL_EMAIL=your@email.com
CAKEMAIL_PASSWORD=your_password

# Check for issues:
# - Empty lines at start
# - Missing = signs
# - Quotes inconsistency
# - Extra characters

# Recreate if corrupted
$ rm .env
$ cakemail config init

# Or create manually
$ cat > .env << 'EOF'
CAKEMAIL_EMAIL=your@email.com
CAKEMAIL_PASSWORD=your_password
EOF
```

## Debugging Authentication

### Enable Debug Mode

```bash
# See authentication details
$ export DEBUG=cakemail:auth

# Run command
$ cakemail account show

# Output shows:
# - Token retrieval
# - API calls
# - Auth headers (redacted)
```

### Test Authentication Step by Step

```bash
# 1. Check credentials exist
$ cat .env | grep CAKEMAIL_EMAIL
CAKEMAIL_EMAIL=your@email.com

# 2. Test basic command
$ cakemail account test
✓ Authentication successful

# 3. Test account access
$ cakemail account show

# 4. Test resource access
$ cakemail lists list

# 5. Check verbose output
$ cakemail lists list --verbose
```

### Manual Token Verification

```bash
# Extract token
$ TOKEN=$(grep ACCESS_TOKEN .env | cut -d= -f2)

# Decode JWT (without verification)
$ echo $TOKEN | cut -d. -f2 | base64 -d 2>/dev/null | jq .

# Check expiration
{
  "exp": 1710345600,
  "iat": 1710259200,
  "account_id": 456
}

# Compare to current time
$ date +%s
1710300000

# If exp < current time, token expired
```

## Security Best Practices

### Protect Credentials

```bash
# Set restrictive permissions
$ chmod 600 .env

# Don't commit to git
$ echo ".env" >> .gitignore
$ echo ".cakemail/" >> .gitignore

# Don't log passwords
# Bad:
$ echo "Password: $CAKEMAIL_PASSWORD"

# Use secrets management
# - GitHub Secrets
# - HashiCorp Vault
# - AWS Secrets Manager
```

### Rotate Credentials

```bash
# Change password regularly
# 1. Update on web interface
# 2. Update locally
$ cakemail config init

# Clear old tokens
$ find . -name ".cakemail" -type d -exec rm -rf {} +
$ sed -i '/ACCESS_TOKEN/d' .env
```

## Common Scenarios

### Scenario 1: New Machine Setup

```bash
# Install CLI
$ npm install -g @cakemail-org/cakemail-cli

# Configure credentials
$ cakemail config init
? Email: your@email.com
? Password: ********

# Test
$ cakemail account show
```

### Scenario 2: Credential Change

```bash
# Password changed on website
# Update locally:
$ cakemail config init

# Or update .env manually:
$ vim .env
# Change CAKEMAIL_PASSWORD value

# Remove old token
$ sed -i '/ACCESS_TOKEN/d' .env

# Test
$ cakemail account test
```

### Scenario 3: Switching Projects

```bash
# Project A (account 456)
$ cd /projects/project-a
$ cat .env
CAKEMAIL_EMAIL=team@project-a.com
CAKEMAIL_PASSWORD=password_a

# Project B (account 457)
$ cd /projects/project-b
$ cat .env
CAKEMAIL_EMAIL=team@project-b.com
CAKEMAIL_PASSWORD=password_b

# CLI automatically uses local .env in each project
```

## Quick Fixes

### Reset Everything

```bash
# Nuclear option - start fresh
$ rm -rf ~/.cakemail
$ rm .env
$ cakemail config init
$ cakemail account test
```

### Check System Status

```bash
# Verify Cakemail API is up
$ curl -I https://api.cakemail.com
HTTP/2 200

# Check internet connection
$ ping -c 3 api.cakemail.com

# Check DNS resolution
$ nslookup api.cakemail.com
```

## Getting Help

If authentication issues persist:

1. **Verify credentials work on web**: https://app.cakemail.com
2. **Check CLI version**: `cakemail --version`
3. **Enable debug mode**: `export DEBUG=cakemail:*`
4. **Create GitHub issue**: Include sanitized debug output

