# Transactional Templates Commands

Manage transactional email templates.

## Overview

Transactional templates are reusable email templates for sending automated, personalized emails like order confirmations, password resets, welcome emails, and notifications. Unlike campaign templates, these are designed for one-to-one triggered emails.

**Available Commands:**
- [`transactional-templates list`](#transactional-templates-list) - List all templates
- [`transactional-templates show`](#transactional-templates-show) - Show template details
- [`transactional-templates create`](#transactional-templates-create) - Create new template
- [`transactional-templates update`](#transactional-templates-update) - Update template
- [`transactional-templates delete`](#transactional-templates-delete) - Delete template
- [`transactional-templates send`](#transactional-templates-send) - Send template to recipient
- [`transactional-templates test`](#transactional-templates-test) - Send test email
- [`transactional-templates render`](#transactional-templates-render) - Render template preview

**Key Features:**
- Variable substitution `{{variable_name}}`
- HTML and plain text versions
- Contact or email recipient
- Auto-detection support (list-scoped)
- Profile-aware delete confirmations

**Use Cases:**
- Order confirmations
- Password reset emails
- Welcome emails
- Account notifications
- Shipping updates
- Invoice receipts

---

## transactional-templates list

List all transactional templates.

### Usage

```bash
cakemail transactional-templates list [list-id] [options]
```

### Arguments

- `[list-id]` - List ID (optional - auto-detects if only one list exists)

### Options

- `-p, --page <number>` - Page number
- `--per-page <number>` - Results per page
- `--sort <sort>` - Sort order (e.g., `+name`, `-created_on`)
- `--filter <filter>` - Filter templates

### Examples

**List all templates (auto-detect):**
```bash
$ cakemail transactional-templates list
```

**Output:**
```
✓ Auto-detected list: 123 (Main List)

┌────┬──────────────────────┬─────────────┬─────────────────────┐
│ ID │ Name                 │ Sender      │ Created             │
├────┼──────────────────────┼─────────────┼─────────────────────┤
│ 1  │ Order Confirmation   │ Shop (456)  │ 2025-09-15 10:23:11 │
│ 2  │ Password Reset       │ System(789) │ 2025-09-20 14:05:42 │
│ 3  │ Welcome Email        │ Team (456)  │ 2025-10-01 08:15:33 │
└────┴──────────────────────┴─────────────┴─────────────────────┘
```

**List for specific list:**
```bash
$ cakemail transactional-templates list 123
```

**Sorted by name:**
```bash
$ cakemail transactional-templates list --sort +name
```

**JSON output:**
```bash
$ cakemail -f json transactional-templates list
```

**Output:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Order Confirmation",
      "subject": "Your order #{{order_id}}",
      "sender_id": 456,
      "created_on": "2025-09-15T10:23:11Z"
    }
  ]
}
```

---

## transactional-templates show

Show details for a specific template.

### Usage

```bash
cakemail transactional-templates show [list-id] <template-id>
```

### Arguments

- `[list-id]` - List ID (optional - auto-detects if only one list exists)
- `<template-id>` - Template ID (required)

### Examples

**Show template (auto-detect list):**
```bash
$ cakemail transactional-templates show 1
```

**Output:**
```
Template: Order Confirmation (ID: 1)

Details:
  Subject: Your order #{{order_id}}
  Sender: Shop <shop@company.com> (456)
  Created: 2025-09-15 10:23:11
  Last Updated: 2025-10-01 15:22:33

Variables:
  - {{order_id}}
  - {{customer_name}}
  - {{order_total}}
  - {{order_items}}

Content:
  HTML: 2,456 characters
  Text: 1,234 characters
```

**Show with specific list:**
```bash
$ cakemail transactional-templates show 123 1
```

**JSON output:**
```bash
$ cakemail -f json transactional-templates show 1
```

**Output:**
```json
{
  "id": 1,
  "name": "Order Confirmation",
  "subject": "Your order #{{order_id}}",
  "html": "<html>...</html>",
  "text": "Plain text version...",
  "sender_id": 456,
  "variables": ["order_id", "customer_name", "order_total"],
  "created_on": "2025-09-15T10:23:11Z",
  "updated_on": "2025-10-01T15:22:33Z"
}
```

---

## transactional-templates create

Create a new transactional template.

### Usage

```bash
cakemail transactional-templates create [list-id] [options]
```

### Arguments

- `[list-id]` - List ID (optional - auto-detects if only one list exists)

### Options

- `-n, --name <name>` - Template name (required)
- `-s, --subject <subject>` - Email subject with variables (required)
- `--html <html>` - HTML content (required)
- `--text <text>` - Plain text content (optional)
- `--sender-id <id>` - Sender ID (required)

### Examples

**Create basic template:**
```bash
$ cakemail transactional-templates create \
  --name "Order Confirmation" \
  --subject "Your order #{{order_id}}" \
  --html "<h1>Thank you {{customer_name}}!</h1>" \
  --sender-id 456
```

**Output:**
```
✓ Auto-detected list: 123 (Main List)
✓ Template created successfully

Template: Order Confirmation
  ID: 4
  Subject: Your order #{{order_id}}
  Variables detected: order_id, customer_name
```

**Create with HTML and text:**
```bash
$ cakemail transactional-templates create \
  --name "Welcome Email" \
  --subject "Welcome to {{company_name}}" \
  --html "<h1>Welcome {{first_name}}!</h1><p>Thanks for signing up.</p>" \
  --text "Welcome {{first_name}}! Thanks for signing up." \
  --sender-id 456
```

**Create from files:**
```bash
$ cakemail transactional-templates create \
  --name "Invoice" \
  --subject "Invoice #{{invoice_id}}" \
  --html "$(cat templates/invoice.html)" \
  --text "$(cat templates/invoice.txt)" \
  --sender-id 456
```

**JSON output:**
```bash
$ cakemail -f json transactional-templates create \
  --name "Receipt" \
  --subject "Receipt #{{receipt_id}}" \
  --html "<html>...</html>" \
  --sender-id 456
```

**Output:**
```json
{
  "id": 5,
  "name": "Receipt",
  "subject": "Receipt #{{receipt_id}}",
  "html": "<html>...</html>",
  "sender_id": 456,
  "created_on": "2025-10-11T15:30:00Z"
}
```

### Variable Syntax

Use double curly braces for variables:
- `{{variable_name}}` - Simple variable
- `{{first_name}}` - Contact field
- `{{order_id}}` - Custom variable
- `{{company.name}}` - Nested object (if supported)

**Example:**
```html
<h1>Hello {{first_name}} {{last_name}}</h1>
<p>Your order #{{order_id}} for ${{order_total}} is confirmed.</p>
```

---

## transactional-templates update

Update an existing template.

### Usage

```bash
cakemail transactional-templates update [list-id] <template-id> [options]
```

### Arguments

- `[list-id]` - List ID (optional - auto-detects if only one list exists)
- `<template-id>` - Template ID (required)

### Options

- `-n, --name <name>` - New template name (optional)
- `-s, --subject <subject>` - New subject (optional)
- `--html <html>` - New HTML content (optional)
- `--text <text>` - New plain text content (optional)
- `--sender-id <id>` - New sender ID (optional)

### Examples

**Update subject:**
```bash
$ cakemail transactional-templates update 1 \
  --subject "Order #{{order_id}} Confirmed"
```

**Output:**
```
✓ Template updated successfully

Template: Order Confirmation (1)
  Subject: Order #{{order_id}} Confirmed (updated)
  Last Updated: just now
```

**Update HTML content:**
```bash
$ cakemail transactional-templates update 1 \
  --html "<h1>Updated template</h1>"
```

**Update from file:**
```bash
$ cakemail transactional-templates update 1 \
  --html "$(cat templates/order-v2.html)"
```

**Update multiple fields:**
```bash
$ cakemail transactional-templates update 1 \
  --name "Order Confirmation v2" \
  --subject "Your {{company_name}} Order" \
  --html "$(cat new-template.html)"
```

---

## transactional-templates delete

Delete a transactional template.

### Usage

```bash
cakemail transactional-templates delete [list-id] <template-id> [options]
```

### Arguments

- `[list-id]` - List ID (optional - auto-detects if only one list exists)
- `<template-id>` - Template ID (required)

### Options

- `-f, --force` - Skip confirmation prompt

### Examples

**Delete with confirmation:**
```bash
$ cakemail transactional-templates delete 1
```

**Output:**
```
✓ Auto-detected list: 123 (Main List)

⚠ Delete template 'Order Confirmation'?
  Template ID: 1
  This action cannot be undone
  Integrations using this template will break

Delete template? (y/N): y

✓ Template deleted successfully
```

**Force delete:**
```bash
$ cakemail transactional-templates delete 1 --force
```

**Developer profile (no confirmation):**
```bash
$ cakemail --profile developer transactional-templates delete 1
```

### Important Notes

**⚠️ Warning: This action is destructive**

When you delete a template:
- Template is permanently removed
- API calls using this template ID will fail
- Application integrations will break
- Cannot be undone

---

## transactional-templates send

Send a template to a recipient.

### Usage

```bash
cakemail transactional-templates send [list-id] <template-id> [options]
```

### Arguments

- `[list-id]` - List ID (optional - auto-detects if only one list exists)
- `<template-id>` - Template ID (required)

### Options

**Recipient (one required):**
- `-e, --email <email>` - Recipient email address
- `-c, --contact-id <id>` - Contact ID from list

**Content:**
- `-v, --variables <json>` - Variables as JSON object (optional)

### Examples

**Send to email address:**
```bash
$ cakemail transactional-templates send 1 \
  --email user@example.com \
  --variables '{"order_id":"12345","order_total":"$99.99"}'
```

**Output:**
```
✓ Template sent successfully

Sent to: user@example.com
Template: Order Confirmation (1)
Variables: order_id, order_total
Email ID: abc-123-def
```

**Send to contact:**
```bash
$ cakemail transactional-templates send 1 \
  --contact-id 456 \
  --variables '{"order_id":"67890"}'
```

**Output:**
```
✓ Template sent successfully

Sent to: john@example.com (Contact 456)
Template: Order Confirmation (1)
Email ID: xyz-789-ghi
```

**No variables:**
```bash
$ cakemail transactional-templates send 2 \
  --email user@example.com
```

**JSON output:**
```bash
$ cakemail -f json transactional-templates send 1 \
  --email user@example.com \
  --variables '{"order_id":"12345"}'
```

**Output:**
```json
{
  "email_id": "abc-123-def",
  "template_id": 1,
  "recipient": "user@example.com",
  "status": "queued",
  "sent_at": "2025-10-11T15:30:00Z"
}
```

### Variable Substitution

Variables passed via `--variables` replace template placeholders:

**Template subject:** `Your order #{{order_id}}`
**Variables:** `{"order_id":"12345"}`
**Result:** `Your order #12345`

**Template HTML:** `<h1>Hello {{name}}!</h1>`
**Variables:** `{"name":"John"}`
**Result:** `<h1>Hello John!</h1>`

### Contact vs Email

**Use `--contact-id` when:**
- Recipient is in your list
- You want to use contact fields (first_name, last_name, etc.)
- You want to track history

**Use `--email` when:**
- Recipient is not in your list
- One-off transactional email
- External system integration

---

## transactional-templates test

Send a test email with sample variables.

### Usage

```bash
cakemail transactional-templates test [list-id] <template-id> [options]
```

### Arguments

- `[list-id]` - List ID (optional - auto-detects if only one list exists)
- `<template-id>` - Template ID (required)

### Options

- `-e, --email <email>` - Test recipient email (required)
- `-v, --variables <json>` - Test variables as JSON (optional)

### Examples

**Send test:**
```bash
$ cakemail transactional-templates test 1 \
  --email test@example.com \
  --variables '{"order_id":"TEST-123","customer_name":"Test User"}'
```

**Output:**
```
✓ Test email sent successfully

Sent to: test@example.com
Template: Order Confirmation (1)
Variables: order_id, customer_name
Status: delivered
```

**Test without variables:**
```bash
$ cakemail transactional-templates test 1 \
  --email test@example.com
```

**Output:**
```
✓ Test email sent

Note: Template variables were not replaced
  Subject: Your order #{{order_id}}

Send with --variables for realistic test
```

### Use Cases

**Development testing:**
```bash
# Test with realistic data
cakemail transactional-templates test 1 \
  --email dev@company.com \
  --variables '{"order_id":"DEV-001","total":"$99.99"}'
```

**QA review:**
```bash
# Test all templates before launch
cakemail transactional-templates test 1 --email qa@company.com
cakemail transactional-templates test 2 --email qa@company.com
cakemail transactional-templates test 3 --email qa@company.com
```

---

## transactional-templates render

Render template HTML with variables (preview without sending).

### Usage

```bash
cakemail transactional-templates render [list-id] <template-id> [options]
```

### Arguments

- `[list-id]` - List ID (optional - auto-detects if only one list exists)
- `<template-id>` - Template ID (required)

### Options

- `-c, --contact-id <id>` - Use contact data for personalization (optional)
- `-v, --variables <json>` - Variables for substitution (optional)

### Examples

**Render with variables:**
```bash
$ cakemail transactional-templates render 1 \
  --variables '{"order_id":"12345","customer_name":"John Doe"}'
```

**Output:**
```
✓ Template rendered successfully

Subject: Your order #12345

HTML Preview:
<html>
<h1>Thank you John Doe!</h1>
<p>Your order #12345 is confirmed.</p>
</html>

Text Preview:
Thank you John Doe!
Your order #12345 is confirmed.
```

**Render with contact:**
```bash
$ cakemail transactional-templates render 1 --contact-id 456
```

**Output (uses contact fields):**
```
✓ Template rendered with contact data

Contact: john@example.com (456)
  first_name: John
  last_name: Doe

Subject: Your order #{{order_id}}

HTML: <h1>Hello John Doe!</h1>...
```

**JSON output:**
```bash
$ cakemail -f json transactional-templates render 1 \
  --variables '{"order_id":"12345"}'
```

**Output:**
```json
{
  "template_id": 1,
  "subject": "Your order #12345",
  "html": "<html><h1>Thank you!</h1>...</html>",
  "text": "Thank you! Your order #12345...",
  "variables_used": ["order_id"]
}
```

### Use Cases

**Preview before sending:**
```bash
# Check how template looks with real data
cakemail transactional-templates render 1 \
  --variables '{"order_id":"12345","total":"$99.99"}' \
  > preview.html

# Open in browser
open preview.html
```

**Debug variable issues:**
```bash
# See which variables are replaced
cakemail transactional-templates render 1 --variables '{}'
```

---

## Common Workflows

### Workflow 1: Create and Test Template

```bash
# 1. Create template
cakemail transactional-templates create \
  --name "Order Confirmation" \
  --subject "Order #{{order_id}} Confirmed" \
  --html "$(cat template.html)" \
  --sender-id 456

# 2. Render preview
cakemail transactional-templates render 1 \
  --variables '{"order_id":"TEST-001"}'

# 3. Send test
cakemail transactional-templates test 1 \
  --email test@company.com \
  --variables '{"order_id":"TEST-001"}'

# 4. Send real email
cakemail transactional-templates send 1 \
  --email customer@example.com \
  --variables '{"order_id":"12345"}'
```

---

### Workflow 2: Template Development Cycle

```bash
# Edit template locally
vim templates/welcome.html

# Update template
cakemail transactional-templates update 2 \
  --html "$(cat templates/welcome.html)"

# Preview changes
cakemail transactional-templates render 2 \
  --variables '{"first_name":"Test"}'

# Test
cakemail transactional-templates test 2 \
  --email dev@company.com \
  --variables '{"first_name":"Developer"}'
```

---

### Workflow 3: Bulk Template Setup

```bash
#!/bin/bash
# Setup all transactional templates

# Order confirmation
cakemail transactional-templates create \
  --name "Order Confirmation" \
  --subject "Order #{{order_id}}" \
  --html "$(cat order-confirm.html)" \
  --sender-id 456

# Password reset
cakemail transactional-templates create \
  --name "Password Reset" \
  --subject "Reset your password" \
  --html "$(cat password-reset.html)" \
  --sender-id 789

# Welcome email
cakemail transactional-templates create \
  --name "Welcome" \
  --subject "Welcome to {{company_name}}" \
  --html "$(cat welcome.html)" \
  --sender-id 456
```

---

## Best Practices

### 1. Always Include Plain Text Version

```bash
cakemail transactional-templates create \
  --name "Order Confirmation" \
  --html "<h1>Order Confirmed</h1>" \
  --text "Order Confirmed" \  # ✅ Good
  --sender-id 456
```

### 2. Use Descriptive Variable Names

**Good:**
- `{{first_name}}`
- `{{order_id}}`
- `{{reset_link}}`

**Avoid:**
- `{{var1}}`
- `{{x}}`
- `{{temp}}`

### 3. Test with Realistic Data

```bash
# Test with actual data format
cakemail transactional-templates test 1 \
  --email test@example.com \
  --variables '{"order_total":"$1,234.56","date":"Oct 11, 2025"}'
```

### 4. Version Your Templates

Maintain template versions in source control:
```
templates/
  order-confirmation-v1.html
  order-confirmation-v2.html
  password-reset.html
```

---

## Troubleshooting

### Variable Not Replaced

**Problem:** Template shows `{{variable_name}}` instead of value

**Solutions:**
1. Check variable name spelling
2. Ensure variable passed in `--variables`
3. Use correct JSON format: `'{"key":"value"}'`

---

### Send Failed

**Problem:** Email not sent

**Solutions:**
1. Verify sender is confirmed: `cakemail senders get 456`
2. Check recipient email is valid
3. Ensure template exists: `cakemail transactional-templates show 1`
4. Check for API errors in output

---

### Template Not Found

**Problem:** `Error: Template 1 not found`

**Solutions:**
1. List templates: `cakemail transactional-templates list`
2. Check list ID is correct
3. Verify template wasn't deleted

---

