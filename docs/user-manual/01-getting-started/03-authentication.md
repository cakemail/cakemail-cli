# Authentication

Learn how to authenticate with the Cakemail API using the CLI.

## Overview

The Cakemail CLI provides **seamless authentication** - just run any command, and if credentials are missing, you'll be prompted to provide them. No separate setup command required!

**Authentication Methods:**
1. **Access Token** (recommended for automation)
2. **Email & Password** (recommended for interactive use)

**Credential Sources:**
- Interactive prompts (easiest)
- Configuration file (`~/.cakemail/config.json`)
- Environment variables
- `.env` file
- Command-line options (for one-off overrides)

**First-Time Experience:**
```bash
$ cakemail campaigns list
# If no credentials found, you'll be prompted interactively
# Credentials are validated and saved automatically
# No separate setup needed!
```

## Authentication Methods

### Method 1: Email & Password (Recommended for Interactive Use)

Authenticate using your Cakemail account email and password. The CLI uses OAuth token-based authentication - when you provide your email and password, the CLI automatically obtains and stores OAuth tokens (access token and refresh token) for secure, long-lived sessions.

**Option A: Environment Variables**

```bash
export CAKEMAIL_EMAIL=your@email.com
export CAKEMAIL_PASSWORD=your_password
```

**Option B: .env File**

Create a `.env` file in your project directory:

```bash
CAKEMAIL_EMAIL=your@email.com
CAKEMAIL_PASSWORD=your_password
```

**Option C: Command-Line Flags**

```bash
cakemail --email your@email.com --password your_password campaigns list
```

**Option D: Interactive Prompts**

If no credentials are found, the CLI will prompt you interactively on first use:

```bash
$ cakemail campaigns list

⚠ Not authenticated
Please enter your Cakemail credentials:

Email: user@example.com
Password: ********

🔐 Authenticating...
✓ Authentication successful!

# If you have multiple accounts
? Select an account:
  › Cakemail (ID: 123456) ⭐
    Sub-Account A (ID: 789012)
    Sub-Account B (ID: 345678)

# Profile selection
? Select your profile:
  › 📊 Marketer - Interactive, user-friendly
    💻 Developer - Fast, scriptable
    ⚖️  Balanced - Best of both

✓ Profile set to: marketer
✓ OAuth tokens saved to ~/.cakemail/config.json

[... proceeds with your command ...]
```

**How OAuth Authentication Works:**
- You provide email and password once
- CLI obtains OAuth access token and refresh token
- Tokens are stored securely in `~/.cakemail/config.json`
- Your password is **never** stored - only tokens
- Tokens automatically refresh when needed
- You'll select a user profile (developer, marketer, or balanced)
- No separate setup command required

**What's Stored in config.json:**
- `access_token` - Used for API authentication
- `refresh_token` - Used to obtain new access tokens
- `expires_in` - Token expiration tracking
- `auth.method` - Authentication method used

**Subsequent Commands:**
- OAuth tokens loaded automatically from config
- Tokens refreshed automatically when expired
- No prompts needed
- Just run your commands

---

### Method 2: Access Token (Advanced - Manual Token Management)

For advanced users who want to manually manage API tokens, you can provide an access token directly. This skips the OAuth flow.

---

## Multi-Tenant Account Management

If you have access to multiple Cakemail accounts (parent account + sub-accounts), you can easily list and switch between them.

### List All Accessible Accounts

```bash
cakemail account list
```

**Example Output:**
```
┌────────────┬─────────────────────────┬──────────┬────────────────────┐
│ Account ID │ Account Name            │ Current  │ Created            │
├────────────┼─────────────────────────┼──────────┼────────────────────┤
│ 12345      │ My Marketing Account    │ ✓        │ 2024-01-15         │
│ 67890      │ Client Account          │          │ 2024-03-20         │
│ 11111      │ Partner Sub-Account     │          │ 2024-05-10         │
└────────────┴─────────────────────────┴──────────┴────────────────────┘

Showing 3 accessible accounts (parent + sub-accounts)
```

### View Current Account

```bash
cakemail account show
```

**Example Output:**
```json
{
  "id": 12345,
  "name": "My Marketing Account",
  "status": "active",
  "created_on": "2024-01-15T10:00:00Z"
}
```

### Switch Between Accounts

```bash
cakemail account use <account-id>
```

**Example:**
```bash
$ cakemail account use 67890
✓ Switched to account: Client Account (67890)
✓ Context saved to ~/.cakemail/config.json
```

**Context Persistence:**
- Account context saved in `CAKEMAIL_CURRENT_ACCOUNT_ID`
- Persists between CLI sessions
- Applies to all subsequent commands

### Use Specific Account for Single Command

Override the current account context for a single command:

```bash
cakemail --account 67890 campaigns list
```

This doesn't change your saved account context - just overrides it for this one command.

### Test Current Credentials

Verify your authentication and account access:

```bash
cakemail account test
```

**Example Output:**
```
✓ Authentication successful
✓ Connected as: user@example.com
✓ Current account: My Marketing Account (12345)
✓ API access: OK
```

### Logout

Remove stored credentials and authentication tokens:

```bash
cakemail logout
```

