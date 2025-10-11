# Error Handling

Understand error messages, HTTP status codes, and how to troubleshoot issues with the Cakemail CLI.

## Overview

The Cakemail CLI provides user-friendly error messages with:
- **Clear error descriptions** - What went wrong
- **Helpful suggestions** - How to fix the issue
- **Actionable tips** - Next steps to take

Understanding errors helps you debug issues quickly and work more efficiently.

---

## Error Message Format

When an error occurs, you'll see a structured message:

```
✗ Error: Campaign not found

→ Campaign 12345 doesn't exist or you don't have access

💡 Tip:
  To see all campaigns, use: cakemail campaigns list
```

**Components:**
1. **Error message** (red) - Brief description of the error
2. **Suggestion** (yellow) - Specific context about what went wrong
3. **Tip** (gray) - Helpful advice on how to resolve

---

## HTTP Status Codes

The CLI maps API HTTP status codes to user-friendly messages.

### 400 - Bad Request

**What it means:** Invalid request parameters

**Example:**
```bash
$ cakemail campaigns create -n "Test"

✗ Error: Invalid request parameters

→ Check the parameters for 'create' operation

💡 Tip:
  Use --help to see available options
```

**Common causes:**
- Missing required parameters
- Invalid parameter values
- Malformed data (e.g., invalid JSON)

**How to fix:**
1. Check the command syntax: `cakemail campaigns create --help`
2. Verify all required options are provided
3. Validate parameter values (e.g., email format, date format)

---

### 401 - Unauthorized

**What it means:** Authentication failed

**Example:**
```bash
$ cakemail campaigns list

✗ Error: Authentication failed

→ Your credentials are invalid or expired

💡 Tip:
  To re-authenticate, run: cakemail account logout --force
  Then run any command to authenticate again
  Or check your .env file credentials
```

**Common causes:**
- Invalid access token
- Incorrect email/password
- Expired session
- Missing credentials

**How to fix:**
1. Verify credentials in `.env` file
2. Test credentials: `cakemail account test`
3. Re-authenticate:
   ```bash
   cakemail account logout --force
   # Then run any command to authenticate again
   ```
4. Generate new access token if using token auth

---

### 403 - Forbidden

**What it means:** Permission denied

**Example:**
```bash
$ cakemail campaigns delete 12345 --force

✗ Error: Permission denied

→ You don't have permission to access this campaign

💡 Tip:
  Check if campaign 12345 exists and you have access
```

**Common causes:**
- Accessing a resource you don't own
- Insufficient account permissions
- Wrong account context

**How to fix:**
1. Verify you're using the correct account:
   ```bash
   cakemail account show
   ```
2. Check if resource exists:
   ```bash
   cakemail campaigns get 12345
   ```
3. Switch to correct account if needed:
   ```bash
   cakemail account use <correct-account-id>
   ```

---

### 404 - Not Found

**What it means:** Resource doesn't exist

**Example:**
```bash
$ cakemail campaigns get 99999

✗ Error: Campaign not found

→ Campaign with ID '99999' doesn't exist

💡 Tip:
  To see all campaigns, use: cakemail campaigns list
```

**Common causes:**
- Wrong resource ID
- Resource was deleted
- Typo in ID
- Wrong account context

**How to fix:**
1. List available resources:
   ```bash
   cakemail campaigns list
   cakemail lists list
   cakemail contacts list <list-id>
   ```
2. Verify the ID is correct
3. Check you're in the right account context

---

### 409 - Conflict

**What it means:** Resource already exists

**Example:**
```bash
$ cakemail senders create -n "John" -e "john@example.com"

✗ Error: Conflict - resource already exists

→ This sender already exists or conflicts with existing data

💡 Tip:
  Try updating the existing resource instead of creating a new one
```

**Common causes:**
- Duplicate email addresses
- Duplicate names (in some resources)
- Resource already exists

**How to fix:**
1. Check if resource exists:
   ```bash
   cakemail senders list --filter "email==john@example.com"
   ```
2. Update existing resource instead:
   ```bash
   cakemail senders update <id> -n "John Updated"
   ```

---

### 422 - Validation Error

**What it means:** Invalid field values

**Example:**
```bash
$ cakemail contacts add 123 -e "invalid-email"

✗ Error: Validation error

→ email: Invalid email format
  first_name: Field is required

💡 Tip:
  Check the error details above for specific field errors
```

**Common causes:**
- Invalid email format
- Missing required fields
- Field value out of range
- Invalid date format

