# Transactional Emails

Learn how to send individual transactional emails using the Cakemail Email API v2.

## Overview

Transactional emails are one-to-one messages triggered by user actions or system events. Unlike campaigns (which go to many recipients), transactional emails are sent to individual recipients in real-time.

**Common use cases:**
- Welcome emails
- Password reset notifications
- Order confirmations
- Shipping updates
- Account alerts
- Invoice receipts
- Verification codes

## Prerequisites

Before sending transactional emails, you need:

1. **Verified sender email** - See [Senders](./senders.md)
2. **Valid authentication** - See [Authentication](../01-getting-started/authentication.md)

---

## Send Command

The `emails send` command submits a transactional email.

### Basic Syntax

```bash
cakemail emails send \
  -t <recipient@example.com> \
  -s "Email Subject" \
  [content options] \
  [additional options]
```

### Required Options

- `-t, --to <email>` - Recipient email address
- `-s, --subject <subject>` - Email subject line

**Plus one of:**
- `--html <html>` or `--html-file <path>` - HTML content
- `--text <text>` or `--text-file <path>` - Plain text content
- `--template-id <id>` - Use existing template

---

## Sending with HTML Content

### Inline HTML

Send HTML content directly in the command:

```bash
cakemail emails send \
  -t recipient@example.com \
  -s "Welcome to Acme Inc" \
  --html "<h1>Welcome!</h1><p>Thanks for signing up.</p>"
```

**Best for:**
- Simple emails
- Quick tests
- Short content

### HTML from File

Load HTML from a file (recommended for complex emails):

```bash
cakemail emails send \
  -t recipient@example.com \
  -s "Welcome to Acme Inc" \
  --html-file templates/welcome.html
```

**Best for:**
- Complex HTML templates
- Reusable templates
- Version-controlled content

**Example HTML file:**
```html
<!-- templates/welcome.html -->
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; }
    .header { background: #007bff; color: white; padding: 20px; }
    .content { padding: 20px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Welcome to Acme Inc!</h1>
  </div>
  <div class="content">
    <p>Hi there,</p>
    <p>Thanks for signing up. We're excited to have you on board.</p>
    <p><a href="https://example.com/get-started">Get Started</a></p>
  </div>
</body>
</html>
```

---

## Sending with Plain Text

### Inline Text

```bash
cakemail emails send \
  -t recipient@example.com \
  -s "Welcome to Acme Inc" \
  --text "Thanks for signing up!"
```

### Text from File

```bash
cakemail emails send \
  -t recipient@example.com \
  -s "Welcome to Acme Inc" \
  --text-file templates/welcome.txt
```

**Example text file:**
```text
Welcome to Acme Inc!

Thanks for signing up. We're excited to have you on board.

Get started: https://example.com/get-started

--
Acme Inc Team
```

---

## Sending with HTML and Text

Provide both HTML and plain text (recommended):

```bash
cakemail emails send \
  -t recipient@example.com \
  -s "Welcome to Acme Inc" \
  --html-file templates/welcome.html \
  --text-file templates/welcome.txt
```

**Why both?**
- **HTML** - Rich formatting for modern email clients
- **Plain text** - Fallback for text-only clients
- **Accessibility** - Better for screen readers
- **Spam filters** - Improves deliverability

---

## Using Templates

Send emails using pre-created templates with variable substitution.

### Basic Template Usage

```bash
cakemail emails send \
  -t recipient@example.com \
  -s "Welcome {{name}}" \
  --template-id 123 \
  --params '{"name":"John","company":"Acme Inc"}'
```

### Template Parameters

The `--params` option accepts JSON with variables to substitute:

```bash
--params '{"name":"John","email":"john@example.com","orderNumber":"12345"}'
```

**Template variables** use double curly braces: `{{variable}}`

**Example template:**
```html
<h1>Hi {{name}},</h1>
<p>Your order {{orderNumber}} has shipped.</p>
<p>Track it here: <a href="{{trackingUrl}}">{{trackingUrl}}</a></p>
```

**Send command:**
```bash
cakemail emails send \
  -t {{email}} \
  -s "Order {{orderNumber}} Shipped" \
  --template-id 456 \
  --params '{
    "name":"John",
    "email":"john@example.com",
    "orderNumber":"ORD-12345",
    "trackingUrl":"https://tracking.example.com/ORD-12345"
  }'
```

See [Templates](./templates.md) for template management.

---

## Custom Sender

Override the default sender for specific emails:

```bash
cakemail emails send \
  -t recipient@example.com \
  -s "Order Confirmation" \
  --html "<h1>Your order is confirmed</h1>" \
  --from-email orders@acme.com \
  --from-name "Acme Orders"
```

**Options:**
- `--from-email <email>` - Sender email address (must be verified)
- `--from-name <name>` - Sender display name
- `--reply-to <email>` - Reply-to address (optional)

**With reply-to:**
```bash
cakemail emails send \
  -t recipient@example.com \
  -s "Support Ticket #12345" \
  --html "<p>Your ticket has been updated.</p>" \
  --from-email support@acme.com \
  --from-name "Acme Support" \
  --reply-to ticket-12345@support.acme.com
```