**Interactive Logout:**
```bash
$ cakemail logout

🚪 Logout

Currently logged in as: user@example.com

This will remove:
  • Authentication tokens
  • Profile settings
  • All saved configuration

? Are you sure you want to log out? (y/N) y

✓ Logged out successfully

Run any command to log in again.
```

**Force Logout (Skip Confirmation):**
```bash
$ cakemail logout --force
✓ Logged out successfully
```

**What Gets Deleted:**
- OAuth access token and refresh token
- Profile settings
- Account context
- All saved configuration from `~/.cakemail/config.json`

**Note:** You'll need to authenticate again on next use.

---

## Security Best Practices

### 1. OAuth Tokens vs Manual Access Tokens

**OAuth Tokens (Recommended for Most Users):**
- Obtained automatically from email/password
- Include refresh tokens for long-lived sessions
- Your password is never stored
- Tokens automatically refreshed
- Safer for interactive use

**Manual Access Tokens (For Automation):**
- Generated in Cakemail dashboard
- Good for CI/CD pipelines and scripts
- Can be revoked without changing password
- Limited scope (API access only)
- Easier to rotate regularly

### 2. Store Credentials Securely

**Do:**
- Use `.env` files (and add them to `.gitignore`)
- Use environment variables
- Use a secrets manager for CI/CD (GitHub Secrets, AWS Secrets Manager, etc.)

**Don't:**
- Commit credentials to version control
- Share credentials in chat or email
- Use the same token across multiple projects

### 3. Protect Configuration Files

Always exclude configuration files from version control:

```bash
# Add to .gitignore
echo '.env' >> .gitignore
echo '.cakemail/' >> .gitignore
```

**Important:** The `~/.cakemail/config.json` file contains:
- OAuth access tokens
- OAuth refresh tokens
- Profile settings
- Account context

**Never commit config.json to version control.**

### 4. Use Logout When Switching Accounts

When switching between different Cakemail accounts or sharing a machine:

```bash
# Log out completely
cakemail logout --force

# Log in with new account
cakemail campaigns list
# [Prompts for credentials]
```

### 5. Token Security

**OAuth tokens are automatically managed:**
- Access tokens expire and are refreshed automatically
- Refresh tokens are long-lived but can be invalidated
- Use `logout` command to remove all tokens when done

**For manual access tokens:**
- Rotate tokens periodically
- Generate new token in Cakemail dashboard
- Update environment variable or `.env` file
- Revoke old token

---

## Environment File (.env)

The CLI automatically loads environment variables from a `.env` file in:
1. Current working directory
2. Home directory (`~/.cakemail`)

### Example .env File

```bash
# Authentication (choose one method)
CAKEMAIL_ACCESS_TOKEN=your_access_token_here

# OR use email/password
# CAKEMAIL_EMAIL=your@email.com
# CAKEMAIL_PASSWORD=your_password

# Optional: Default output format
CAKEMAIL_OUTPUT_FORMAT=compact

# Optional: API base URL (defaults to https://api.cakemail.dev)
# CAKEMAIL_API_BASE=https://api.cakemail.dev

# Optional: Default account ID
# CAKEMAIL_ACCOUNT_ID=12345
```

### Global Configuration

Create a global `.env` file at `~/.cakemail/.env` to use across all projects:

```bash
mkdir -p ~/.cakemail
cat > ~/.cakemail/.env <<EOF
CAKEMAIL_ACCESS_TOKEN=your_access_token_here
CAKEMAIL_OUTPUT_FORMAT=compact
EOF
```

**Note**: Project-level `.env` files take precedence over global configuration.

---

## Credential Priority

When multiple credential sources are present, the CLI uses this priority order:

1. **Command-line flags** (highest priority)
   ```bash
   cakemail --access-token abc123 campaigns list
   ```

2. **Environment variables**
   ```bash
   export CAKEMAIL_ACCESS_TOKEN=abc123
   ```

3. **Project .env file**
   ```
   # .env in current directory
   CAKEMAIL_ACCESS_TOKEN=abc123
   ```

4. **Global .env file**
   ```
   # ~/.cakemail/.env
   CAKEMAIL_ACCESS_TOKEN=abc123
   ```

5. **Interactive prompts** (lowest priority)

---

## Troubleshooting Authentication

### "Missing credentials" Error

If you see this error:

```
Error: Missing credentials. Please provide either an access token or email/password.
```

**Solution:**
1. Check that credentials are set in environment variables or `.env` file
2. Verify there are no typos in variable names
3. Try providing credentials via command-line flags

### "Invalid credentials" Error

If authentication fails:

```
Error: Authentication failed. Invalid credentials.
```

**Solutions:**
1. **Access Token**: Verify the token is correct and hasn't been revoked
2. **Email/Password**: Check for typos and ensure the password is current
3. **Account Access**: Ensure you have access to the account

### "Account not found" Error

If switching to an account fails:

```
Error: Account not found: 12345
```

**Solutions:**
1. List available accounts: `cakemail account list`
2. Verify you have access to the account
3. Check that you're authenticated with the correct credentials

### Testing Authentication

Verify your credentials work:

```bash
# Test with current account
cakemail account current

# Test with a simple list command
cakemail lists list --limit 1
```

---