**How to fix:**
1. Check error details for specific field issues
2. Validate input formats:
   - Email: `user@example.com`
   - Date: `YYYY-MM-DD` (e.g., `2024-06-15`)
   - JSON: Valid JSON syntax
3. Provide all required fields

---

### 429 - Rate Limit Exceeded

**What it means:** Too many requests

**Example:**
```bash
✗ Error: Rate limit exceeded

→ You're making too many requests

💡 Tip:
  Wait a moment before trying again, or reduce request frequency
```

**Common causes:**
- Running scripts too quickly
- Multiple parallel requests
- Hitting API rate limits

**How to fix:**
1. Add delays between requests in scripts:
   ```bash
   for id in $IDS; do
     cakemail campaigns get $id
     sleep 1  # Wait 1 second between requests
   done
   ```
2. Reduce parallelism
3. Batch operations where possible

---

### 500 - Server Error

**What it means:** Internal server error

**Example:**
```bash
✗ Error: Server error

→ Something went wrong on the Cakemail server

💡 Tip:
  This is not your fault. Please try again in a few moments or contact support
```

**Common causes:**
- Temporary server issue
- Unexpected API error
- Service degradation

**How to fix:**
1. Wait a few minutes and retry
2. Check Cakemail status page (if available)
3. Contact support if persists

---

### 502/503 - Service Unavailable

**What it means:** API temporarily unavailable

**Example:**
```bash
✗ Error: Service unavailable

→ The Cakemail API is temporarily down for maintenance

💡 Tip:
  Please try again later
```

**Common causes:**
- Scheduled maintenance
- Service outage
- Network issues

**How to fix:**
1. Wait and retry later
2. Check Cakemail announcements
3. Monitor status updates

---

## Common Error Patterns

### Network Connection Errors

**Error:**
```bash
✗ Error: Network connection error

→ Unable to connect to the Cakemail API

💡 Tip:
  Check your internet connection
  Verify the API endpoint is correct
  Check if there's a firewall blocking the connection
```

**Causes:**
- No internet connection
- Firewall blocking requests
- VPN issues
- Incorrect API base URL

**Solutions:**
1. Test internet: `ping api.cakemail.dev`
2. Check firewall settings
3. Verify `.env` file doesn't override API base URL
4. Try different network

---

### Invalid Email Address

**Error:**
```bash
✗ Error: Invalid email address

→ Please provide a valid email address

💡 Tip:
  Example: user@example.com
```

**Causes:**
- Missing `@` symbol
- Invalid domain
- Special characters
- Spaces in email

**Solutions:**
1. Check email format: `user@domain.com`
2. Remove spaces and special characters
3. Verify domain has proper TLD

---

### Missing Credentials

**Error:**
```bash
✗ Error: Missing credentials

→ Authentication credentials are not configured

💡 Tip:
  Set credentials in .env file or environment variables:
    CAKEMAIL_EMAIL=your@email.com
    CAKEMAIL_PASSWORD=your_password

  Or run any command to authenticate interactively
```

**Causes:**
- No `.env` file
- Missing environment variables
- Typo in credential variable names

**Solutions:**
1. Create `.env` file:
   ```bash
   CAKEMAIL_ACCESS_TOKEN=your_token
   # OR
   CAKEMAIL_EMAIL=your@email.com
   CAKEMAIL_PASSWORD=your_password
   ```
2. Set environment variables:
   ```bash
   export CAKEMAIL_ACCESS_TOKEN=your_token
   ```
3. Run command to authenticate interactively

---

### Resource Not Found

**Error:**
```bash
✗ Error: List not found

→ List 123 doesn't exist or you don't have access

💡 Tip:
  Use: cakemail lists list    to see all available lists
```

**Causes:**
- Wrong ID
- Resource deleted
- Wrong account
- Typo

**Solutions:**
1. List resources:
   ```bash
   cakemail lists list
   cakemail campaigns list
   cakemail contacts list <list-id>
   ```
2. Verify account context:
   ```bash
   cakemail account show
   ```
3. Check ID for typos

---

## Debugging Strategies

### 1. Check Command Syntax

Always verify command syntax first:

```bash
# Get help for specific command
cakemail campaigns create --help
cakemail contacts add --help
```

### 2. Test Authentication

Verify credentials work:

```bash
cakemail account test
cakemail account show
```

### 3. Verify Resource Exists

Before operating on a resource, check it exists:

```bash
# Check campaign exists
cakemail campaigns get 12345

# Check list exists
cakemail lists get 789

# Check contact exists
cakemail contacts get <list-id> <contact-id>
```