---

## Email Tracking

Enable open and click tracking:

```bash
cakemail emails send \
  -t recipient@example.com \
  -s "Newsletter" \
  --html-file newsletter.html \
  --tracking
```

**What gets tracked:**
- **Opens** - When recipient opens the email (using tracking pixel)
- **Clicks** - When recipient clicks links (using redirect URLs)

**Tracking data available via:**
```bash
cakemail emails get <email-id>
cakemail emails logs --status delivered
```

See [Email Tracking](./email-tracking.md) for details.

---

## Email Tags

Tag emails for organization and filtering:

```bash
cakemail emails send \
  -t recipient@example.com \
  -s "Welcome Email" \
  --html-file welcome.html \
  --tags "welcome,onboarding,automated"
```

**Uses for tags:**
- **Categorization** - Group similar emails
- **Filtering** - Filter logs by tag
- **Analytics** - Track performance by category
- **Automation** - Trigger workflows

**View all tags:**
```bash
cakemail emails tags
```

**Filter logs by tag:**
```bash
cakemail emails logs --tag welcome
```

---

## Custom Headers

Add custom email headers:

```bash
cakemail emails send \
  -t recipient@example.com \
  -s "Custom Headers Example" \
  --html "<p>Email with custom headers</p>" \
  --headers '{"X-Custom-ID":"12345","X-Category":"transactional"}'
```

**Common custom headers:**
- `X-Custom-ID` - Internal tracking ID
- `X-Category` - Email category
- `X-Priority` - Email priority
- `List-Unsubscribe` - Unsubscribe link

---

## Attachments

Attach files to emails:

```bash
cakemail emails send \
  -t recipient@example.com \
  -s "Invoice #12345" \
  --html "<p>Please find your invoice attached.</p>" \
  --attachments '[
    {
      "filename":"invoice-12345.pdf",
      "content":"base64-encoded-content",
      "type":"application/pdf"
    }
  ]'
```

**Attachment format:**
```json
[
  {
    "filename": "document.pdf",
    "content": "base64-encoded-data",
    "type": "application/pdf"
  }
]
```

**Encoding files to base64:**
```bash
base64 document.pdf
```

**In a script:**
```bash
#!/bin/bash
ATTACHMENT=$(base64 -w 0 invoice.pdf)
cakemail emails send \
  -t customer@example.com \
  -s "Your Invoice" \
  --html "<p>Invoice attached</p>" \
  --attachments "[{\"filename\":\"invoice.pdf\",\"content\":\"$ATTACHMENT\",\"type\":\"application/pdf\"}]"
```

---

## Complete Example

Send a comprehensive transactional email with all features:

```bash
cakemail emails send \
  -t john@example.com \
  -s "Order #ORD-12345 Confirmed" \
  --html-file templates/order-confirmation.html \
  --text-file templates/order-confirmation.txt \
  --from-email orders@acme.com \
  --from-name "Acme Orders" \
  --reply-to support@acme.com \
  --tracking \
  --tags "order,confirmation,automated" \
  --headers '{"X-Order-ID":"ORD-12345","X-Customer-ID":"CUST-789"}' \
  --attachments '[{"filename":"receipt.pdf","content":"...", "type":"application/pdf"}]'
```

---

## Retrieving Email Details

Get information about a sent email:

```bash
cakemail emails get <email-id>
```

**Example output:**
```json
{
  "id": "abc123def456",
  "to": "recipient@example.com",
  "subject": "Welcome Email",
  "status": "delivered",
  "from": {
    "email": "hello@acme.com",
    "name": "Acme Inc"
  },
  "tracking": {
    "opened": true,
    "opened_at": "2024-06-15T10:30:00Z",
    "clicks": 2
  },
  "tags": ["welcome", "onboarding"],
  "created_at": "2024-06-15T10:00:00Z",
  "delivered_at": "2024-06-15T10:01:00Z"
}
```

---

## Rendering Email HTML

Preview the rendered HTML of a sent email:

```bash
cakemail emails render <email-id>
```

**With tracking enabled:**
```bash
cakemail emails render <email-id> --tracking
```

**As originally submitted:**
```bash
cakemail emails render <email-id> --as-submitted
```

**Save to file:**
```bash
cakemail emails render <email-id> > email.html
```

---

## Viewing Email Logs

Query email sending activity:

### All Recent Emails

```bash
cakemail emails logs --limit 50
```

### Filter by Date Range

```bash
cakemail emails logs \
  --from 2024-06-01 \
  --to 2024-06-30
```

### Filter by Status

```bash
# Delivered emails
cakemail emails logs --status delivered

# Bounced emails
cakemail emails logs --status bounced

# Failed emails
cakemail emails logs --status failed
```

### Filter by Tag

```bash
cakemail emails logs --tag welcome
cakemail emails logs --tag "order-confirmation"
```

### Combined Filters

