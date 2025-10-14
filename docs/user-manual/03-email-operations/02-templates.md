# Templates

Create, manage, and use email templates for consistent, reusable email content.

## Overview

Email templates are reusable content structures with variable placeholders. They allow you to:
- **Maintain consistency** across emails
- **Save time** with pre-built layouts
- **Support personalization** with variables
- **Version control** email designs
- **A/B test** different versions

## Template Commands

### List Templates

```bash
cakemail templates list [options]
```

**Options:**
- `-l, --limit <number>` - Results per page
- `-p, --page <number>` - Page number
- `-f, --filter <filter>` - Filter by name or tags
- `-s, --sort <sort>` - Sort order

**Examples:**
```bash
# All templates
cakemail templates list

# Filter by name
cakemail templates list --filter "name==Newsletter"

# Sort by name
cakemail templates list --sort "+name"

# Recent templates
cakemail templates list --sort "-created_on" --limit 10
```

### Get Template Details

```bash
cakemail templates get <template-id>
```

**Example:**
```bash
cakemail templates get 123
```

### Create Template

```bash
cakemail templates create \
  -n "Template Name" \
  [content options] \
  [additional options]
```

**Required:**
- `-n, --name <name>` - Template name

**Content Options:**
- `--html <html>` - Inline HTML
- `--html-file <path>` - HTML from file
- `--text <text>` - Inline plain text
- `--text-file <path>` - Text from file

**Additional Options:**
- `--subject <subject>` - Default subject
- `--tags <tags>` - Comma-separated tags

**Examples:**
```bash
# From file
cakemail templates create \
  -n "Welcome Email" \
  --html-file templates/welcome.html \
  --text-file templates/welcome.txt \
  --subject "Welcome to {{company}}" \
  --tags "welcome,onboarding"

# Inline content
cakemail templates create \
  -n "Simple Template" \
  --html "<h1>Hi {{name}}</h1><p>{{message}}</p>" \
  --subject "Hello {{name}}"
```

### Update Template

```bash
cakemail templates update <template-id> [options]
```

**Options:**
- `-n, --name <name>` - New name
- `--html <html>` or `--html-file <path>` - Update HTML
- `--text <text>` or `--text-file <path>` - Update text
- `--subject <subject>` - Update subject
- `--tags <tags>` - Update tags

**Examples:**
```bash
# Update content from file
cakemail templates update 123 --html-file updated-template.html

# Update name and subject
cakemail templates update 123 \
  -n "Welcome Email v2" \
  --subject "Welcome to Acme, {{name}}!"

# Update tags
cakemail templates update 123 --tags "welcome,v2,active"
```

### Render Template

Preview the rendered output:

```bash
cakemail templates render <template-id>
```

**Example:**
```bash
cakemail templates render 123 > preview.html
```

### Delete Template

```bash
cakemail templates delete <template-id> [--force]
```

**Examples:**
```bash
# Interactive confirmation
cakemail templates delete 123

# Skip confirmation
cakemail templates delete 123 --force
```

---

## Template Variables

Use `{{variable}}` syntax for dynamic content.

### Basic Variables

```html
<h1>Hi {{name}},</h1>
<p>Your order {{orderNumber}} has shipped.</p>
```

### Common Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `{{name}}` | Recipient name | John Doe |
| `{{firstName}}` | First name | John |
| `{{email}}` | Email address | john@example.com |
| `{{company}}` | Company name | Acme Inc |
| `{{orderNumber}}` | Order ID | ORD-12345 |
| `{{date}}` | Date | 2024-06-15 |
| `{{url}}` | Custom URL | https://... |

### Using Variables

```bash
cakemail emails send \
  -t john@example.com \
  -s "Welcome {{name}}" \
  --template-id 123 \
  --params '{"name":"John","company":"Acme Inc"}'
```

---

## Template Structure

