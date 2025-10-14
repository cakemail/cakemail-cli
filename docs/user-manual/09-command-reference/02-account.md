# Account Commands

Manage account authentication, switch between accounts, and view account details.

## Overview

Account commands allow you to:
- View current account information
- List all accessible accounts (including sub-accounts)
- Switch between parent and sub-accounts
- Test credential validity
- Logout and remove stored credentials

These commands are essential for multi-tenant setups where you manage multiple Cakemail accounts or sub-accounts.

## Commands

- [account show](#account-show) - Display current account details
- [account list](#account-list) - List all accessible accounts
- [account use](#account-use) - Switch active account
- [account test](#account-test) - Validate credentials
- [account logout](#account-logout) - Remove credentials

---

## account show

Display detailed information about the currently active account.

### Usage

```bash
cakemail account show
```

### Examples

**Show current account:**

```bash
$ cakemail account show
```

**Output:**
```
ℹ Current account context: 456
{
  "id": "456",
  "name": "My Company",
  "email": "admin@example.com",
  "plan": "professional",
  "contact_limit": 10000,
  "contacts_used": 6789,
  "email_limit": 100000,
  "emails_sent_this_month": 45678,
  "created_at": "2023-01-15T10:30:00Z",
  "status": "active"
}
```

**Extract account ID:**

```bash
$ cakemail account show -f json | jq -r '.data.id'
```

**Output:**
```
456
```

**Check account limits:**

```bash
$ cakemail account show -f json | jq '{contacts: {limit: .data.contact_limit, used: .data.contacts_used}, emails: {limit: .data.email_limit, used: .data.emails_sent_this_month}}'
```

**Output:**
```json
{
  "contacts": {
    "limit": 10000,
    "used": 6789
  },
  "emails": {
    "limit": 100000,
    "used": 45678
  }
}
```

### Notes

- Shows account currently set in `.env` file
- Displays usage limits and current usage
- Includes account plan and status
- Use to verify which account you're operating on

### Related Commands

- [account list](#account-list) - View all accessible accounts
- [account use](#account-use) - Switch to different account
- [reports account](/en/cli/command-reference/reports#reports-account) - Account analytics

---

## account list

List all accounts you have access to, including parent and sub-accounts.

### Usage

```bash
cakemail account list [options]
```

### Options

- `-r, --recursive` - Include nested sub-accounts (default: true)

### Examples

**List all accessible accounts:**

```bash
$ cakemail account list
```

**Output:**
```
Available accounts:

• My Company (ID: 456) (current)
  Client A (ID: 457)
  Client B (ID: 458)
  Client C (ID: 459)

ℹ Total accessible accounts: 4
```

**List only direct sub-accounts:**

```bash
$ cakemail account list --no-recursive
```

**Output:**
```
Available accounts:

• My Company (ID: 456) (current)
  Client A (ID: 457)
  Client B (ID: 458)

ℹ Total accessible accounts: 3
```

### Account Hierarchy

```
Main Account (456)
├── Sub-Account A (457)
├── Sub-Account B (458)
│   └── Nested Sub-Account (460)  [shown with --recursive]
└── Sub-Account C (459)
```

### Notes

- Current account marked with `•` (green dot)
- Includes main account and all sub-accounts
- `--recursive` shows nested sub-accounts
- Account IDs used with [account use](#account-use)

### Related Commands

- [account use](#account-use) - Switch to listed account
- [account show](#account-show) - View current account details

---

## account use

Switch the active account context to operate on a different account.

### Usage

```bash
cakemail account use <id>
```

### Arguments

- `id` - Account ID to switch to (required)

### Examples

**Switch to sub-account:**

```bash
$ cakemail account use 457
```

**Output:**
```
✓ Now using: Client A (ID: 457)
```

**Verify switch:**

```bash
$ cakemail account show
```

**Output:**
```
ℹ Current account context: 457
{
  "id": "457",
  "name": "Client A"
}
```

**Switch back to main account:**

```bash
$ cakemail account use 456
```

**Output:**
```
✓ Now using: My Company (ID: 456)
```

**Switch to nested sub-account:**

```bash
$ cakemail account use 460
```

### How It Works

1. Verifies account exists and you have access
2. Updates `CAKEMAIL_CURRENT_ACCOUNT_ID` in `.env` file
3. All subsequent commands operate on new account context
4. Persists across CLI sessions

### Use Cases

**Agency managing multiple clients:**
```bash
# Work on Client A's campaigns
$ cakemail account use 457
$ cakemail campaigns list

# Switch to Client B
$ cakemail account use 458
$ cakemail campaigns list

# Switch back to agency account
$ cakemail account use 456
```

**Multi-brand company:**
```bash
# Manage Brand A
$ cakemail account use 457
$ cakemail lists list

# Manage Brand B
$ cakemail account use 458
$ cakemail lists list
```

### Notes

- Account switch persists in `.env` file
- Must have access to target account
- All commands use switched account until changed again
- Does not affect authentication (uses same credentials)

### Related Commands

- [account list](#account-list) - Find account IDs
- [account show](#account-show) - Verify current account

---

## account test

Validate that your stored credentials are working correctly.

### Usage

```bash
cakemail account test
```

### Examples

**Test credentials:**

```bash
$ cakemail account test
```

**Output (success):**
```
✓ Credentials are valid

Authenticated as: admin@example.com
Account: My Company
```

**Output (failure):**
```
✗ Invalid credentials
```

### Use Cases

1. **After authentication** - Verify login worked
2. **Troubleshooting** - Check if credentials expired
3. **Before automation** - Ensure credentials valid before running scripts
4. **Account verification** - Confirm you're authenticated to correct account

### Notes

- Tests credentials stored in `.env` file
- Requires `CAKEMAIL_EMAIL` and `CAKEMAIL_PASSWORD` in `.env`
- Quick way to verify authentication status
- Shows account name if credentials valid

### Related Commands

- [account show](#account-show) - View account details
- [account logout](#account-logout) - Remove invalid credentials

---

## account logout

Remove stored credentials from `.env` file (logout).

### Usage

```bash
cakemail account logout [options]
```

### Options

- `-f, --force` - Skip confirmation prompt (use in scripts)

### Examples

**Logout with confirmation:**

```bash
$ cakemail account logout
```

**Output:**
```
⚠ Log out and remove credentials?

The following will happen:
  • Credentials will be removed from .env file
  • You will need to re-authenticate

Type 'yes' to confirm: yes

✓ Logged out successfully
ℹ Credentials removed from .env file
```

**Force logout without confirmation:**

```bash
$ cakemail account logout --force
```

**Output:**
```
✓ Logged out successfully
ℹ Credentials removed from .env file
```

### What Gets Removed

The following environment variables are deleted from `.env`:
- `CAKEMAIL_EMAIL`
- `CAKEMAIL_PASSWORD`
- `CAKEMAIL_ACCESS_TOKEN`
- `CAKEMAIL_CURRENT_ACCOUNT_ID`

### Use Cases

1. **Security** - Remove credentials when done
2. **Switch users** - Logout before different user authenticates
3. **Credential rotation** - Logout before updating credentials
4. **Shared machines** - Logout on shared/public computers

### Notes

- Credentials removed from `.env` file only
- Does not affect Cakemail account itself
- Need to re-authenticate for future commands
- Confirmation required unless `--force` is used

### Related Commands

- [config init](/en/cli/command-reference/config#config-init) - Re-authenticate after logout
- [account test](#account-test) - Test credentials before logout

---

## Common Workflows

### Workflow 1: Agency Multi-Client Management

```bash
# List all client accounts
$ cakemail account list

# Work on Client A
$ cakemail account use 457
$ cakemail campaigns list
$ cakemail campaigns create -n "Client A Newsletter" -l 123 -s 101

# Switch to Client B
$ cakemail account use 458
$ cakemail campaigns list
$ cakemail campaigns create -n "Client B Promo" -l 124 -s 102

# Return to agency account for reporting
$ cakemail account use 456
$ cakemail reports account
```

### Workflow 2: Credential Verification

```bash
# Test credentials
$ cakemail account test

# View account details
$ cakemail account show

# Check access to sub-accounts
$ cakemail account list

# Try switching accounts
$ cakemail account use 457
$ cakemail account show
```

### Workflow 3: Account Switching Script

```bash
#!/bin/bash
# Script to run reports across all accounts

ACCOUNTS=(456 457 458 459)

for account_id in "${ACCOUNTS[@]}"; do
  echo "Switching to account $account_id..."
  cakemail account use $account_id

  echo "Generating report..."
  cakemail reports account > "report-$account_id.json"

  echo "Report saved for account $account_id"
done

# Switch back to main account
cakemail account use 456
```

### Workflow 4: Secure Logout

```bash
# Check current account
$ cakemail account show

# Verify credentials before logout
$ cakemail account test

# Logout
$ cakemail account logout

# Verify logout
$ cakemail account test
# Output: No credentials found in .env file

# Re-authenticate when needed
$ cakemail config init
```

### Workflow 5: Account Audit

```bash
# List all accounts
$ cakemail account list

# Check main account details
$ cakemail account show

# Iterate through sub-accounts
for id in 457 458 459; do
  echo "Checking account $id..."
  cakemail account use $id
  cakemail account show -f json | jq '{id, name, contacts_used, emails_sent_this_month}'
done

# Return to main account
$ cakemail account use 456
```

## Best Practices

1. **Verify Context**: Always check current account before operations
2. **Document IDs**: Keep list of account IDs and their purposes
3. **Script Safely**: Use `account use` in scripts to ensure correct context
4. **Logout When Done**: Remove credentials on shared/public machines
5. **Test Regularly**: Verify credentials work before automation runs
6. **Use Account Names**: Name sub-accounts clearly for easy identification
7. **Monitor Usage**: Regular check account limits and usage
8. **Audit Access**: Periodically review which accounts you have access to

## Troubleshooting

### Error: "No credentials found in .env file"

Credentials not configured.

**Solution:**
```bash
# Initialize CLI and authenticate
$ cakemail config init

# Or set credentials manually in .env
CAKEMAIL_EMAIL=your@email.com
CAKEMAIL_PASSWORD=yourpassword

# Test credentials
$ cakemail account test
```

### Error: "Account not found or not accessible"

Trying to switch to account you don't have access to.

**Solution:**
```bash
# List accessible accounts
$ cakemail account list

# Use valid account ID from list
$ cakemail account use 457
```

### Error: "Invalid credentials"

Credentials expired or incorrect.

**Solution:**
```bash
# Logout
$ cakemail account logout --force

# Re-authenticate
$ cakemail config init

# Test new credentials
$ cakemail account test
```

### Commands Operating on Wrong Account

Forgot to switch account context.

**Solution:**
```bash
# Check current account
$ cakemail account show

# Switch to correct account
$ cakemail account use 458

# Verify switch
$ cakemail account show

# Run commands
$ cakemail campaigns list
```

### Cannot Switch Accounts

May not have multi-account access.

**Solution:**
```bash
# List accounts to verify
$ cakemail account list

# If only one account shown:
# - You may not have sub-accounts
# - Contact Cakemail support for multi-account access
# - Verify you're using correct credentials
```

### .env File Not Updating

File permissions or path issues.

**Solution:**
```bash
# Check .env file exists
$ ls -la .env

# Verify write permissions
$ chmod 644 .env

# Try manual edit if needed
$ vi .env
# Add: CAKEMAIL_CURRENT_ACCOUNT_ID=457

# Test account switch
$ cakemail account show
```

### Sub-Accounts Not Showing

Recursive flag may be needed.

**Solution:**
```bash
# List with recursive flag (default)
$ cakemail account list -r

# Check if you have sub-account access
# Contact Cakemail support if needed
```

---

**Related Documentation:**
- [Config Commands](/en/cli/command-reference/config/) - CLI configuration and initialization
- [Reports Commands](/en/cli/command-reference/reports/) - Account analytics
- [Lists Commands](/en/cli/command-reference/lists/) - Manage lists across accounts
- [Campaigns Commands](/en/cli/command-reference/campaigns/) - Create campaigns in specific accounts
