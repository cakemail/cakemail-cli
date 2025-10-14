# Configuration

Configure the Cakemail CLI to match your preferences and workflow.

## Overview

The CLI can be configured using:
- Environment variables
- `.env` files (project or global)
- Command-line flags (per-command overrides)

## Configuration Options

### Authentication

See [Authentication](/en/cli/getting-started/authentication/) for detailed authentication configuration.

```bash
# Access token (recommended)
CAKEMAIL_ACCESS_TOKEN=your_access_token

# OR email/password
CAKEMAIL_EMAIL=your@email.com
CAKEMAIL_PASSWORD=your_password
```

### Output Format

Control how command results are displayed.

```bash
# Default output format: json, table, or compact
CAKEMAIL_OUTPUT_FORMAT=compact
```

See [Output Formats](/en/cli/getting-started/output-formats/) for details on each format.

### API Base URL

Override the default API endpoint (advanced use only).

```bash
# Default: https://api.cakemail.dev
CAKEMAIL_API_BASE=https://api.cakemail.dev
```

**Note**: Only change this if you're using a different API environment or a self-hosted instance.

### Default Account

Set a default account ID for multi-account setups.

```bash
# Use specific account by default
CAKEMAIL_ACCOUNT_ID=12345
```

### Profile System (v1.5.0+)

The CLI adapts its behavior to your workflow through profiles. See [Profile System](/en/cli/core-concepts/profile-system/) for details.

```bash
# Set your preferred profile (developer | marketer | balanced)
# This is managed through config commands, not environment variables
```

**Available Profiles:**
- **Developer**: Fast, non-interactive, JSON output, no confirmations
- **Marketer**: Interactive, guided, rich colors, safety confirmations
- **Balanced**: Auto-detect context, moderate colors (default)

**Profile Management:**
```bash
# View current profile
cakemail config profile

# Switch profile
cakemail config profile-set developer
cakemail config profile-set marketer
cakemail config profile-set balanced

# Preview profile before switching
cakemail config preview developer

# Customize individual settings
cakemail config set output_format json

# Reset to profile defaults
cakemail config reset

# Show complete configuration
cakemail config show
```

**Profile Storage:**
Profile settings are stored in `~/.cakemail/config.json` (not in `.env` file).

---

## Configuration Files

### Project Configuration (.env)

Create a `.env` file in your project directory for project-specific settings:

```bash
# .env
CAKEMAIL_ACCESS_TOKEN=your_access_token
CAKEMAIL_OUTPUT_FORMAT=compact
CAKEMAIL_ACCOUNT_ID=12345
```

**Best for:**
- Project-specific credentials
- Team projects with shared configuration
- Different settings per project

### Global Configuration (~/.cakemail/.env)

Create a global configuration file for user-wide settings:

```bash
mkdir -p ~/.cakemail
cat > ~/.cakemail/.env <<EOF
CAKEMAIL_ACCESS_TOKEN=your_access_token
CAKEMAIL_OUTPUT_FORMAT=table
EOF
```

**Best for:**
- Personal credentials
- Consistent settings across all projects
- Quick CLI usage without per-project setup

### Configuration Priority

When multiple configuration sources exist, the CLI uses this priority:

1. **Command-line flags** (highest)
   ```bash
   cakemail -f json campaigns list
   ```

2. **Environment variables**
   ```bash
   export CAKEMAIL_OUTPUT_FORMAT=compact
   ```

3. **Project .env file** (`./env`)

4. **Global .env file** (`~/.cakemail/.env`)

5. **Default values** (lowest)

---

## Example Configurations

### Development Setup

For local development with interactive output:

```bash
# .env
CAKEMAIL_EMAIL=developer@example.com
CAKEMAIL_PASSWORD=dev_password
CAKEMAIL_OUTPUT_FORMAT=table
```

### Production/CI Setup

For automation with machine-readable output:

```bash
# .env
CAKEMAIL_ACCESS_TOKEN=prod_token_here
CAKEMAIL_OUTPUT_FORMAT=json
```

### Multi-Account Setup

For managing multiple accounts:

```bash
# ~/.cakemail/.env (global)
CAKEMAIL_ACCESS_TOKEN=your_token
CAKEMAIL_OUTPUT_FORMAT=compact

# Override per project
# project-a/.env
CAKEMAIL_ACCOUNT_ID=12345

# project-b/.env
CAKEMAIL_ACCOUNT_ID=67890
```

---

## Command-Line Flags

Override configuration for individual commands.

### Global Flags

These flags work with all commands:

```bash
# Output format
cakemail -f json campaigns list
cakemail -f table campaigns list
cakemail -f compact campaigns list

# Profile override (v1.5.0+)
cakemail --profile developer campaigns list
cakemail --profile marketer campaigns create

# Batch mode - disable all interactive features (v1.5.0+)
cakemail --batch campaigns create --name "Newsletter" --list-id 123 --sender-id 456

# Authentication override
cakemail --access-token abc123 campaigns list
cakemail --email user@example.com --password pass123 campaigns list

# Account override
cakemail --account 12345 campaigns list
```

