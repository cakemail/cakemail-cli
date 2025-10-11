# Accounts

Learn about Cakemail account management, multi-tenant access, and switching between accounts.

## Overview

The Cakemail CLI supports managing multiple Cakemail accounts. This is useful when:

- You manage multiple businesses or brands
- You provide services to clients with separate Cakemail accounts
- You have a partner account with multiple sub-accounts
- You need to switch between development and production accounts

## Account Types

### Main Account

Your primary Cakemail account - the one you use to authenticate with email/password or access token.

### Sub-Accounts

Accounts created under a partner account. Sub-accounts are separate Cakemail instances with their own:
- Contact lists
- Campaigns
- Templates
- Senders
- Analytics

**Key Features:**
- Managed from the parent account
- Can be accessed without separate credentials
- Inherit billing from parent account
- Isolated data and settings

---

## Account Commands

### Show Current Account

Display details about the currently active account:

```bash
cakemail account show
```

**Example Output:**
```json
{
  "id": "12345",
  "name": "My Marketing Account",
  "email": "admin@example.com",
  "created_on": "2024-01-15T10:00:00Z",
  "timezone": "America/New_York",
  "status": "active"
}
```

**Current Context Indicator:**
If you've set a specific account context, it will be displayed:
```
Current account context: 67890

{
  "id": "67890",
  "name": "Client Account"
}
```

---

### List All Accessible Accounts

View all accounts you have access to (main account + sub-accounts):

```bash
cakemail account list
```

**Example Output:**
```
Available accounts:

• My Marketing Account (ID: 12345) (current)
  Client A (ID: 67890)
  Client B (ID: 67891)
  Development Account (ID: 67892)

Total accessible accounts: 4
```

**Legend:**
- `•` (green bullet) - Currently active account
- `(current)` - Current account context

**Include Nested Sub-Accounts:**

```bash
cakemail account list --recursive
```

This includes sub-accounts of sub-accounts (nested hierarchy).

---

### Switch Account Context

Change which account you're working with:

```bash
cakemail account use <account-id>
```

**Example:**
```bash
cakemail account use 67890
# Now using: Client A (ID: 67890)
```

**What Happens:**
1. Verifies the account exists and you have access
2. Updates `.env` file with `CAKEMAIL_CURRENT_ACCOUNT_ID`
3. All subsequent commands use the new account context

**Verify the Switch:**
```bash
cakemail account show
```

---

### Test Credentials

Validate that your current credentials are working:

```bash
cakemail account test
```

**Example Output (Success):**
```
✓ Credentials are valid

Authenticated as: admin@example.com
Account: My Marketing Account
```

**Example Output (Failure):**
```
✗ Invalid credentials
```

---

### Logout

Remove credentials from your `.env` file:

```bash
cakemail account logout
```

You'll be prompted for confirmation:
```
Log out and remove credentials?
  • Credentials will be removed from .env file
  • You will need to re-authenticate

Proceed? (y/N)
```

**Skip Confirmation:**
```bash
cakemail account logout --force
```

**What Gets Removed:**
- `CAKEMAIL_EMAIL`
- `CAKEMAIL_PASSWORD`
- `CAKEMAIL_ACCESS_TOKEN`
- `CAKEMAIL_CURRENT_ACCOUNT_ID`

**Note:** Other environment variables (like `CAKEMAIL_OUTPUT_FORMAT`) are preserved.

---

## Account Context

### What is Account Context?

Account context determines which account's data you're working with. When you run commands, they operate on the currently active account.

### Setting Context

**Method 1: Use Command**
```bash
cakemail account use 67890
```

This updates your `.env` file permanently.

**Method 2: Environment Variable**
```bash
export CAKEMAIL_CURRENT_ACCOUNT_ID=67890
cakemail campaigns list
```

This is temporary (current shell session only).

**Method 3: Command-Line Flag**
```bash
cakemail --account 67890 campaigns list
```

This overrides context for a single command.

### Context Priority

When multiple context settings exist:

1. **Command-line flag** (highest priority)
   ```bash
   cakemail --account 67890 campaigns list
   ```

2. **Environment variable**
   ```bash
   export CAKEMAIL_CURRENT_ACCOUNT_ID=67890
   ```

3. **`.env` file**
   ```
   CAKEMAIL_CURRENT_ACCOUNT_ID=67890
   ```

4. **Default** (main account)

---

## Multi-Account Workflows

### Scenario 1: Managing Client Accounts

**Setup:**
```bash
# List all accessible accounts
cakemail account list

# Available accounts:
# • My Agency (ID: 12345) (current)
#   Client A (ID: 67890)
#   Client B (ID: 67891)
```

**Working with Client A:**
```bash
# Switch to Client A
cakemail account use 67890

# All commands now operate on Client A's account
cakemail campaigns list
cakemail contacts list 123
cakemail reports account
```

**Quick Check of Client B (without switching):**
```bash
# Use --account flag for one-off command
cakemail --account 67891 reports account
```

**Switch Back to Agency Account:**
```bash
cakemail account use 12345
```

---

### Scenario 2: Development vs Production

**Setup:**
```bash
# Create separate .env files
# .env.development
CAKEMAIL_CURRENT_ACCOUNT_ID=11111

# .env.production
CAKEMAIL_CURRENT_ACCOUNT_ID=22222
```

