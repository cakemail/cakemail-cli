# Sender Commands

Manage verified email sender identities for campaigns and transactional emails.

## Overview

Sender commands allow you to:
- Create and verify sender email addresses
- List all sender identities
- Update sender information
- Delete unused senders
- Confirm sender email addresses via verification link
- Resend verification emails

Verified senders are required for sending campaigns and transactional emails. Email service providers require sender verification to prevent spam and ensure deliverability.

## Commands

- [senders list](#senders-list) - List all senders
- [senders get](#senders-get) - Get sender details
- [senders create](#senders-create) - Create a new sender
- [senders update](#senders-update) - Update sender information
- [senders delete](#senders-delete) - Delete a sender
- [senders confirm](#senders-confirm) - Confirm sender email
- [senders resend-confirmation](#senders-resend-confirmation) - Resend verification email

---

## senders list

List all sender identities in your account with filtering and sorting.

### Usage

```bash
cakemail senders list [options]
```

### Options

- `-l, --limit <number>` - Limit number of results per page
- `-p, --page <number>` - Page number (default: 1)
- `--sort <sort>` - Sort order (e.g., `+name`, `+email`, `-confirmed`)
- `--filter <filter>` - Filter expression (e.g., `confirmed==true`)

### Examples

**List all senders:**

```bash
$ cakemail senders list
```

**Output:**
```
┌────────┬────────────────────┬─────────────────────┬───────────┬─────────────────────┐
│ ID     │ Name               │ Email               │ Confirmed │ Created             │
├────────┼────────────────────┼─────────────────────┼───────────┼─────────────────────┤
│ 101    │ Newsletter Team    │ news@example.com    │ ✓         │ 2024-01-15 10:30:00 │
│ 102    │ Support            │ support@example.com │ ✓         │ 2024-02-01 14:20:00 │
│ 103    │ Marketing          │ promo@example.com   │ ✗         │ 2024-03-10 09:15:00 │
└────────┴────────────────────┴─────────────────────┴───────────┴─────────────────────┘
```

**List only confirmed senders:**

```bash
$ cakemail senders list --filter "confirmed==true"
```

**Output:**
```
┌────────┬────────────────────┬─────────────────────┬───────────┐
│ ID     │ Name               │ Email               │ Confirmed │
├────────┼────────────────────┼─────────────────────┼───────────┤
│ 101    │ Newsletter Team    │ news@example.com    │ ✓         │
│ 102    │ Support            │ support@example.com │ ✓         │
└────────┴────────────────────┴─────────────────────┴───────────┘
```

**Sort by name:**

```bash
$ cakemail senders list --sort "+name"
```

**Sort by most recently created:**

```bash
$ cakemail senders list --sort "-created_at"
```

**Export senders as JSON:**

```bash
$ cakemail senders list -f json > senders.json
```

**Output:**
```json
{
  "data": [
    {
      "id": 101,
      "name": "Newsletter Team",
      "email": "news@example.com",
      "confirmed": true,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "count": 3
}
```

**Find unconfirmed senders:**

```bash
$ cakemail senders list -f json | jq '.data[] | select(.confirmed == false)'
```

### Notes

- Only confirmed senders can be used for campaigns and emails
- Unconfirmed senders show ✗ in the Confirmed column
- Use filtering to quickly find confirmed/unconfirmed senders
- Sort options: `+name`, `-name`, `+email`, `-email`, `+confirmed`, `-confirmed`, `+created_at`, `-created_at`

### Related Commands

- [senders create](#senders-create) - Add new sender
- [senders confirm](#senders-confirm) - Verify sender email
- [campaigns create](/en/cli/command-reference/campaigns#campaigns-create) - Use sender in campaign

---

## senders get

Get detailed information about a specific sender.

### Usage

```bash
cakemail senders get <id>
```

### Arguments

- `id` - Sender ID (required)

### Examples

**Get sender details:**

```bash
$ cakemail senders get 101
```

**Output:**
```
{
  "id": 101,
  "name": "Newsletter Team",
  "email": "news@example.com",
  "confirmed": true,
  "confirmed_at": "2024-01-15T10:45:00Z",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

**Check if sender is confirmed:**

```bash
$ cakemail senders get 101 -f json | jq '.confirmed'
```

**Output:**
```
true
```

**Get sender email:**

```bash
$ cakemail senders get 101 -f json | jq -r '.email'
```

**Output:**
```
news@example.com
```

### Notes

- Shows confirmation status and timestamp
- Confirmed senders can be used immediately
- Unconfirmed senders require email verification

### Related Commands

- [senders list](#senders-list) - Find sender IDs
- [senders update](#senders-update) - Modify sender details
- [senders confirm](#senders-confirm) - Verify sender

---

## senders create

Create a new sender identity and send verification email.

### Usage

```bash
cakemail senders create [options]
```

### Options

- `-n, --name <name>` - Sender name (required)
- `-e, --email <email>` - Sender email address (required)

### Examples

**Create sender:**

```bash
$ cakemail senders create -n "Newsletter Team" -e "news@example.com"
```

**Output:**
```
✓ Sender created: 101
ℹ A confirmation email has been sent to verify this sender
{
  "id": 101,
  "name": "Newsletter Team",
  "email": "news@example.com",
  "confirmed": false,
  "created_at": "2024-03-15T10:30:00Z"
}
```

**Create support sender:**

```bash
$ cakemail senders create -n "Customer Support" -e "support@example.com"
```

**Output:**
```
✓ Sender created: 102
ℹ A confirmation email has been sent to verify this sender
```

**Create marketing sender:**

```bash
$ cakemail senders create -n "Marketing Team" -e "marketing@example.com"
```

### Verification Process

1. Sender created with `confirmed: false` status
2. Verification email sent to the sender address
3. Email contains confirmation link with confirmation ID
4. Click link or use [senders confirm](#senders-confirm) command
5. Sender status changes to `confirmed: true`

### Notes

- Verification email sent automatically after creation
- Sender cannot be used until confirmed
- Must have access to the email address to verify
- Email validation performed before creation
- Verification link expires after 24 hours
- Use [senders resend-confirmation](#senders-resend-confirmation) if email not received

### Related Commands

- [senders confirm](#senders-confirm) - Complete verification
- [senders resend-confirmation](#senders-resend-confirmation) - Resend verification email
- [senders list](#senders-list) - View all senders

---

## senders update

Update an existing sender's name or email address.

### Usage

```bash
cakemail senders update <id> [options]
```

### Arguments

- `id` - Sender ID (required)

### Options

- `-n, --name <name>` - New sender name
- `-e, --email <email>` - New sender email address

### Examples

**Update sender name:**

```bash
$ cakemail senders update 101 -n "Newsletter Team - US"
```

**Output:**
```
✓ Sender 101 updated
{
  "id": 101,
  "name": "Newsletter Team - US",
  "email": "news@example.com",
  "confirmed": true
}
```

**Update sender email:**

```bash
$ cakemail senders update 101 -e "newsletter@example.com"
```

**Output:**
```
✓ Sender 101 updated
{
  "id": 101,
  "name": "Newsletter Team - US",
  "email": "newsletter@example.com",
  "confirmed": false
}
```

**Update both name and email:**

```bash
$ cakemail senders update 101 -n "Marketing Newsletter" -e "marketing@example.com"
```

### Notes

- Only provided fields are updated (partial updates)
- Changing email resets `confirmed` status to `false`
- New verification email sent when email is changed
- Must re-verify email address after change
- Sender ID remains the same

### Related Commands

- [senders get](#senders-get) - View current sender details
- [senders confirm](#senders-confirm) - Verify new email
- [senders create](#senders-create) - Create new sender

---

## senders delete

Permanently delete a sender identity.

### Usage

```bash
cakemail senders delete <id> [options]
```

### Arguments

- `id` - Sender ID (required)

### Options

- `-f, --force` - Skip confirmation prompt (use in scripts)

### Examples

**Delete sender with confirmation:**

```bash
$ cakemail senders delete 103
```

**Output:**
```
⚠ Delete sender 103?

The following will happen:
  • Sender will be permanently deleted

Type 'yes' to confirm: yes

✓ Sender 103 deleted
```

**Force delete without confirmation:**

```bash
$ cakemail senders delete 103 --force
```

**Output:**
```
✓ Sender 103 deleted
```

**Delete in script:**

```bash
$ cakemail senders delete 103 --force --batch
```

### Notes

- Deletion is permanent and cannot be undone
- Cannot delete sender if used in active campaigns
- Historical campaigns keep sender information
- Sender email can be re-added later as new sender
- Confirmation required unless `--force` is used

### Related Commands

- [senders list](#senders-list) - View senders before deletion
- [senders get](#senders-get) - Check sender details

---

## senders confirm

Confirm a sender email address using the confirmation ID from verification email.

### Usage

```bash
cakemail senders confirm <confirmation-id>
```

### Arguments

- `confirmation-id` - Confirmation ID from verification email (required)

### Examples

**Confirm sender:**

```bash
$ cakemail senders confirm abc123def456ghi789
```

**Output:**
```
✓ Sender confirmed
{
  "id": 101,
  "name": "Newsletter Team",
  "email": "news@example.com",
  "confirmed": true,
  "confirmed_at": "2024-03-15T10:45:00Z"
}
```

**Verify confirmation:**

```bash
$ cakemail senders get 101 -f json | jq '.confirmed'
```

**Output:**
```
true
```

### Finding Confirmation ID

The confirmation ID is found in the verification email:

1. Check inbox for email from Cakemail
2. Subject: "Verify your sender email address"
3. Click verification link OR extract ID from URL
4. URL format: `https://app.cakemail.com/verify?id=abc123def456ghi789`
5. Use the ID parameter value in this command

### Notes

- Confirmation ID provided in verification email
- Single-use only (cannot be reused)
- Expires after 24 hours
- Sets sender status to `confirmed: true`
- Sender can be used immediately after confirmation
- Use [senders resend-confirmation](#senders-resend-confirmation) if expired

### Related Commands

- [senders resend-confirmation](#senders-resend-confirmation) - Get new confirmation email
- [senders get](#senders-get) - Check confirmation status
- [senders create](#senders-create) - Create sender

---

## senders resend-confirmation

Resend the verification email for an unconfirmed sender.

### Usage

```bash
cakemail senders resend-confirmation <id>
```

### Arguments

- `id` - Sender ID (required)

### Examples

**Resend confirmation email:**

```bash
$ cakemail senders resend-confirmation 103
```

**Output:**
```
✓ Confirmation email resent for sender 103
```

**Check sender status before resending:**

```bash
$ cakemail senders get 103
```

**Output:**
```
{
  "id": 103,
  "name": "Marketing",
  "email": "promo@example.com",
  "confirmed": false
}
```

**Resend and then confirm:**

```bash
# Resend verification
$ cakemail senders resend-confirmation 103

# Check email for new confirmation ID
# Confirm using ID from email
$ cakemail senders confirm xyz789abc123def456
```

### Use Cases

1. **Original email not received** - Check spam folder first
2. **Confirmation link expired** - Links expire after 24 hours
3. **Email deleted accidentally**
4. **Wrong email address** - Update email first, then resend

### Notes

- Only works for unconfirmed senders
- Generates new confirmation ID (old one invalidated)
- Check spam/junk folders before resending
- Ensure sender email is correct before resending
- No rate limit on resend attempts

### Related Commands

- [senders confirm](#senders-confirm) - Use confirmation ID
- [senders get](#senders-get) - Check if confirmed
- [senders update](#senders-update) - Fix incorrect email

---

## Common Workflows

### Workflow 1: Add and Verify New Sender

```bash
# Create sender
$ cakemail senders create -n "Newsletter" -e "news@example.com"

# Note sender ID from output (e.g., 101)

# Check email inbox for verification email
# Copy confirmation ID from email

# Confirm sender
$ cakemail senders confirm abc123def456ghi789

# Verify confirmation
$ cakemail senders get 101 -f json | jq '.confirmed'
```

### Workflow 2: Handle Missing Verification Email

```bash
# Check sender status
$ cakemail senders get 103

# If not confirmed, resend verification
$ cakemail senders resend-confirmation 103

# Check spam/junk folder
# Wait a few minutes for email delivery

# Confirm with new ID
$ cakemail senders confirm newid123abc456def
```

### Workflow 3: Update Sender Email

```bash
# View current sender
$ cakemail senders get 101

# Update email address
$ cakemail senders update 101 -e "newemail@example.com"

# Note: sender is now unconfirmed
# Check new email for verification

# Confirm new email
$ cakemail senders confirm newemail789xyz123

# Verify update
$ cakemail senders get 101
```

### Workflow 4: Audit Sender List

```bash
# List all senders
$ cakemail senders list

# Find unconfirmed senders
$ cakemail senders list -f json | jq '.data[] | select(.confirmed == false)'

# Resend verifications for unconfirmed
$ cakemail senders resend-confirmation 103
$ cakemail senders resend-confirmation 104

# Delete unused senders
$ cakemail senders delete 105 --force
```

### Workflow 5: Setup Multiple Senders

```bash
# Create senders for different purposes
$ cakemail senders create -n "Newsletter" -e "news@example.com"
$ cakemail senders create -n "Transactional" -e "noreply@example.com"
$ cakemail senders create -n "Support" -e "support@example.com"

# Confirm each sender (check emails)
$ cakemail senders confirm id1
$ cakemail senders confirm id2
$ cakemail senders confirm id3

# List confirmed senders
$ cakemail senders list --filter "confirmed==true"
```

## Best Practices

1. **Use Descriptive Names**: Make sender names clear and purposeful
2. **Verify Promptly**: Confirm senders immediately after creation
3. **Domain Ownership**: Only use email addresses you control
4. **Multiple Senders**: Create separate senders for different email types
5. **Regular Audits**: Periodically review and clean up unused senders
6. **Professional Emails**: Use business/brand email addresses
7. **Check Spam**: Always check spam folder if verification not received
8. **Delete Unused**: Remove senders no longer in use

## Troubleshooting

### Error: "Email address is invalid"

Email format validation failed.

**Solution:**
```bash
# Use valid email format
$ cakemail senders create -n "Newsletter" -e "news@example.com"

# Not valid: "news@example" (missing TLD)
# Not valid: "news.example.com" (missing @)
```

### Verification Email Not Received

Email delivery may be delayed or blocked.

**Solution:**
```bash
# Check spam/junk folder first

# Wait 5-10 minutes for delivery

# Resend if not received
$ cakemail senders resend-confirmation 101

# Verify email address is correct
$ cakemail senders get 101 -f json | jq '.email'

# Update if wrong
$ cakemail senders update 101 -e "correct@example.com"
```

### Error: "Confirmation ID is invalid or expired"

Confirmation link expired (24 hours) or already used.

**Solution:**
```bash
# Resend verification email
$ cakemail senders resend-confirmation 101

# Use new confirmation ID from email
$ cakemail senders confirm newid123
```

### Cannot Delete Sender

Sender may be in use by active campaigns.

**Solution:**
```bash
# Check which campaigns use this sender
$ cakemail campaigns list -f json | jq '.data[] | select(.sender_id == 101)'

# Wait for campaigns to complete
# Or use different sender for campaigns

# Then delete
$ cakemail senders delete 101 --force
```

### Sender Shows as Unconfirmed After Update

Changing email resets confirmation status.

**Solution:**
```bash
# This is expected behavior
# Check email for new verification

# Confirm new email address
$ cakemail senders confirm newemail123

# Verify confirmation
$ cakemail senders get 101 -f json | jq '.confirmed'
```

### Cannot Use Sender in Campaign

Sender must be confirmed first.

**Solution:**
```bash
# Check sender status
$ cakemail senders get 101 -f json | jq '.confirmed'

# If false, resend and confirm
$ cakemail senders resend-confirmation 101
$ cakemail senders confirm id123

# Then use in campaign
$ cakemail campaigns create -n "Test" -l 123 -s 101
```

### Domain Authentication Issues

Sender domain may not be properly authenticated.

**Solution:**
```bash
# Ensure SPF record includes Cakemail
# SPF: v=spf1 include:spf.cakemail.com ~all

# Setup DKIM for your domain
# Contact Cakemail support for DKIM keys

# Verify DMARC policy
# DMARC: v=DMARC1; p=none; rua=mailto:admin@example.com

# Test with external tools
# Use: https://mxtoolbox.com/spf.aspx
```

---

**Related Documentation:**
- [Campaigns Commands](/en/cli/command-reference/campaigns/) - Use senders in campaigns
- [Emails Commands](/en/cli/command-reference/emails/) - Use senders in transactional emails
- [Account Commands](/en/cli/command-reference/account/) - Account settings and configuration
