# Common Errors & Solutions

Troubleshoot common issues and error messages when using the Cakemail CLI.

## Authentication Errors

### Error: "No credentials found in .env file"

**Problem:** CLI cannot find authentication credentials.

**Solutions:**
```bash
# Initialize CLI
$ cakemail config init

# Or manually create .env file
$ cat > .env << EOF
CAKEMAIL_EMAIL=your@email.com
CAKEMAIL_PASSWORD=your_password
EOF

# Verify
$ cakemail account test
```

### Error: "Invalid credentials"

**Problem:** Email or password is incorrect.

**Solutions:**
```bash
# Re-initialize with correct credentials
$ cakemail config init

# Check credentials in .env
$ cat .env | grep CAKEMAIL

# Test authentication
$ cakemail account test
```

### Error: "Access token expired"

**Problem:** Stored access token is no longer valid.

**Solutions:**
```bash
# Remove expired token
$ sed -i '/CAKEMAIL_ACCESS_TOKEN/d' .env

# Re-authenticate
$ cakemail account show
# CLI will automatically get new token
```

## Resource Not Found Errors

### Error: "Campaign not found"

**Problem:** Campaign ID doesn't exist or was deleted.

**Solutions:**
```bash
# List available campaigns
$ cakemail campaigns list

# Check specific campaign
$ cakemail campaigns get CAMPAIGN_ID

# Verify ID is correct
```

### Error: "List not found"

**Problem:** Invalid list ID.

**Solutions:**
```bash
# List all lists
$ cakemail lists list

# Use correct list ID
$ cakemail lists get 123
```

### Error: "Contact not found"

**Problem:** Contact ID doesn't exist in specified list.

**Solutions:**
```bash
# Search by email
$ cakemail contacts list 123 --filter "email==user@example.com"

# Verify list and contact IDs match
$ cakemail contacts get 123 501
```

## Validation Errors

### Error: "Invalid email format"

**Problem:** Email address format is incorrect.

**Solutions:**
```bash
# Valid format
$ cakemail contacts add 123 -e "user@example.com"

# Invalid formats
user@example       # Missing domain extension
user.example.com   # Missing @
@example.com       # Missing local part
```

### Error: "Required field missing"

**Problem:** Command is missing required parameter.

**Solutions:**
```bash
# Campaign creation requires name, list, sender
$ cakemail campaigns create \
  -n "Campaign Name" \
  -l 123 \
  -s 101

# Check command help
$ cakemail campaigns create --help
```

### Error: "Invalid JSON format"

**Problem:** Malformed JSON in custom attributes or conditions.

**Solutions:**
```bash
# Validate JSON first
$ echo '{"plan":"premium"}' | jq .

# Correct format
$ cakemail contacts add 123 -e "user@example.com" \
  -d '{"plan":"premium","signup_date":"2024-03-15"}'

# Common mistakes
-d '{plan:premium}'              # Missing quotes
-d '{"plan":"premium"'           # Missing closing brace
-d "{\"plan\":\"premium\"}"      # Correct (escaped)
```

## Permission Errors

### Error: "Insufficient permissions"

**Problem:** Account doesn't have access to perform action.

**Solutions:**
```bash
# Check account type
$ cakemail account show

# Verify account has necessary permissions
# Contact Cakemail support if needed
```

### Error: "Cannot access list"

**Problem:** List belongs to different account or doesn't exist.

**Solutions:**
```bash
# Check which account you're using
$ cakemail account show

# List accessible lists
$ cakemail lists list

# Switch accounts if needed
$ cakemail account use 457
```

## Rate Limiting

### Error: "Rate limit exceeded"

**Problem:** Too many requests in short time period.

**Solutions:**
```bash
# Add delays between requests
for id in {1..100}; do
  cakemail contacts add 123 -e "user${id}@example.com"
  sleep 1  # Wait 1 second
done

# Use bulk operations instead
$ cakemail contacts import 123 --file contacts.csv

# Wait before retrying
$ sleep 60 && cakemail campaigns list
```

## Network Errors

### Error: "Connection timeout"

**Problem:** Cannot connect to Cakemail API.

