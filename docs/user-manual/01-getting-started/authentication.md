# Authentication

Learn how to authenticate with the Cakemail API using the CLI.

## Overview

The Cakemail CLI provides **seamless authentication** - just run any command, and if credentials are missing, you'll be prompted to provide them. No separate setup command required!

**Authentication Methods:**
1. **Access Token** (recommended for automation)
2. **Email & Password** (recommended for interactive use)

**Credential Sources:**
- Interactive prompts (easiest - v1.4.0+)
- Configuration file (`~/.cakemail/config.json`)
- Environment variables
- `.env` file
- Command-line options (for one-off overrides)

**First-Time Experience (v1.4.0+):**
```bash
$ cakemail campaigns list
# If no credentials found, you'll be prompted interactively
# Credentials are validated and saved automatically
# No separate setup needed!
```

## Authentication Methods

### Method 1: Access Token (Recommended)

Access tokens provide secure, revocable authentication without exposing your password.

#### Getting Your Access Token

1. Log in to your Cakemail account at [app.cakemail.com](https://app.cakemail.com)
2. Navigate to **Settings > API Access**
3. Generate a new access token
4. Copy the token (you won't be able to see it again)

#### Using Access Token

**Option A: Environment Variable**

```bash
export CAKEMAIL_ACCESS_TOKEN=your_access_token_here
```

Add to your shell profile (`~/.zshrc` or `~/.bashrc`) for persistence:

```bash
echo 'export CAKEMAIL_ACCESS_TOKEN=your_access_token_here' >> ~/.zshrc
source ~/.zshrc
```

**Option B: .env File**

Create a `.env` file in your project directory:

```bash
CAKEMAIL_ACCESS_TOKEN=your_access_token_here
```

**Option C: Command-Line Flag**

```bash
cakemail --access-token your_access_token_here campaigns list
```

---

### Method 2: Email & Password

Authenticate using your Cakemail account email and password.

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

**Option D: Interactive Prompts (v1.4.0+)**

If no credentials are found, the CLI will prompt you interactively on first use:

```bash
$ cakemail campaigns list

Welcome to Cakemail CLI!

? Email: user@example.com
? Password: [hidden]

✓ Authentication successful
✓ Found 3 accessible accounts
✓ Current account: My Marketing Account (12345)

? Select your preferred profile:
  ❯ Balanced - Best of both worlds (recommended)
    Developer - Fast, non-interactive, JSON output
    Marketer - Interactive, guided, safe

✓ Profile set to: balanced
✓ Credentials saved to ~/.cakemail/config.json

[... proceeds with your command ...]
```

**First-Time Setup:**
- Credentials are validated via API
- Automatically saved to `~/.cakemail/config.json`
- You'll select a user profile (developer, marketer, or balanced)
- No separate setup command required

**Subsequent Commands:**
- Credentials loaded automatically from config
- No prompts needed
- Just run your commands

---

## Multi-Tenant Account Management (v1.4.0+)

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

Remove stored credentials:

```bash
cakemail account logout --force
```

**Warning:** This removes credentials from `~/.cakemail/config.json`. You'll need to authenticate again on next use.

---

## Security Best Practices

### 1. Use Access Tokens for Automation

Access tokens are safer for scripts and CI/CD pipelines because:
- They can be revoked without changing your password
- They have limited scope (API access only)
- They're easier to rotate regularly

### 2. Store Credentials Securely

**Do:**
- Use `.env` files (and add them to `.gitignore`)
- Use environment variables
- Use a secrets manager for CI/CD (GitHub Secrets, AWS Secrets Manager, etc.)

**Don't:**
- Commit credentials to version control
- Share credentials in chat or email
- Use the same token across multiple projects

### 3. Add .env to .gitignore

Always exclude `.env` files from version control:

```bash
# Add to .gitignore
echo '.env' >> .gitignore
```

Create a `.env.example` file as a template:

```bash
# .env.example
CAKEMAIL_ACCESS_TOKEN=your_access_token_here
# OR
# CAKEMAIL_EMAIL=your@email.com
# CAKEMAIL_PASSWORD=your_password

# Optional configuration
CAKEMAIL_OUTPUT_FORMAT=compact
```

### 4. Rotate Tokens Regularly

Generate new access tokens periodically:
1. Generate a new token in the Cakemail dashboard
2. Update your `.env` file or environment variable
3. Revoke the old token

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

## Next Steps

- [Configuration](./configuration.md) - Configure output formats and preferences
- [Quick Start](./quick-start.md) - Send your first email
- [Core Concepts: Authentication Methods](../02-core-concepts/authentication-methods.md) - Deep dive into authentication