```bash
cakemail emails logs \
  --from 2024-06-01 \
  --to 2024-06-30 \
  --tag welcome \
  --status delivered \
  --limit 100
```

---

## Practical Examples

### Example 1: Welcome Email Script

```bash
#!/bin/bash
# send-welcome.sh

EMAIL=$1
NAME=$2

if [ -z "$EMAIL" ] || [ -z "$NAME" ]; then
  echo "Usage: ./send-welcome.sh <email> <name>"
  exit 1
fi

cakemail emails send \
  -t "$EMAIL" \
  -s "Welcome to Acme, $NAME!" \
  --template-id 123 \
  --params "{\"name\":\"$NAME\",\"email\":\"$EMAIL\"}" \
  --tracking \
  --tags "welcome,automated"

echo "Welcome email sent to $EMAIL"
```

**Usage:**
```bash
./send-welcome.sh john@example.com "John Doe"
```

### Example 2: Password Reset

```bash
#!/bin/bash
# send-reset.sh

EMAIL=$1
RESET_TOKEN=$2
RESET_URL="https://example.com/reset?token=$RESET_TOKEN"

cakemail emails send \
  -t "$EMAIL" \
  -s "Password Reset Request" \
  --html "<p>Click to reset: <a href=\"$RESET_URL\">Reset Password</a></p>" \
  --from-email security@acme.com \
  --from-name "Acme Security" \
  --tags "security,password-reset" \
  --headers "{\"X-Reset-Token\":\"$RESET_TOKEN\"}"
```

### Example 3: Order Confirmation with Invoice

```bash
#!/bin/bash
# send-order-confirmation.sh

EMAIL=$1
ORDER_ID=$2
INVOICE_FILE=$3

# Encode invoice to base64
INVOICE_BASE64=$(base64 -w 0 "$INVOICE_FILE")

cakemail emails send \
  -t "$EMAIL" \
  -s "Order $ORDER_ID Confirmed" \
  --template-id 456 \
  --params "{\"orderNumber\":\"$ORDER_ID\"}" \
  --tracking \
  --tags "order,confirmation" \
  --attachments "[{\"filename\":\"invoice-$ORDER_ID.pdf\",\"content\":\"$INVOICE_BASE64\",\"type\":\"application/pdf\"}]"
```

### Example 4: Bulk Transactional Emails

```bash
#!/bin/bash
# bulk-send.sh

# Read emails from CSV file
while IFS=',' read -r EMAIL NAME; do
  echo "Sending to $EMAIL..."

  cakemail emails send \
    -t "$EMAIL" \
    -s "Monthly Newsletter" \
    --template-id 789 \
    --params "{\"name\":\"$NAME\"}" \
    --tracking \
    --tags "newsletter,monthly"

  # Rate limiting
  sleep 0.5
done < contacts.csv

echo "All emails sent"
```

---

## Best Practices

### 1. Always Provide Plain Text

```bash
# ✅ Good: HTML + text
cakemail emails send \
  -t user@example.com \
  -s "Subject" \
  --html-file email.html \
  --text-file email.txt

# ❌ Avoid: HTML only
cakemail emails send \
  -t user@example.com \
  -s "Subject" \
  --html-file email.html
```

### 2. Use Templates for Reusable Content

```bash
# ✅ Good: Reusable template
cakemail emails send -t user@example.com -s "Welcome" --template-id 123

# ❌ Avoid: Hardcoded content for repeated sends
cakemail emails send -t user@example.com -s "Welcome" --html "..."
```

### 3. Tag Your Emails

```bash
# ✅ Good: Organized with tags
cakemail emails send ... --tags "welcome,automated,v2"

# ❌ Avoid: No categorization
cakemail emails send ...
```

### 4. Use Descriptive Subjects

```bash
# ✅ Good: Clear and specific
-s "Order #12345 Confirmed - Estimated Delivery June 20"

# ❌ Avoid: Generic
-s "Order Confirmation"
```

### 5. Test Before Bulk Sending

```bash
# Test with your own email first
cakemail emails send -t your@email.com -s "Test" --html-file email.html

# Then send to recipients
```

---

## Troubleshooting

### Email Not Delivered

**Check email status:**
```bash
cakemail emails get <email-id>
```

**Common issues:**
1. Unverified sender email
2. Invalid recipient email
3. Bounced address
4. Spam filters

**View logs:**
```bash
cakemail emails logs --status bounced
```

### Template Variables Not Substituted

**Verify params format:**
```bash
# ✅ Correct JSON
--params '{"name":"John","age":30}'

# ❌ Invalid JSON
--params '{name:John,age:30}'
```

### Tracking Not Working

**Ensure tracking is enabled:**
```bash
cakemail emails send ... --tracking
```

**Check email client:**
- Some clients block tracking pixels
- Links must be clicked (not just hovered)

---

## Next Steps

- [Templates](./templates.md) - Create reusable email templates
- [Senders](./senders.md) - Manage and verify sender addresses
- [Email Tracking](./email-tracking.md) - Track opens and clicks
- [Analytics](../06-analytics-reporting/email-api-stats.md) - View email statistics
