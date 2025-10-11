# Authentication

Learn how to authenticate with the Cakemail API using the CLI.

## Overview

The Cakemail CLI supports two authentication methods:

1. **Access Token** (recommended for automation)
2. **Email & Password** (recommended for interactive use)

You can provide credentials via:
- Environment variables
- `.env` file
- Command-line options (for one-off overrides)
- Interactive prompts (when no credentials are found)

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

**Option D: Interactive Prompts**

If no credentials are found, the CLI will prompt you interactively:

```bash
cakemail campaigns list
# You'll be prompted for email and password
```

---

## Account Management

If you have access to multiple Cakemail accounts, you can list and switch between them.

### List Available Accounts

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
└────────────┴─────────────────────────┴──────────┴────────────────────┘
```

### View Current Account

```bash
cakemail account current
```

**Example Output:**
```json
{
  "account_id": 12345,
  "account_name": "My Marketing Account",
  "created_on": "2024-01-15T10:00:00Z"
}
```

### Switch Between Accounts

```bash
cakemail account switch <account-id>
```

**Example:**
```bash
cakemail account switch 67890
# Current account switched to: Client Account (67890)
```

### Use Specific Account for Single Command

Override the current account for a single command:

```bash
cakemail --account 67890 campaigns list
```

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
