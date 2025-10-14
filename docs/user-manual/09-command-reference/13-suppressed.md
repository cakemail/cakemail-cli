# Suppressed Commands

Manage the global suppression list to prevent sending emails to specific addresses.

## Overview

Suppressed commands allow you to:
- Add email addresses to the global suppression list
- List all suppressed email addresses
- Remove emails from suppression list
- Export suppression list for backup or analysis
- Manage suppression list exports

The suppression list is a global blocklist that prevents emails from being sent to specific addresses across all lists and campaigns. This is essential for compliance (unsubscribes, bounces, complaints) and sender reputation.

## Commands

- [suppressed list](#suppressed-list) - List suppressed emails
- [suppressed add](#suppressed-add) - Add email to suppression list
- [suppressed delete](#suppressed-delete) - Remove email from suppression list
- [suppressed exports](#suppressed-exports) - List exports
- [suppressed export](#suppressed-export) - Create export
- [suppressed export-get](#suppressed-export-get) - Get export status
- [suppressed export-download](#suppressed-export-download) - Download export
- [suppressed export-delete](#suppressed-export-delete) - Delete export

---

## suppressed list

List all email addresses in the global suppression list.

### Usage

```bash
cakemail suppressed list [options]
```

### Options

- `-l, --limit <number>` - Limit number of results per page
- `-p, --page <number>` - Page number (default: 1)

### Examples

**List all suppressed emails:**

```bash
$ cakemail suppressed list
```

**Output:**
```
┌──────────────────────┬─────────────────────┬─────────────────────┐
│ Email                │ Reason              │ Added               │
├──────────────────────┼─────────────────────┼─────────────────────┤
│ bounce@example.com   │ hard-bounce         │ 2024-01-15 10:30:00 │
│ spam@example.com     │ complaint           │ 2024-02-01 14:20:00 │
│ unsubscribe@ex.com   │ unsubscribe         │ 2024-03-01 09:00:00 │
└──────────────────────┴─────────────────────┴─────────────────────┘
```

**List with pagination:**

```bash
$ cakemail suppressed list -l 50 -p 1
```

**Export suppressed list as JSON:**

```bash
$ cakemail suppressed list -f json > suppressed-list.json
```

**Output:**
```json
{
  "data": [
    {
      "email": "bounce@example.com",
      "reason": "hard-bounce",
      "added_at": "2024-01-15T10:30:00Z"
    },
    {
      "email": "spam@example.com",
      "reason": "complaint",
      "added_at": "2024-02-01T14:20:00Z"
    }
  ],
  "count": 2
}
```

**Count suppressed emails:**

```bash
$ cakemail suppressed list -f json | jq '.count'
```

**Output:**
```
2
```

**Extract email addresses:**

```bash
$ cakemail suppressed list -f json | jq -r '.data[].email' > suppressed-emails.txt
```

### Suppression Reasons

- `hard-bounce` - Email permanently invalid
- `soft-bounce` - Temporary delivery failure (mailbox full, server down)
- `complaint` - Recipient marked email as spam
- `unsubscribe` - Recipient unsubscribed
- `manual` - Manually added to suppression list

### Notes

- Suppression list is global (applies to all lists and campaigns)
- Emails on this list cannot receive any emails from your account
- Use pagination for large suppression lists
- Regular review helps maintain list hygiene

### Related Commands

- [suppressed add](#suppressed-add) - Add email to suppression
- [suppressed export](#suppressed-export) - Export for backup
- [emails logs](/en/cli/command-reference/emails#emails-logs) - View email bounces

---

## suppressed add

Add an email address to the global suppression list.

### Usage

```bash
cakemail suppressed add <email>
```

### Arguments

- `email` - Email address to suppress (required)

### Examples

**Add email to suppression list:**

```bash
$ cakemail suppressed add bounce@example.com
```

**Output:**
```
✓ Email bounce@example.com added to suppression list
{
  "email": "bounce@example.com",
  "added_at": "2024-03-15T10:30:00Z"
}
```

**Add complaint email:**

```bash
$ cakemail suppressed add spam@example.com
```

**Add multiple emails:**

```bash
$ cakemail suppressed add invalid1@example.com
$ cakemail suppressed add invalid2@example.com
$ cakemail suppressed add invalid3@example.com
```

**Add emails from file:**

```bash
$ cat bounced-emails.txt | while read email; do
  cakemail suppressed add "$email"
done
```

**Add after bounce:**

```bash
# Check bounced emails
$ cakemail emails logs --status bounced

# Add bounced email to suppression
$ cakemail suppressed add hardbounce@example.com
```

### Common Use Cases

1. **Hard Bounces**: Permanently invalid email addresses
2. **Spam Complaints**: Recipients who marked email as spam
3. **Legal Requests**: Individuals requesting no further contact
4. **Internal Addresses**: Test or employee emails
5. **Known Invalid**: Catch-all or disposable addresses

### Notes

- Email cannot receive any emails from your account after addition
- Applies immediately to all lists and campaigns
- Email validation performed before adding
- Duplicate additions are ignored (idempotent)
- No automatic removal (must manually delete)

### Related Commands

- [suppressed delete](#suppressed-delete) - Remove from suppression
- [suppressed list](#suppressed-list) - View suppressed emails
- [contacts unsubscribe](/en/cli/command-reference/contacts#contacts-unsubscribe) - Unsubscribe from list

---

## suppressed delete

Remove an email address from the global suppression list.

### Usage

```bash
cakemail suppressed delete <email> [options]
```

### Arguments

- `email` - Email address to remove (required)

### Options

- `-f, --force` - Skip confirmation prompt (use in scripts)

### Examples

**Delete email with confirmation:**

```bash
$ cakemail suppressed delete bounce@example.com
```

**Output:**
```
⚠ Delete suppressed email bounce@example.com?

The following will happen:
  • Email will be removed from the suppression list
  • This email address will be able to receive emails again

Type 'yes' to confirm: yes

✓ Email bounce@example.com removed from suppression list
```

**Force delete without confirmation:**

```bash
$ cakemail suppressed delete bounce@example.com --force
```

**Output:**
```
✓ Email bounce@example.com removed from suppression list
```

**Delete in script:**

```bash
$ cakemail suppressed delete test@example.com --force --batch
```

### Important Warnings

⚠️ **Use with caution!** Removing emails from suppression list can:
- Damage sender reputation if email is invalid
- Violate anti-spam laws if user requested no contact
- Result in spam complaints if email complained previously

**Only remove emails if:**
- Email was added in error
- Contact explicitly requests re-subscription
- You have verified email is valid and deliverable

### Notes

- Email can receive emails immediately after removal
- Applies to all lists and campaigns
- Confirmation required unless `--force` is used
- Consider re-subscribing contact to specific list instead

### Related Commands

- [suppressed add](#suppressed-add) - Re-add if needed
- [suppressed list](#suppressed-list) - Verify removal
- [contacts add](/en/cli/command-reference/contacts#contacts-add) - Re-add to list

---

## suppressed exports

List all suppression list exports.

### Usage

```bash
cakemail suppressed exports [options]
```

### Options

- `-l, --limit <number>` - Limit number of results
- `-p, --page <number>` - Page number

### Examples

**List all exports:**

```bash
$ cakemail suppressed exports
```

**Output:**
```
┌──────────────┬──────────┬─────────────────────┬──────────┐
│ ID           │ Status   │ Created             │ Records  │
├──────────────┼──────────┼─────────────────────┼──────────┤
│ export_abc123│ ready    │ 2024-03-15 10:30:00 │ 1,234    │
│ export_def456│ processing│ 2024-03-15 10:35:00│ -        │
└──────────────┴──────────┴─────────────────────┴──────────┘
```

**List recent exports:**

```bash
$ cakemail suppressed exports -l 5
```

### Notes

- Shows all exports regardless of status
- Exports expire after 30 days
- Use to find previous exports before creating new one

### Related Commands

- [suppressed export](#suppressed-export) - Create new export
- [suppressed export-download](#suppressed-export-download) - Download export

---

## suppressed export

Create a new export of the suppression list.

### Usage

```bash
cakemail suppressed export
```

### Examples

**Create export:**

```bash
$ cakemail suppressed export
```

**Output:**
```
✓ Suppressed emails export created
{
  "id": "export_abc123",
  "status": "processing",
  "created_at": "2024-03-15T10:30:00Z"
}
```

**Check export status:**

```bash
# Create export
$ cakemail suppressed export

# Wait a moment, then check status
$ cakemail suppressed export-get export_abc123

# Download when ready
$ cakemail suppressed export-download export_abc123
```

### Notes

- Export includes all suppressed emails with metadata
- Processing time depends on list size
- Check status before downloading
- CSV format suitable for Excel/Google Sheets

### Related Commands

- [suppressed export-get](#suppressed-export-get) - Check status
- [suppressed export-download](#suppressed-export-download) - Download file
- [suppressed exports](#suppressed-exports) - List all exports

---

## suppressed export-get

Get the status and details of a suppression list export.

### Usage

```bash
cakemail suppressed export-get <export-id>
```

### Arguments

- `export-id` - Export ID (required)

### Examples

**Check export status:**

```bash
$ cakemail suppressed export-get export_abc123
```

**Output:**
```
{
  "id": "export_abc123",
  "status": "ready",
  "created_at": "2024-03-15T10:30:00Z",
  "completed_at": "2024-03-15T10:30:45Z",
  "total_records": 1234,
  "download_url": "https://...",
  "expires_at": "2024-04-14T10:30:45Z"
}
```

**Monitor processing export:**

```bash
$ cakemail suppressed export-get export_def456
```

**Output:**
```
{
  "id": "export_def456",
  "status": "processing",
  "created_at": "2024-03-15T10:35:00Z",
  "progress": 45
}
```

### Status Values

- `processing` - Export being generated
- `ready` - Export ready for download
- `failed` - Export failed (retry needed)

### Notes

- Poll this endpoint to monitor export progress
- `download_url` only available when status is `ready`
- Downloads expire after 30 days

### Related Commands

- [suppressed export](#suppressed-export) - Create export
- [suppressed export-download](#suppressed-export-download) - Download ready export

---

## suppressed export-download

Download a completed suppression list export.

### Usage

```bash
cakemail suppressed export-download <export-id>
```

### Arguments

- `export-id` - Export ID (required)

### Examples

**Download export:**

```bash
$ cakemail suppressed export-download export_abc123
```

**Output:**
```
✓ Export downloaded
{
  "filename": "suppressed_export_abc123.csv",
  "size": 45678,
  "download_url": "https://..."
}
```

**Save to specific file:**

```bash
$ cakemail suppressed export-download export_abc123 -f json | jq -r '.content' > suppressed.csv
```

### Notes

- Export must have status `ready` before download
- File format is CSV
- Contains: email, reason, added_at
- Download URL expires after 24 hours

### Related Commands

- [suppressed export](#suppressed-export) - Create export
- [suppressed export-get](#suppressed-export-get) - Check if ready

---

## suppressed export-delete

Delete a suppression list export file.

### Usage

```bash
cakemail suppressed export-delete <export-id> [options]
```

### Arguments

- `export-id` - Export ID (required)

### Options

- `-f, --force` - Skip confirmation prompt

### Examples

**Delete export with confirmation:**

```bash
$ cakemail suppressed export-delete export_abc123
```

**Output:**
```
⚠ Delete suppressed emails export export_abc123?

The following will happen:
  • Export file will be permanently deleted

Type 'yes' to confirm: yes

✓ Export export_abc123 deleted
```

**Force delete:**

```bash
$ cakemail suppressed export-delete export_abc123 --force
```

**Output:**
```
✓ Export export_abc123 deleted
```

### Notes

- Deletion is permanent
- Export data cannot be recovered
- Exports auto-delete after 30 days

### Related Commands

- [suppressed exports](#suppressed-exports) - List exports
- [suppressed export](#suppressed-export) - Create new export

---

## Common Workflows

### Workflow 1: Handle Bounced Emails

```bash
# Check bounced emails
$ cakemail emails logs --status bounced --from 2024-03-01

# Export bounced emails
$ cakemail emails logs --status bounced -f json | jq -r '.data[].to' > bounces.txt

# Add to suppression list
$ cat bounces.txt | while read email; do
  cakemail suppressed add "$email"
done

# Verify additions
$ cakemail suppressed list -l 10
```

### Workflow 2: Compliance Management

```bash
# Export suppression list for records
$ cakemail suppressed export

# Wait for processing
$ cakemail suppressed export-get export_abc123

# Download when ready
$ cakemail suppressed export-download export_abc123 -f json | jq -r '.content' > suppression-backup-2024-03.csv

# Store securely for compliance
```

### Workflow 3: List Cleanup

```bash
# Export suppression list
$ cakemail suppressed list -f json > current-suppression.json

# Analyze suppression reasons
$ jq '.data | group_by(.reason) | map({reason: .[0].reason, count: length})' current-suppression.json

# Example output:
# [{"reason":"hard-bounce","count":456},
#  {"reason":"complaint","count":12},
#  {"reason":"unsubscribe","count":789}]

# Clean up test emails (carefully!)
$ cakemail suppressed delete test@internal.com --force
```

### Workflow 4: Import Suppression List

```bash
# Import from external source
$ cat external-suppression.txt | while read email; do
  echo "Adding $email..."
  cakemail suppressed add "$email"
done

# Verify imports
$ cakemail suppressed list -f json | jq '.count'
```

### Workflow 5: Regular Audit

```bash
#!/bin/bash
# Monthly suppression audit script

# Export current list
cakemail suppressed export
sleep 10
EXPORT_ID=$(cakemail suppressed exports -f json | jq -r '.data[0].id')

# Download export
cakemail suppressed export-get $EXPORT_ID
cakemail suppressed export-download $EXPORT_ID -f json | jq -r '.content' > "suppression-audit-$(date +%Y-%m).csv"

# Generate report
echo "Suppression List Audit - $(date)"
echo "Total suppressed: $(cakemail suppressed list -f json | jq '.count')"
echo "Hard bounces: $(cakemail suppressed list -f json | jq '[.data[] | select(.reason=="hard-bounce")] | length')"
echo "Complaints: $(cakemail suppressed list -f json | jq '[.data[] | select(.reason=="complaint")] | length')"
```

## Best Practices

1. **Automatic Addition**: Auto-add hard bounces and complaints
2. **Regular Exports**: Export monthly for compliance records
3. **Careful Removal**: Only remove after verification
4. **Monitor Reasons**: Track why emails are suppressed
5. **Respect Unsubscribes**: Never remove unsubscribe suppressions
6. **Legal Compliance**: Maintain suppression list for CAN-SPAM/GDPR
7. **Integration**: Sync with CRM suppression lists
8. **Audit Regularly**: Review and validate suppression list quarterly

## Troubleshooting

### Error: "Email already suppressed"

Email is already on the suppression list.

**Solution:**
```bash
# Check if email exists
$ cakemail suppressed list -f json | jq '.data[] | select(.email == "test@example.com")'

# Addition is idempotent (no error on duplicate)
# No action needed
```

### Email Still Receiving Messages

Email might not be properly suppressed.

**Solution:**
```bash
# Verify email is in suppression list
$ cakemail suppressed list -f json | jq '.data[] | select(.email == "problem@example.com")'

# If not found, add it
$ cakemail suppressed add problem@example.com

# Check for typos in email address
# Verify in campaign/email logs
```

### Cannot Remove Email

Removal prevented for compliance.

**Solution:**
```bash
# Check suppression reason
$ cakemail suppressed list -f json | jq '.data[] | select(.email == "user@example.com")'

# If reason is "complaint", do not remove
# If reason is "unsubscribe", obtain explicit consent first
# Document reason for removal
```

### Export Taking Too Long

Large suppression lists may take time.

**Solution:**
```bash
# Create export
$ cakemail suppressed export

# Check status periodically
$ watch -n 5 'cakemail suppressed export-get export_abc123 -f json | jq .status'

# Download when ready
$ cakemail suppressed export-download export_abc123
```

### Suppression List Too Large

Many suppressed emails may indicate issues.

**Solution:**
```bash
# Analyze suppression reasons
$ cakemail suppressed list -f json | jq '.data | group_by(.reason) | map({reason: .[0].reason, count: length})'

# High hard-bounce rate may indicate:
# - Poor list hygiene
# - Purchased/scraped lists
# - Old, stale contacts

# Solutions:
# - Implement double opt-in
# - Regular list cleaning
# - Email validation before import
# - Re-engagement campaigns
```

### Email Validation Failing

Invalid email format.

**Solution:**
```bash
# Ensure valid email format
$ cakemail suppressed add "user@example.com"

# Not valid: "user@example" (missing TLD)
# Not valid: "userexample.com" (missing @)
# Not valid: "user @example.com" (spaces)
```

---

**Related Documentation:**
- [Emails Commands](/en/cli/command-reference/emails/) - Transactional email sending
- [Campaigns Commands](/en/cli/command-reference/campaigns/) - Campaign sending
- [Contacts Commands](/en/cli/command-reference/contacts/) - Contact management
- [Reports Commands](/en/cli/command-reference/reports/) - Bounce analytics