**Use Development:**
```bash
cp .env.development .env
cakemail campaigns list  # Development data
```

**Use Production:**
```bash
cp .env.production .env
cakemail campaigns list  # Production data
```

---

### Scenario 3: Scripted Multi-Account Operations

**Bash Script Example:**
```bash
#!/bin/bash
# Report on all accessible accounts

# Get list of account IDs
ACCOUNTS=(12345 67890 67891)

for ACCOUNT_ID in "${ACCOUNTS[@]}"; do
  echo "=== Account $ACCOUNT_ID ==="
  cakemail --account "$ACCOUNT_ID" reports account
  echo ""
done
```

---

## Account Hierarchy

### Parent-Child Relationship

```
Main Account (12345)
├── Sub-Account A (67890)
├── Sub-Account B (67891)
└── Sub-Account C (67892)
    ├── Nested Sub-Account C1 (78901)
    └── Nested Sub-Account C2 (78902)
```

**Access Levels:**
- **Main Account**: Can access all sub-accounts
- **Sub-Account**: Can only access itself (unless it's a partner)

**List with Recursion:**
```bash
# Shows all accounts including nested
cakemail account list --recursive

# Shows only direct children
cakemail account list
```

---

## Best Practices

### 1. Use Descriptive Account Names

When creating sub-accounts, use clear names:
- ✅ "Client A - Marketing"
- ✅ "Production Environment"
- ❌ "Account 1"
- ❌ "Test"

### 2. Document Account IDs

Keep a reference document with account IDs and purposes:
```
# accounts.txt
12345 - Main Agency Account
67890 - Client A (Acme Corp)
67891 - Client B (Widget Inc)
67892 - Development/Testing
```

### 3. Use Project-Specific Context

For project-specific work, set context in project `.env`:
```bash
# project-client-a/.env
CAKEMAIL_CURRENT_ACCOUNT_ID=67890
```

### 4. Verify Context Before Destructive Operations

Always check which account you're using before:
- Deleting campaigns
- Removing contacts
- Changing configurations

```bash
# Check current account
cakemail account show

# Then perform operation
cakemail campaigns delete 123 --force
```

### 5. Use Account Flag for One-Off Commands

Instead of switching context, use `--account` flag:
```bash
# Quick check without switching
cakemail --account 67890 campaigns list

# Current context remains unchanged
```

---

## Common Patterns

### Pattern 1: Daily Multi-Account Check

```bash
#!/bin/bash
# daily-check.sh

for ACCOUNT in 12345 67890 67891; do
  echo "=== Account $ACCOUNT ==="

  # Get account name
  NAME=$(cakemail --account "$ACCOUNT" account show | jq -r '.name')
  echo "Account: $NAME"

  # Check campaigns scheduled today
  TODAY=$(date -u +"%Y-%m-%d")
  cakemail --account "$ACCOUNT" campaigns list --filter "scheduled_for>=$TODAY"

  echo ""
done
```

### Pattern 2: Report Generation Across Accounts

```bash
#!/bin/bash
# generate-reports.sh

ACCOUNTS=(12345 67890 67891)
OUTPUT_DIR="reports/$(date +%Y-%m-%d)"
mkdir -p "$OUTPUT_DIR"

for ACCOUNT in "${ACCOUNTS[@]}"; do
  echo "Generating report for account $ACCOUNT..."

  cakemail --account "$ACCOUNT" -f json reports account \
    > "$OUTPUT_DIR/account-$ACCOUNT.json"
done

echo "Reports saved to $OUTPUT_DIR"
```

### Pattern 3: Bulk Contact Import

```bash
#!/bin/bash
# bulk-import.sh

# Import contacts to multiple accounts
ACCOUNTS=(67890 67891)
CSV_FILE="contacts.csv"

for ACCOUNT in "${ACCOUNTS[@]}"; do
  echo "Importing to account $ACCOUNT..."
  cakemail --account "$ACCOUNT" contacts import "$CSV_FILE"
done
```

---

## Troubleshooting

### "Account not found or not accessible"

**Cause:** You're trying to switch to an account that doesn't exist or you don't have access to.

**Solutions:**
1. List accessible accounts:
   ```bash
   cakemail account list --recursive
   ```
2. Verify the account ID is correct
3. Check that you're authenticated with the right credentials

---

### Commands Use Wrong Account

**Cause:** Account context is set to a different account than you expect.

**Solutions:**
1. Check current context:
   ```bash
   cakemail account show
   ```
2. Check `.env` file for `CAKEMAIL_CURRENT_ACCOUNT_ID`
3. Clear context to use main account:
   ```bash
   # Remove from .env
   grep -v "CAKEMAIL_CURRENT_ACCOUNT_ID" .env > .env.tmp
   mv .env.tmp .env
   ```

---

### Can't See Sub-Accounts

**Cause:** Your account might not be a partner account or doesn't have sub-accounts.

**Solutions:**
1. Verify account type in Cakemail dashboard
2. Check if you need partner account privileges
3. Contact Cakemail support to enable sub-account features

---

## Next Steps

- [Authentication Methods](./authentication-methods.md) - Deep dive into authentication
- [Quick Start: Account Management](../01-getting-started/quick-start.md) - Practical examples
- [Advanced Usage: Scripting](../08-advanced-usage/scripting-automation.md) - Multi-account automation