### Combining Flags

You can combine multiple flags:

```bash
cakemail -f table --account 12345 campaigns list
```

---

## Environment Variables Reference

Complete list of environment variables:

| Variable | Description | Default | Example |
|----------|-------------|---------|---------|
| `CAKEMAIL_ACCESS_TOKEN` | API access token | None | `abc123xyz` |
| `CAKEMAIL_EMAIL` | Account email | None | `user@example.com` |
| `CAKEMAIL_PASSWORD` | Account password | None | `mypassword` |
| `CAKEMAIL_OUTPUT_FORMAT` | Default output format | `json` | `compact`, `table`, `json` |
| `CAKEMAIL_API_BASE` | API base URL | `https://api.cakemail.dev` | `https://api.example.com` |
| `CAKEMAIL_ACCOUNT_ID` | Default account ID | None | `12345` |
| `CAKEMAIL_BATCH_MODE` | Force batch mode (v1.5.0+) | `false` | `true` |

**Note**: Profile settings are managed via config commands, not environment variables. See [Profile System](/en/cli/core-concepts/profile-system/).

---

## Setting Environment Variables

### Temporary (Current Session)

Set for the current terminal session only:

```bash
export CAKEMAIL_OUTPUT_FORMAT=compact
cakemail campaigns list
```

### Permanent (Shell Profile)

Add to your shell profile for persistence across sessions.

**For Zsh (macOS default):**
```bash
echo 'export CAKEMAIL_OUTPUT_FORMAT=compact' >> ~/.zshrc
source ~/.zshrc
```

**For Bash:**
```bash
echo 'export CAKEMAIL_OUTPUT_FORMAT=compact' >> ~/.bashrc
source ~/.bashrc
```

### Project-Specific (.env file)

Recommended approach for most users:

```bash
# Create .env file
cat > .env <<EOF
CAKEMAIL_ACCESS_TOKEN=your_token
CAKEMAIL_OUTPUT_FORMAT=compact
EOF

# Add .env to .gitignore
echo '.env' >> .gitignore
```

---

## Configuration Best Practices

### 1. Use .env Files

**Do:**
```bash
# .env
CAKEMAIL_ACCESS_TOKEN=your_token
CAKEMAIL_OUTPUT_FORMAT=compact
```

**Don't:**
```bash
# Hardcode credentials in scripts
cakemail --access-token abc123 campaigns list
```

### 2. Keep .env Out of Version Control

Always add `.env` to `.gitignore`:

```bash
echo '.env' >> .gitignore
```

Provide a template instead:

```bash
# .env.example
CAKEMAIL_ACCESS_TOKEN=your_access_token_here
CAKEMAIL_OUTPUT_FORMAT=compact
```

### 3. Use Appropriate Output Formats

Choose the right format for your use case:

- **Interactive use**: `table` or `compact`
- **Scripts/automation**: `json`
- **Quick checks**: `compact`

### 4. Separate Development and Production

Use different configuration files:

```bash
# .env.development
CAKEMAIL_EMAIL=dev@example.com
CAKEMAIL_OUTPUT_FORMAT=table

# .env.production
CAKEMAIL_ACCESS_TOKEN=prod_token
CAKEMAIL_OUTPUT_FORMAT=json
```

Load the appropriate file:
```bash
# Development
cp .env.development .env

# Production
cp .env.production .env
```

### 5. Use Global Config for Personal Use

For personal CLI usage, global configuration is convenient:

```bash
# ~/.cakemail/.env
CAKEMAIL_ACCESS_TOKEN=your_personal_token
CAKEMAIL_OUTPUT_FORMAT=compact
```

Then run commands anywhere without per-project setup.

---

## Verifying Configuration

### Check Current Settings

View environment variables:

```bash
# Show all CAKEMAIL_* variables
env | grep CAKEMAIL
```

### Test Configuration

Run a simple command to verify:

```bash
# This should use your configured credentials and format
cakemail campaigns list --limit 1
```

### Debug Configuration Issues

If configuration isn't working:

1. **Check variable names** (must be exact)
   ```bash
   # Correct
   CAKEMAIL_OUTPUT_FORMAT=compact

   # Wrong (won't work)
   CAKEMAIL_FORMAT=compact
   ```

2. **Verify .env file location**
   ```bash
   # Should be in project root or ~/.cakemail/
   ls -la .env
   ls -la ~/.cakemail/.env
   ```

3. **Check file permissions**
   ```bash
   chmod 600 .env
   ```

4. **Test with explicit flags**
   ```bash
   # Override config to test
   cakemail -f json --access-token test_token campaigns list
   ```

---

