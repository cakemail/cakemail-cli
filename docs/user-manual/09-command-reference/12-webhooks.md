# Webhook Commands

Manage webhooks for real-time event notifications from Cakemail.

## Overview

Webhook commands allow you to:
- Create webhooks to receive event notifications
- Subscribe to specific email events
- Update webhook URLs and event subscriptions
- Archive/unarchive webhooks
- Secure webhooks with secret keys
- Integrate Cakemail with external systems

Webhooks provide real-time HTTP callbacks when events occur (email sent, opened, clicked, bounced, etc.), enabling you to build integrations and automate workflows.

## Commands

- [webhooks list](#webhooks-list) - List all webhooks
- [webhooks get](#webhooks-get) - Get webhook details
- [webhooks create](#webhooks-create) - Create a new webhook
- [webhooks update](#webhooks-update) - Update webhook configuration
- [webhooks archive](#webhooks-archive) - Archive a webhook
- [webhooks unarchive](#webhooks-unarchive) - Unarchive a webhook

---

## webhooks list

List all webhooks in your account.

### Usage

```bash
cakemail webhooks list [options]
```

### Options

- `-l, --limit <number>` - Limit number of results per page
- `-p, --page <number>` - Page number (default: 1)

### Examples

**List all webhooks:**

```bash
$ cakemail webhooks list
```

**Output:**
```
┌────────┬──────────────────────┬──────────────────────────────┬────────────┐
│ ID     │ Name                 │ URL                          │ Status     │
├────────┼──────────────────────┼──────────────────────────────┼────────────┤
│ 301    │ Email Events         │ https://api.example.com/hook │ active     │
│ 302    │ Bounce Handler       │ https://app.example.com/...  │ active     │
│ 303    │ Old Integration      │ https://old.example.com/...  │ archived   │
└────────┴──────────────────────┴──────────────────────────────┴────────────┘
```

**List with pagination:**

```bash
$ cakemail webhooks list -l 10 -p 1
```

**Export webhooks as JSON:**

```bash
$ cakemail webhooks list -f json > webhooks.json
```

**Output:**
```json
{
  "data": [
    {
      "id": 301,
      "name": "Email Events",
      "url": "https://api.example.com/webhook",
      "events": ["email.sent", "email.opened", "email.clicked"],
      "status": "active",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "count": 3
}
```

**Find active webhooks:**

```bash
$ cakemail webhooks list -f json | jq '.data[] | select(.status == "active")'
```

### Notes

- Active webhooks receive event notifications
- Archived webhooks do not receive notifications
- Each webhook shows subscribed events
- Use pagination for accounts with many webhooks

### Related Commands

- [webhooks get](#webhooks-get) - View webhook details
- [webhooks create](#webhooks-create) - Add new webhook
- [webhooks archive](#webhooks-archive) - Disable webhook

---

## webhooks get

Get detailed information about a specific webhook.

### Usage

```bash
cakemail webhooks get <id>
```

### Arguments

- `id` - Webhook ID (required)

### Examples

**Get webhook details:**

```bash
$ cakemail webhooks get 301
```

**Output:**
```
{
  "id": 301,
  "name": "Email Events",
  "url": "https://api.example.com/webhook",
  "events": [
    "email.sent",
    "email.opened",
    "email.clicked",
    "email.bounced"
  ],
  "secret": "whsec_abc123...",
  "status": "active",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-02-10T14:20:00Z",
  "last_triggered_at": "2024-03-15T10:30:00Z"
}
```

**Extract webhook URL:**

```bash
$ cakemail webhooks get 301 -f json | jq -r '.url'
```

**Output:**
```
https://api.example.com/webhook
```

**View subscribed events:**

```bash
$ cakemail webhooks get 301 -f json | jq '.events'
```

**Output:**
```json
["email.sent", "email.opened", "email.clicked", "email.bounced"]
```

**Check webhook status:**

```bash
$ cakemail webhooks get 301 -f json | jq -r '.status'
```

**Output:**
```
active
```

### Notes

- Shows complete webhook configuration
- Secret displayed (store securely)
- Last triggered timestamp shows recent activity
- Status indicates if webhook is receiving events

### Related Commands

- [webhooks list](#webhooks-list) - Find webhook IDs
- [webhooks update](#webhooks-update) - Modify webhook
- [webhooks archive](#webhooks-archive) - Disable webhook

---

## webhooks create

Create a new webhook to receive event notifications.

### Usage

```bash
cakemail webhooks create [options]
```

### Options

**Required:**
- `-u, --url <url>` - Webhook endpoint URL (must be HTTPS)
- `-e, --events <events>` - Comma-separated event types

**Optional:**
- `-n, --name <name>` - Webhook name for identification
- `-s, --secret <secret>` - Secret key for signature verification

### Examples

**Create webhook for email events:**

```bash
$ cakemail webhooks create \
  -u "https://api.example.com/webhook" \
  -e "email.sent,email.opened,email.clicked" \
  -n "Email Events"
```

**Output:**
```
✓ Webhook created: 301
{
  "id": 301,
  "name": "Email Events",
  "url": "https://api.example.com/webhook",
  "events": ["email.sent", "email.opened", "email.clicked"],
  "status": "active"
}
```

**Create webhook with secret:**

```bash
$ cakemail webhooks create \
  -u "https://api.example.com/secure-webhook" \
  -e "email.sent,email.bounced" \
  -n "Secure Webhook" \
  -s "my_secret_key_12345"
```

**Output:**
```
✓ Webhook created: 302
{
  "id": 302,
  "name": "Secure Webhook",
  "url": "https://api.example.com/secure-webhook",
  "secret": "my_secret_key_12345",
  "events": ["email.sent", "email.bounced"]
}
```

**Create bounce handler webhook:**

```bash
$ cakemail webhooks create \
  -u "https://app.example.com/bounces" \
  -e "email.bounced,email.complained" \
  -n "Bounce Handler"
```

**Create campaign webhook:**

```bash
$ cakemail webhooks create \
  -u "https://analytics.example.com/campaigns" \
  -e "campaign.sent,campaign.completed" \
  -n "Campaign Analytics"
```

### Available Events

**Email Events:**
- `email.sent` - Email successfully sent
- `email.delivered` - Email delivered to recipient
- `email.opened` - Email opened by recipient
- `email.clicked` - Link clicked in email
- `email.bounced` - Email bounced (hard or soft)
- `email.complained` - Recipient marked as spam
- `email.unsubscribed` - Recipient unsubscribed

**Campaign Events:**
- `campaign.sent` - Campaign sent
- `campaign.completed` - Campaign sending completed

**Contact Events:**
- `contact.subscribed` - Contact subscribed to list
- `contact.unsubscribed` - Contact unsubscribed from list

### Webhook Payload

When an event occurs, Cakemail sends HTTP POST to your URL:

```json
{
  "event": "email.opened",
  "timestamp": "2024-03-15T10:30:00Z",
  "data": {
    "email_id": "email_abc123",
    "recipient": "user@example.com",
    "campaign_id": 790,
    "list_id": 123
  }
}
```

### Notes

- URL must be HTTPS (HTTP not supported)
- URL must be publicly accessible
- Secret used to verify request authenticity (recommended)
- Multiple webhooks can subscribe to same events
- Webhooks activated immediately upon creation
- Failed deliveries retried with exponential backoff

### Related Commands

- [webhooks get](#webhooks-get) - View created webhook
- [webhooks update](#webhooks-update) - Modify configuration
- [webhooks list](#webhooks-list) - View all webhooks

---

## webhooks update

Update an existing webhook's configuration.

### Usage

```bash
cakemail webhooks update <id> [options]
```

### Arguments

- `id` - Webhook ID (required)

### Options

- `-u, --url <url>` - New webhook URL
- `-e, --events <events>` - New comma-separated event list (replaces existing)
- `-n, --name <name>` - New webhook name
- `-s, --secret <secret>` - New secret key

### Examples

**Update webhook URL:**

```bash
$ cakemail webhooks update 301 -u "https://api.example.com/new-webhook"
```

**Output:**
```
✓ Webhook 301 updated
{
  "id": 301,
  "url": "https://api.example.com/new-webhook"
}
```

**Update subscribed events:**

```bash
$ cakemail webhooks update 301 -e "email.sent,email.opened,email.clicked,email.bounced"
```

**Output:**
```
✓ Webhook 301 updated
{
  "id": 301,
  "events": ["email.sent", "email.opened", "email.clicked", "email.bounced"]
}
```

**Update webhook name:**

```bash
$ cakemail webhooks update 301 -n "Main Email Events Handler"
```

**Update secret key:**

```bash
$ cakemail webhooks update 301 -s "new_secret_key_67890"
```

**Update multiple fields:**

```bash
$ cakemail webhooks update 301 \
  -u "https://api.example.com/webhook-v2" \
  -e "email.sent,email.bounced" \
  -n "Email Events v2" \
  -s "secure_key_2024"
```

**Output:**
```
✓ Webhook 301 updated
```

### Notes

- Only provided fields are updated (partial updates)
- Events list is replaced entirely (not merged)
- Changing URL requires endpoint to be accessible
- New secret applies to future webhook calls
- Webhook ID remains the same

### Related Commands

- [webhooks get](#webhooks-get) - View current configuration
- [webhooks create](#webhooks-create) - Create new webhook
- [webhooks archive](#webhooks-archive) - Disable webhook

---

## webhooks archive

Archive a webhook to stop receiving event notifications.

### Usage

```bash
cakemail webhooks archive <id>
```

### Arguments

- `id` - Webhook ID (required)

### Examples

**Archive webhook:**

```bash
$ cakemail webhooks archive 303
```

**Output:**
```
✓ Webhook 303 archived
```

**Verify archive status:**

```bash
$ cakemail webhooks get 303 -f json | jq -r '.status'
```

**Output:**
```
archived
```

### Notes

- Archived webhooks stop receiving events immediately
- Webhook configuration is preserved
- Can be unarchived later
- Use instead of deletion to preserve configuration
- No events sent to archived webhooks

### Related Commands

- [webhooks unarchive](#webhooks-unarchive) - Reactivate webhook
- [webhooks list](#webhooks-list) - View webhook status
- [webhooks get](#webhooks-get) - Check archive status

---

## webhooks unarchive

Unarchive a webhook to resume receiving event notifications.

### Usage

```bash
cakemail webhooks unarchive <id>
```

### Arguments

- `id` - Webhook ID (required)

### Examples

**Unarchive webhook:**

```bash
$ cakemail webhooks unarchive 303
```

**Output:**
```
✓ Webhook 303 unarchived
```

**Verify active status:**

```bash
$ cakemail webhooks get 303 -f json | jq -r '.status'
```

**Output:**
```
active
```

### Notes

- Webhook resumes receiving events immediately
- All configuration preserved during archive
- Events that occurred while archived are not retroactively sent
- Use to temporarily pause webhook without losing configuration

### Related Commands

- [webhooks archive](#webhooks-archive) - Disable webhook
- [webhooks get](#webhooks-get) - Check status
- [webhooks update](#webhooks-update) - Modify after unarchive

---

## Common Workflows

### Workflow 1: Setup Email Event Webhook

```bash
# Create webhook for email tracking
$ cakemail webhooks create \
  -u "https://api.example.com/email-events" \
  -e "email.sent,email.opened,email.clicked,email.bounced" \
  -n "Email Tracker" \
  -s "secure_secret_key_123"

# Note webhook ID (e.g., 301)

# Verify configuration
$ cakemail webhooks get 301

# Test webhook endpoint (ensure it's responding)
# Send test campaign and monitor webhook calls
```

### Workflow 2: Update Webhook Events

```bash
# View current events
$ cakemail webhooks get 301 -f json | jq '.events'

# Add more events
$ cakemail webhooks update 301 \
  -e "email.sent,email.opened,email.clicked,email.bounced,email.complained,email.unsubscribed"

# Verify update
$ cakemail webhooks get 301 -f json | jq '.events'
```

### Workflow 3: Rotate Webhook Secret

```bash
# Update secret key
$ cakemail webhooks update 301 -s "new_secure_key_456"

# Update application with new secret
# Deploy application changes

# Verify webhook still working
# Monitor webhook calls
```

### Workflow 4: Temporarily Disable Webhook

```bash
# Archive webhook (e.g., during maintenance)
$ cakemail webhooks archive 301

# Perform maintenance...

# Reactivate webhook
$ cakemail webhooks unarchive 301

# Verify active
$ cakemail webhooks get 301 -f json | jq '.status'
```

### Workflow 5: Webhook Audit

```bash
# List all webhooks
$ cakemail webhooks list

# Check each webhook status
for id in 301 302 303; do
  echo "Webhook $id:"
  cakemail webhooks get $id -f json | jq '{name, url, status, last_triggered: .last_triggered_at}'
done

# Archive unused webhooks
$ cakemail webhooks archive 303
```

## Best Practices

1. **Use HTTPS**: Always use HTTPS endpoints (required)
2. **Verify Signatures**: Use webhook secret to verify request authenticity
3. **Idempotency**: Handle duplicate webhook calls (use event IDs)
4. **Fast Response**: Respond quickly (< 5 seconds) to prevent timeouts
5. **Background Processing**: Queue webhook data for async processing
6. **Error Handling**: Return 200 OK even if processing fails
7. **Retry Logic**: Implement exponential backoff for failed processes
8. **Monitor Failures**: Track webhook delivery failures
9. **Secret Rotation**: Regularly rotate webhook secrets
10. **Test Endpoints**: Test webhook URLs before creating

## Troubleshooting

### Error: "Webhook URL is invalid"

URL format validation failed.

**Solution:**
```bash
# Ensure HTTPS (not HTTP)
$ cakemail webhooks create \
  -u "https://api.example.com/webhook" \
  -e "email.sent" \
  -n "Test"

# Not valid: http://api.example.com/webhook (HTTP)
# Not valid: api.example.com/webhook (missing protocol)
```

### Webhook Not Receiving Events

Multiple possible causes.

**Solution:**
```bash
# Check webhook status
$ cakemail webhooks get 301 -f json | jq '.status'

# If archived, unarchive
$ cakemail webhooks unarchive 301

# Verify URL is accessible
$ curl -X POST https://api.example.com/webhook -d '{"test": true}'

# Check webhook logs in your application
# Verify firewall allows Cakemail IPs
# Check events are actually occurring (send test email)
```

### Webhook Requests Failing

Endpoint returning errors.

**Solution:**
```bash
# Check your endpoint logs
# Common issues:
# - Authentication failures
# - Timeout (must respond < 5 seconds)
# - Invalid response format

# Test endpoint manually
$ curl -X POST https://api.example.com/webhook \
  -H "Content-Type: application/json" \
  -d '{"event":"email.sent","data":{}}'

# Ensure endpoint returns 200 OK
```

### Duplicate Webhook Events

Same event received multiple times.

**Solution:**
```bash
# Implement idempotency using event IDs
# Example webhook handler:

# Store processed event IDs
# if event_id in processed_ids:
#     return 200  # Already processed
#
# process_event(event)
# store_event_id(event_id)
# return 200

# Cakemail retries failed webhooks
# Use event ID to detect duplicates
```

### Webhook Secret Verification Failing

Signature validation errors.

**Solution:**
```bash
# Get current secret
$ cakemail webhooks get 301 -f json | jq -r '.secret'

# Verify secret matches in application
# Update application if needed

# Rotate secret if compromised
$ cakemail webhooks update 301 -s "new_secret_key"

# Update application configuration
```

### Events Not Triggering Webhook

Webhook created but no calls received.

**Solution:**
```bash
# Verify webhook is active
$ cakemail webhooks get 301 -f json | jq '.status'

# Check subscribed events
$ cakemail webhooks get 301 -f json | jq '.events'

# Ensure events are occurring
# - Send test email for email.sent
# - Open email for email.opened
# - Click link for email.clicked

# Check last_triggered_at
$ cakemail webhooks get 301 -f json | jq '.last_triggered_at'
```

### Webhook URL Changed

Need to update endpoint URL.

**Solution:**
```bash
# Update URL
$ cakemail webhooks update 301 -u "https://new-api.example.com/webhook"

# Verify new URL is accessible
$ curl https://new-api.example.com/webhook

# Test with event
# Monitor new endpoint for webhook calls
```

---

**Related Documentation:**
- [Emails Commands](/en/cli/command-reference/emails/) - Send transactional emails
- [Campaigns Commands](/en/cli/command-reference/campaigns/) - Send marketing campaigns
- [Reports Commands](/en/cli/command-reference/reports/) - View email analytics
- [Suppressed Commands](/en/cli/command-reference/suppressed/) - Manage suppression list
