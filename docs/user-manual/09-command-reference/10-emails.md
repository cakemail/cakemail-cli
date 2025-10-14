# Email Commands

Send and track transactional emails using the Cakemail Email API v2.

## Overview

Email commands allow you to:
- Send transactional emails with HTML and text content
- Use templates with dynamic parameters
- Track email opens and clicks
- Attach files to emails
- Tag emails for categorization
- View email delivery logs and status
- Render emails for testing

The Email API v2 is designed for transactional emails (password resets, receipts, notifications) rather than bulk marketing campaigns. For campaigns, use [campaign commands](/en/cli/command-reference/campaigns/).

## Commands

- [emails send](#emails-send) - Submit an email to be sent
- [emails get](#emails-get) - Retrieve email details
- [emails render](#emails-render) - Render email HTML
- [emails logs](#emails-logs) - View Email API logs
- [emails tags](#emails-tags) - List email tags

---

## emails send

Submit a transactional email to be sent via Email API v2.

### Usage

```bash
cakemail emails send [options]
```

### Options

**Required:**
- `-t, --to <email>` - Recipient email address
- `-s, --subject <subject>` - Email subject

**Sender:**
- `--from-email <email>` - Sender email address
- `--from-name <name>` - Sender name
- `--reply-to <email>` - Reply-to email address

**Content (choose one approach):**
- `--html <html>` - HTML content (inline)
- `--html-file <path>` - Path to HTML file
- `--text <text>` - Plain text content (inline)
- `--text-file <path>` - Path to text file
- `--template-id <id>` - Use transactional template
- `--params <json>` - Template parameters as JSON

**Additional:**
- `--tracking` - Enable open and click tracking
- `--tags <tags>` - Comma-separated tags for categorization
- `--headers <json>` - Custom headers as JSON object
- `--attachments <json>` - Attachments as JSON array

### Examples

**Send simple HTML email:**

```bash
$ cakemail emails send \
  -t john@example.com \
  -s "Welcome to Our Service" \
  --html "<h1>Welcome!</h1><p>Thanks for signing up.</p>" \
  --from-email noreply@example.com \
  --from-name "Example Team"
```

**Output:**
```
✓ Email submitted: email_abc123
{
  "id": "email_abc123",
  "to": "john@example.com",
  "subject": "Welcome to Our Service",
  "status": "queued",
  "submitted_at": "2024-03-15T10:30:00Z"
}
```

**Send email from HTML file:**

```bash
$ cakemail emails send \
  -t jane@example.com \
  -s "Your Receipt" \
  --html-file ./templates/receipt.html \
  --from-email receipts@example.com
```

**Output:**
```
✓ Email submitted: email_def456
{
  "id": "email_def456",
  "to": "jane@example.com",
  "subject": "Your Receipt",
  "status": "queued"
}
```

**Send with tracking enabled:**

```bash
$ cakemail emails send \
  -t user@example.com \
  -s "Product Update" \
  --html-file ./updates/march.html \
  --from-email updates@example.com \
  --tracking
```

**Send with tags for categorization:**

```bash
$ cakemail emails send \
  -t customer@example.com \
  -s "Order Confirmation" \
  --html-file ./order-confirmation.html \
  --from-email orders@example.com \
  --tags "order,confirmation,automated"
```

**Output:**
```
✓ Email submitted: email_ghi789
{
  "id": "email_ghi789",
  "to": "customer@example.com",
  "tags": ["order", "confirmation", "automated"]
}
```

**Send using template with parameters:**

```bash
$ cakemail emails send \
  -t user@example.com \
  -s "Password Reset" \
  --template-id 789 \
  --params '{"reset_link":"https://example.com/reset/abc123","username":"John"}' \
  --from-email security@example.com
```

**Output:**
```
✓ Email submitted: email_jkl012
{
  "id": "email_jkl012",
  "template_id": 789,
  "status": "queued"
}
```

**Send with reply-to and custom headers:**

```bash
$ cakemail emails send \
  -t support-request@example.com \
  -s "Support Ticket #1234" \
  --html "<p>A new support ticket has been created.</p>" \
  --from-email noreply@example.com \
  --reply-to customer@example.com \
  --headers '{"X-Ticket-ID":"1234","X-Priority":"high"}'
```

**Send multipart (HTML + text):**

```bash
$ cakemail emails send \
  -t user@example.com \
  -s "Newsletter" \
  --html-file ./newsletter.html \
  --text-file ./newsletter.txt \
  --from-email newsletter@example.com
```

### Notes

- Must provide either content (HTML/text) or template ID
- HTML and text can be combined for multipart emails
- Tracking requires HTML content (not available for plain text only)
- Tags help organize and filter emails in logs
- Template parameters must be valid JSON
- Attachments require base64-encoded content in JSON format
- Rate limits apply based on your account tier

### Related Commands

- [emails get](#emails-get) - Check email status
- [emails logs](#emails-logs) - View delivery logs
- [transactional-templates list](/en/cli/command-reference/transactional-templates#transactional-templates-list) - List templates

---

## emails get

Retrieve details and status of a submitted email.

### Usage

```bash
cakemail emails get <email-id>
```

### Arguments

- `email-id` - Email ID returned from [emails send](#emails-send)

### Examples

**Get email details:**

```bash
$ cakemail emails get email_abc123
```

**Output:**
```
{
  "id": "email_abc123",
  "to": "john@example.com",
  "from": {
    "email": "noreply@example.com",
    "name": "Example Team"
  },
  "subject": "Welcome to Our Service",
  "status": "delivered",
  "submitted_at": "2024-03-15T10:30:00Z",
  "delivered_at": "2024-03-15T10:30:15Z",
  "opens": 1,
  "clicks": 2,
  "tags": ["welcome", "onboarding"]
}
```

**Check if email was delivered:**

```bash
$ cakemail emails get email_abc123 -f json | jq '.status'
```

**Output:**
```
"delivered"
```

**Check email tracking stats:**

```bash
$ cakemail emails get email_abc123 -f json | jq '{opens, clicks, status}'
```

**Output:**
```json
{
  "opens": 1,
  "clicks": 2,
  "status": "delivered"
}
```

### Status Values

- `queued` - Email accepted and queued for sending
- `sent` - Email sent to recipient's mail server
- `delivered` - Email successfully delivered
- `bounced` - Email bounced (hard or soft bounce)
- `complained` - Recipient marked as spam
- `failed` - Email failed to send

### Notes

- Status updates in real-time as email is processed
- Tracking stats only available if tracking was enabled
- Bounced emails include bounce reason
- Use this to verify delivery before follow-up actions

### Related Commands

- [emails send](#emails-send) - Send email
- [emails logs](#emails-logs) - View all email logs

---

## emails render

Render the HTML content of a submitted email for testing or preview.

### Usage

```bash
cakemail emails render <email-id> [options]
```

### Arguments

- `email-id` - Email ID to render

### Options

- `--as-submitted` - Render original submitted content (before processing)
- `--tracking` - Enable tracking links in rendered HTML

### Examples

**Render email HTML:**

```bash
$ cakemail emails render email_abc123
```

**Output:**
```
{
  "html": "<!DOCTYPE html>\n<html>\n<head>...</head>\n<body>\n<h1>Welcome!</h1>\n<p>Thanks for signing up.</p>\n</body>\n</html>"
}
```

**Render with tracking enabled:**

```bash
$ cakemail emails render email_abc123 --tracking
```

**Output:**
```
{
  "html": "<!DOCTYPE html>\n<html>\n<body>\n<h1>Welcome!</h1>\n<p>Thanks for signing up.</p>\n<img src='https://track.cakemail.com/open/...' />\n</body>\n</html>"
}
```

**Save rendered HTML to file:**

```bash
$ cakemail emails render email_abc123 -f json | jq -r '.html' > rendered.html
```

**Render as originally submitted:**

```bash
$ cakemail emails render email_abc123 --as-submitted
```

### Notes

- Useful for debugging email appearance
- `--tracking` shows how tracking pixels/links are inserted
- `--as-submitted` bypasses any post-processing
- Rendered HTML includes full document structure
- Template variables are replaced with actual values

### Related Commands

- [emails get](#emails-get) - Get email metadata
- [emails send](#emails-send) - Send test email

---

## emails logs

View Email API activity logs with filtering and pagination.

### Usage

```bash
cakemail emails logs [options]
```

### Options

- `--from <date>` - Start date (YYYY-MM-DD format)
- `--to <date>` - End date (YYYY-MM-DD format)
- `--tag <tag>` - Filter by tag
- `--status <status>` - Filter by status (delivered, bounced, etc.)
- `-l, --limit <number>` - Limit number of results
- `-p, --page <number>` - Page number

### Examples

**View recent logs:**

```bash
$ cakemail emails logs
```

**Output:**
```
┌──────────────┬─────────────────────┬─────────────┬───────────┬─────────────────────┐
│ ID           │ To                  │ Subject     │ Status    │ Submitted           │
├──────────────┼─────────────────────┼─────────────┼───────────┼─────────────────────┤
│ email_abc123 │ john@example.com    │ Welcome...  │ delivered │ 2024-03-15 10:30:00 │
│ email_def456 │ jane@example.com    │ Receipt     │ delivered │ 2024-03-15 09:15:00 │
│ email_ghi789 │ bob@example.com     │ Update      │ bounced   │ 2024-03-15 08:00:00 │
└──────────────┴─────────────────────┴─────────────┴───────────┴─────────────────────┘
```

**Filter by date range:**

```bash
$ cakemail emails logs --from 2024-03-01 --to 2024-03-15
```

**Filter by status:**

```bash
$ cakemail emails logs --status bounced
```

**Output:**
```
┌──────────────┬─────────────────────┬─────────────┬───────────┬─────────────────────┐
│ ID           │ To                  │ Subject     │ Status    │ Submitted           │
├──────────────┼─────────────────────┼─────────────┼───────────┼─────────────────────┤
│ email_ghi789 │ bob@example.com     │ Update      │ bounced   │ 2024-03-15 08:00:00 │
│ email_jkl012 │ invalid@bad.com     │ Alert       │ bounced   │ 2024-03-14 16:20:00 │
└──────────────┴─────────────────────┴─────────────┴───────────┴─────────────────────┘
```

**Filter by tag:**

```bash
$ cakemail emails logs --tag "order" -l 10
```

**Output:**
```
┌──────────────┬─────────────────────┬─────────────┬───────────┬─────────────┐
│ ID           │ To                  │ Subject     │ Status    │ Tags        │
├──────────────┼─────────────────────┼─────────────┼───────────┼─────────────┤
│ email_mno345 │ customer@ex.com     │ Order #1001 │ delivered │ order,conf  │
│ email_pqr678 │ buyer@example.com   │ Order #1002 │ delivered │ order,conf  │
└──────────────┴─────────────────────┴─────────────┴───────────┴─────────────┘
```

**Combine filters:**

```bash
$ cakemail emails logs \
  --from 2024-03-01 \
  --to 2024-03-15 \
  --status delivered \
  --tag "welcome" \
  -l 50
```

**Export logs to JSON:**

```bash
$ cakemail emails logs --from 2024-03-01 --to 2024-03-15 -f json > email-logs.json
```

### Status Filter Values

- `queued` - Email in queue
- `sent` - Email sent
- `delivered` - Successfully delivered
- `bounced` - Bounced (hard or soft)
- `complained` - Marked as spam
- `failed` - Failed to send

### Notes

- Logs are retained for 90 days
- Date range is required for large result sets
- Use pagination for large log volumes
- Tags help organize and filter transactional emails
- Status filter helps identify delivery issues

### Related Commands

- [emails get](#emails-get) - Get individual email details
- [emails tags](#emails-tags) - List all email tags
- [reports emails](/en/cli/command-reference/reports#reports-emails) - Email API analytics

---

## emails tags

List all tags used in Email API emails.

### Usage

```bash
cakemail emails tags
```

### Examples

**List all email tags:**

```bash
$ cakemail emails tags
```

**Output:**
```
{
  "tags": [
    {
      "name": "order",
      "count": 1234
    },
    {
      "name": "confirmation",
      "count": 1180
    },
    {
      "name": "welcome",
      "count": 456
    },
    {
      "name": "password-reset",
      "count": 234
    },
    {
      "name": "notification",
      "count": 890
    }
  ]
}
```

**Extract tag names:**

```bash
$ cakemail emails tags -f json | jq -r '.tags[].name'
```

**Output:**
```
order
confirmation
welcome
password-reset
notification
```

**Find most used tags:**

```bash
$ cakemail emails tags -f json | jq '.tags | sort_by(.count) | reverse | .[0:5]'
```

**Output:**
```json
[
  {"name": "order", "count": 1234},
  {"name": "confirmation", "count": 1180},
  {"name": "notification", "count": 890},
  {"name": "welcome", "count": 456},
  {"name": "password-reset", "count": 234}
]
```

### Notes

- Tags are created automatically when used in [emails send](#emails-send)
- Count shows total emails with each tag
- Tags are case-sensitive
- Use tags to organize transactional email types
- Tags help filter logs and analytics

### Related Commands

- [emails send](#emails-send) - Send email with tags
- [emails logs](#emails-logs) - Filter logs by tag

---

## Common Workflows

### Workflow 1: Send Order Confirmation

```bash
# Send confirmation email with tracking
$ cakemail emails send \
  -t customer@example.com \
  -s "Order #1234 Confirmed" \
  --html-file ./templates/order-confirmation.html \
  --from-email orders@example.com \
  --from-name "Example Store" \
  --tracking \
  --tags "order,confirmation"

# Save email ID from output (e.g., email_abc123)

# Verify delivery
$ cakemail emails get email_abc123

# Check if opened
$ cakemail emails get email_abc123 -f json | jq '{status, opens, clicks}'
```

### Workflow 2: Send Password Reset

```bash
# Generate reset token (your application logic)
RESET_TOKEN="abc123xyz"
RESET_LINK="https://example.com/reset/${RESET_TOKEN}"

# Send password reset email
$ cakemail emails send \
  -t user@example.com \
  -s "Password Reset Request" \
  --template-id 789 \
  --params "{\"reset_link\":\"${RESET_LINK}\",\"username\":\"John\"}" \
  --from-email security@example.com \
  --tags "password-reset,automated" \
  --reply-to support@example.com

# Monitor delivery
$ cakemail emails logs --tag "password-reset" -l 1
```

### Workflow 3: Test Email Template

```bash
# Send test email
$ cakemail emails send \
  -t developer@example.com \
  -s "Test: New Template" \
  --html-file ./templates/new-design.html \
  --from-email test@example.com \
  --tracking

# Get email ID (e.g., email_test123)

# Render to verify HTML
$ cakemail emails render email_test123 -f json | jq -r '.html' > test-render.html

# Open in browser
$ open test-render.html

# Check tracking implementation
$ cakemail emails render email_test123 --tracking -f json | jq -r '.html' | grep -o 'track.cakemail.com'
```

### Workflow 4: Monitor Bounces

```bash
# Check recent bounces
$ cakemail emails logs --status bounced --from 2024-03-01 -l 50

# Get details of bounced emails
$ cakemail emails get email_bounce123 -f json | jq '{to, status, bounce_reason}'

# Export bounced emails for cleanup
$ cakemail emails logs --status bounced --from 2024-03-01 -f json | \
  jq -r '.data[] | .to' > bounced-emails.txt

# Add to suppression list (prevents future sends)
$ cat bounced-emails.txt | while read email; do
  cakemail suppressed add -e "$email" -r "hard-bounce"
done
```

### Workflow 5: Daily Email Report

```bash
# Create daily report script
#!/bin/bash
TODAY=$(date +%Y-%m-%d)
YESTERDAY=$(date -d "yesterday" +%Y-%m-%d)

# Export yesterday's email logs
cakemail emails logs --from $YESTERDAY --to $TODAY -f json > daily-report-$YESTERDAY.json

# Generate summary
echo "Email Summary for $YESTERDAY"
echo "Total emails: $(jq '.count' daily-report-$YESTERDAY.json)"
echo "Delivered: $(jq '[.data[] | select(.status=="delivered")] | length' daily-report-$YESTERDAY.json)"
echo "Bounced: $(jq '[.data[] | select(.status=="bounced")] | length' daily-report-$YESTERDAY.json)"
```

## Best Practices

1. **Use Templates**: Create reusable templates for common transactional emails
2. **Tag Everything**: Tag all emails for better organization and filtering
3. **Enable Tracking**: Use tracking to measure engagement
4. **Multipart Emails**: Include both HTML and text for better deliverability
5. **Reply-To Address**: Set reply-to for customer responses
6. **Monitor Bounces**: Regularly check bounce logs and clean lists
7. **Test Before Production**: Use [emails render](#emails-render) to test templates
8. **Rate Limiting**: Respect API rate limits for bulk sends
9. **Error Handling**: Always check email status after sending
10. **Suppression List**: Use suppression list to prevent sending to invalid addresses

## Troubleshooting

### Error: "Either HTML, text, or template-id is required"

Email content is missing.

**Solution:**
```bash
# Provide HTML content
$ cakemail emails send -t user@example.com -s "Subject" --html "<p>Content</p>" --from-email sender@example.com

# Or use template
$ cakemail emails send -t user@example.com -s "Subject" --template-id 123 --from-email sender@example.com
```

### Email Status: "bounced"

Email bounced (invalid address or delivery failure).

**Solution:**
```bash
# Check bounce reason
$ cakemail emails get email_abc123 -f json | jq '.bounce_reason'

# Add to suppression list
$ cakemail suppressed add -e "bounced@example.com" -r "hard-bounce"

# Verify email address is valid before sending
```

### Email Not Tracking

Tracking not enabled or HTML content missing.

**Solution:**
```bash
# Enable tracking when sending
$ cakemail emails send -t user@example.com -s "Subject" --html-file content.html --tracking --from-email sender@example.com

# Verify tracking in rendered HTML
$ cakemail emails render email_abc123 --tracking | grep "track.cakemail.com"
```

### Template Parameters Not Working

Invalid JSON or missing parameters.

**Solution:**
```bash
# Ensure valid JSON syntax
$ cakemail emails send \
  -t user@example.com \
  -s "Subject" \
  --template-id 123 \
  --params '{"name":"John","link":"https://example.com"}' \
  --from-email sender@example.com

# Test template first
$ cakemail transactional-templates render 123 -p '{"name":"John"}'
```

### Rate Limit Exceeded

Sending too many emails too quickly.

**Solution:**
```bash
# Add delays between sends in scripts
for email in $(cat recipients.txt); do
  cakemail emails send -t "$email" -s "Subject" --html-file content.html --from-email sender@example.com
  sleep 1  # 1 second delay
done

# Contact support for higher rate limits
```

### Email Marked as Spam

Poor sender reputation or content issues.

**Solution:**
```bash
# Use verified sender address
$ cakemail senders list

# Avoid spam trigger words in subject
# Include unsubscribe link
# Authenticate domain (SPF, DKIM, DMARC)
# Check email deliverability score
```

### Missing Email Logs

Logs only retained for 90 days.

**Solution:**
```bash
# Export logs regularly
$ cakemail emails logs --from 2024-03-01 --to 2024-03-15 -f json > archive-march.json

# Set up automated exports
# Create scheduled job to archive logs monthly
```

---

**Related Documentation:**
- [Transactional Templates Commands](/en/cli/command-reference/transactional-templates/) - Manage email templates
- [Senders Commands](/en/cli/command-reference/senders/) - Manage sender identities
- [Suppressed Commands](/en/cli/command-reference/suppressed/) - Manage suppression list
- [Reports Commands](/en/cli/command-reference/reports/) - Email API analytics
- [Campaigns Commands](/en/cli/command-reference/campaigns/) - Marketing campaigns