**Solutions:**
```bash
# Check internet connection
$ ping api.cakemail.com

# Check proxy settings if applicable
$ env | grep -i proxy

# Try again
$ cakemail campaigns list

# Check API status
# Visit status.cakemail.com
```

### Error: "Network unreachable"

**Problem:** Network configuration issue.

**Solutions:**
```bash
# Test network connectivity
$ curl -I https://api.cakemail.com

# Check firewall rules
# Ensure outbound HTTPS (443) is allowed

# Try with different network
```

## File Operation Errors

### Error: "File not found"

**Problem:** Specified file doesn't exist.

**Solutions:**
```bash
# Check file exists
$ ls -la campaign.html

# Use absolute path
$ cakemail campaigns create -n "Test" \
  --html-file /full/path/to/campaign.html

# Check current directory
$ pwd
```

### Error: "Permission denied"

**Problem:** Cannot read/write file.

**Solutions:**
```bash
# Check file permissions
$ ls -la .env

# Fix permissions
$ chmod 600 .env

# Ensure file is readable
$ chmod 644 campaign.html
```

### Error: "File too large"

**Problem:** File exceeds size limit.

**Solutions:**
```bash
# Check file size
$ ls -lh campaign.html

# Optimize HTML
# - Compress images
# - Minify HTML
# - Remove unused code

# Split into smaller files if needed
```

## Import/Export Errors

### Error: "Invalid CSV format"

**Problem:** CSV file has formatting issues.

**Solutions:**
```bash
# Check CSV structure
$ head -5 contacts.csv

# Ensure proper format
email,first_name,last_name
user1@example.com,John,Doe
user2@example.com,Jane,Smith

# Check for common issues
# - Missing header row
# - Inconsistent column count
# - Special characters not escaped
```

### Error: "Import failed: duplicate emails"

**Problem:** CSV contains duplicate email addresses.

**Solutions:**
```bash
# Find duplicates
$ cut -d',' -f1 contacts.csv | sort | uniq -d

# Remove duplicates
$ sort -u -t',' -k1,1 contacts.csv > contacts-unique.csv

# Import cleaned file
$ cakemail contacts import 123 --file contacts-unique.csv
```

## Campaign Errors

### Error: "Cannot schedule draft campaign"

**Problem:** Campaign is not in correct state.

**Solutions:**
```bash
# Check campaign status
$ cakemail campaigns get 790 -f json | jq '.status'

# If not draft, unschedule first
$ cakemail campaigns unschedule 790

# Then schedule
$ cakemail campaigns schedule 790
```

### Error: "Sender not verified"

**Problem:** Sender email address not verified.

**Solutions:**
```bash
# List senders
$ cakemail senders list

# Check verification status
$ cakemail senders get 101 -f json | jq '.confirmed'

# Resend verification
$ cakemail senders verify 101

# Use verified sender
$ cakemail campaigns update 790 --sender-id 102
```

### Error: "List has no contacts"

**Problem:** Trying to send to empty list.

**Solutions:**
```bash
# Check contact count
$ cakemail lists get 123 -f json | jq '.contacts_count'

# Add contacts
$ cakemail contacts add 123 -e "user@example.com"

# Or import
$ cakemail contacts import 123 --file contacts.csv
```

## Debugging Tips

### Enable Verbose Output

```bash
# Most commands support verbose flag
$ cakemail campaigns list --verbose

# Check raw API responses
$ cakemail campaigns get 790 -f json | jq .
```

### Check CLI Version

```bash
$ cakemail --version

# Update if needed
$ npm update -g @cakemail-org/cakemail-cli
```

### View Configuration

```bash
# Check .env file
$ cat .env

# Verify account
$ cakemail account show
```

### Test Connectivity

```bash
# Test authentication
$ cakemail account test

# Simple API call
$ cakemail lists list
```

## Getting Help

### Command Help

```bash
# General help
$ cakemail --help

# Command-specific help
$ cakemail campaigns --help
$ cakemail campaigns create --help
```

### Check Logs

```bash
# Application logs
$ tail -f ~/.cakemail/logs/cli.log

# System logs
$ journalctl -u cakemail
```

### Report Issues

```bash
# Gather debug information
$ cakemail --version
$ cakemail account show
$ cat .env | grep -v PASSWORD

# Report at:
# https://github.com/anthropics/cakemail-cli/issues
```