### Complete Template Example

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{subject}}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: #007bff;
      color: white;
      padding: 20px;
      text-align: center;
    }
    .content {
      padding: 20px;
      background: #f9f9f9;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background: #007bff;
      color: white;
      text-decoration: none;
      border-radius: 4px;
    }
    .footer {
      padding: 20px;
      text-align: center;
      font-size: 12px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>{{companyName}}</h1>
  </div>

  <div class="content">
    <h2>Hi {{firstName}},</h2>
    <p>{{message}}</p>
    <p>
      <a href="{{actionUrl}}" class="button">{{actionText}}</a>
    </p>
  </div>

  <div class="footer">
    <p>&copy; 2024 {{companyName}}. All rights reserved.</p>
    <p>
      <a href="{{unsubscribeUrl}}">Unsubscribe</a> |
      <a href="{{preferencesUrl}}">Preferences</a>
    </p>
  </div>
</body>
</html>
```

### Plain Text Version

```text
{{companyName}}
======================

Hi {{firstName}},

{{message}}

{{actionText}}: {{actionUrl}}

---
© 2024 {{companyName}}. All rights reserved.

Unsubscribe: {{unsubscribeUrl}}
Update preferences: {{preferencesUrl}}
```

---

## Practical Examples

### Example 1: Welcome Email Template

```bash
cakemail templates create \
  -n "Welcome Email" \
  --html-file welcome.html \
  --text-file welcome.txt \
  --subject "Welcome to {{companyName}}, {{firstName}}!" \
  --tags "welcome,onboarding"
```

### Example 2: Order Confirmation

```bash
cakemail templates create \
  -n "Order Confirmation" \
  --html-file order-confirmation.html \
  --subject "Order {{orderNumber}} Confirmed" \
  --tags "transactional,order"
```

### Example 3: Newsletter Template

```bash
cakemail templates create \
  -n "Monthly Newsletter" \
  --html-file newsletter.html \
  --subject "{{companyName}} Newsletter - {{month}} {{year}}" \
  --tags "newsletter,marketing"
```

---

## Template Management

### Organizing with Tags

```bash
# Tag by type
--tags "transactional,order"
--tags "marketing,newsletter"
--tags "system,notification"

# Tag by version
--tags "welcome,v2,active"

# Tag by audience
--tags "customers,premium"
```

### Filtering by Tags

```bash
cakemail templates list --filter "tags==newsletter"
```

### Template Versioning

**Create new version:**
```bash
# Get current template
cakemail templates get 123 > template-v1.json

# Create v2
cakemail templates create \
  -n "Welcome Email v2" \
  --html-file welcome-v2.html \
  --tags "welcome,v2"

# Archive old version
cakemail templates update 123 --tags "welcome,v1,archived"
```

---

## Best Practices

### 1. Always Provide Plain Text

```bash
cakemail templates create \
  -n "Template" \
  --html-file template.html \
  --text-file template.txt  # ← Always include
```

### 2. Use Descriptive Names

```bash
# ✅ Good
-n "Order Confirmation v2"

# ❌ Avoid
-n "Template 1"
```

### 3. Test Before Using

```bash
# Create template
TEMPLATE_ID=$(cakemail templates create ... | jq -r '.id')

# Test with real data
cakemail emails send \
  -t test@example.com \
  --template-id $TEMPLATE_ID \
  --params '{"name":"Test User"}'
```

### 4. Keep Templates Simple

- Avoid complex CSS (email clients vary)
- Use inline styles where possible
- Test across email clients
- Provide fallback content

### 5. Version Your Templates

```bash
# Store templates in version control
git add templates/
git commit -m "Add welcome email v2"

# Tag template in Cakemail
--tags "welcome,v2,production"
```

---

## Troubleshooting

### Variables Not Substituting

**Check JSON format:**
```bash
# ✅ Correct
--params '{"name":"John"}'

# ❌ Invalid
--params '{name:John}'
```

### Template Rendering Issues

```bash
# Preview template
cakemail templates render 123 > preview.html

# Open in browser to check
open preview.html
```

### HTML Not Displaying

**Common issues:**
- Missing DOCTYPE
- Unsupported CSS
- Invalid HTML structure

**Test with simple HTML first:**
```html
<h1>Hi {{name}}</h1>
<p>This is a test.</p>
```

---