### 4. Use JSON Format for Details

JSON output provides full error details:

```bash
cakemail -f json campaigns create -n "Test"
```

### 5. Check Account Context

Verify you're using the correct account:

```bash
cakemail account show
cakemail account list
```

### 6. Test with Simple Operations

Start with basic operations that should work:

```bash
# List operations rarely fail
cakemail campaigns list --limit 1
cakemail lists list --limit 1
```

### 7. Validate Input Data

Test input values before using in commands:

```bash
# Test email format
echo "user@example.com" | grep -E '^[^\s@]+@[^\s@]+\.[^\s@]+$'

# Test JSON syntax
echo '{"key":"value"}' | jq .

# Test date format
date -d "2024-06-15" || echo "Invalid date"
```

---

## Validation Helpers

The CLI includes built-in validation for common data types:

### Email Validation

**Valid:**
- `user@example.com`
- `john.doe@company.co.uk`
- `admin+tag@domain.com`

**Invalid:**
- `user@` (missing domain)
- `@example.com` (missing user)
- `user @example.com` (space)
- `user` (missing @)

### ID Validation

**Valid:**
- `123`
- `456789`

**Invalid:**
- `-1` (negative)
- `0` (zero)
- `abc` (non-numeric)
- `12.5` (decimal)

### Date Validation

**Valid:**
- `2024-06-15`
- `2024-01-01`

**Invalid:**
- `06/15/2024` (wrong format)
- `2024-6-15` (missing zero padding)
- `2024-13-01` (invalid month)
- `tomorrow` (text)

### JSON Validation

**Valid:**
```bash
'{"name":"John","age":30}'
'{"key":"value"}'
```

**Invalid:**
```bash
'{name:John}' (unquoted keys)
"{'name':'John'}" (single quotes)
'{name}' (incomplete)
```

---

## Error Handling in Scripts

### Exit Codes

The CLI returns exit codes for scripting:

- `0` - Success
- `1` - Error

**Example:**
```bash
#!/bin/bash

if cakemail campaigns get 12345; then
  echo "Campaign exists"
else
  echo "Campaign not found"
  exit 1
fi
```

### Capturing Errors

**Capture stderr:**
```bash
ERROR=$(cakemail campaigns get 99999 2>&1)
if [ $? -ne 0 ]; then
  echo "Error occurred: $ERROR"
fi
```

**Check JSON response:**
```bash
RESPONSE=$(cakemail -f json campaigns get 12345 2>&1)
if echo "$RESPONSE" | jq -e . > /dev/null 2>&1; then
  # Valid JSON - success
  echo "Success"
else
  # Error occurred
  echo "Error: $RESPONSE"
fi
```

### Retry Logic

**Simple retry:**
```bash
MAX_RETRIES=3
RETRY=0

while [ $RETRY -lt $MAX_RETRIES ]; do
  if cakemail campaigns get 12345; then
    break
  fi
  RETRY=$((RETRY + 1))
  echo "Retry $RETRY of $MAX_RETRIES..."
  sleep 2
done
```

---

## Getting Help

When errors persist:

1. **Check documentation**
   - This user manual
   - Command help: `cakemail <command> --help`

2. **Search existing issues**
   - GitHub: https://github.com/cakemail-org/cakemail-cli/issues

3. **Create new issue**
   - Include CLI version: `cakemail --version`
   - Include full error message
   - Include command you ran (redact credentials)
   - Include OS and Node.js version

4. **Contact support**
   - For API-related issues
   - For account-specific problems

---

## Error Prevention Tips

### 1. Validate Before Creating

```bash
# Bad: Create without checking
cakemail lists create -n "Newsletter"

# Good: Check if exists first
cakemail lists list --filter "name==Newsletter" | grep Newsletter || \
  cakemail lists create -n "Newsletter"
```

### 2. Use --help Frequently

```bash
# Always check command syntax
cakemail campaigns create --help
```

### 3. Test with --limit 1

```bash
# Test operations on small datasets
cakemail campaigns list --limit 1
```

### 4. Use Confirmation Flags

```bash
# CLI prompts for confirmation on destructive operations
cakemail campaigns delete 12345

# Use --force carefully
cakemail campaigns delete 12345 --force
```

### 5. Keep Credentials Updated

```bash
# Test regularly
cakemail account test
```

---

## Next Steps

- [API Coverage](./api-coverage.md) - Understand CLI capabilities
- [Troubleshooting](../10-troubleshooting/README.md) - Common issues and solutions
- [Quick Start](../01-getting-started/quick-start.md) - Practice with examples
