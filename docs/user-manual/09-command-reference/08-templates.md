# Template Commands

Manage reusable email templates for campaigns.

## Overview

Template commands allow you to:
- Create reusable HTML and text email templates
- List and search templates
- Update template content and metadata
- Preview/render templates before use
- Delete unused templates
- Tag templates for organization

Templates provide a way to standardize email designs and content across campaigns. They support both HTML and plain text formats.

**Note**: For transactional email templates, see [Transactional Templates Commands](/en/cli/command-reference/transactional-templates/).

## Commands

- [templates list](#templates-list) - List all templates
- [templates get](#templates-get) - Get template details
- [templates create](#templates-create) - Create a new template
- [templates update](#templates-update) - Update template content
- [templates render](#templates-render) - Preview template
- [templates delete](#templates-delete) - Delete a template

---

## templates list

List all email templates with filtering and sorting.

### Usage

```bash
cakemail templates list [options]
```

### Options

- `-l, --limit <number>` - Limit number of results per page
- `-p, --page <number>` - Page number (default: 1)
- `-f, --filter <filter>` - Filter by name or tags (e.g., `name==Newsletter`)
- `-s, --sort <sort>` - Sort order (e.g., `+name`, `-created_on`)

### Examples

**List all templates:**

```bash
$ cakemail templates list
```

**Output:**
```
┌────────┬─────────────────────┬───────────────┬─────────────────────┐
│ ID     │ Name                │ Tags          │ Created             │
├────────┼─────────────────────┼───────────────┼─────────────────────┤
│ 201    │ Newsletter Template │ newsletter    │ 2024-01-15 10:30:00 │
│ 202    │ Product Promo       │ promo,product │ 2024-02-01 14:20:00 │
│ 203    │ Welcome Series      │ onboarding    │ 2024-03-01 09:00:00 │
└────────┴─────────────────────┴───────────────┴─────────────────────┘
```

**Filter by name:**

```bash
$ cakemail templates list -f "name==Newsletter"
```

**Sort by most recently created:**

```bash
$ cakemail templates list -s "-created_on"
```

**Sort by name:**

```bash
$ cakemail templates list -s "+name"
```

**List with pagination:**

```bash
$ cakemail templates list -l 10 -p 1
```

**Export templates as JSON:**

```bash
$ cakemail templates list -f json > templates.json
```

**Output:**
```json
{
  "data": [
    {
      "id": 201,
      "name": "Newsletter Template",
      "tags": ["newsletter"],
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-02-10T16:45:00Z"
    }
  ],
  "count": 3
}
```

**Find templates by tag:**

```bash
$ cakemail templates list -f json | jq '.data[] | select(.tags[] | contains("newsletter"))'
```

### Notes

- Filter syntax: `field==value` with semicolons for multiple filters
- Sort options: `+name`, `-name`, `+created_on`, `-created_on`, `+updated_on`, `-updated_on`
- Tags help organize templates by category or purpose
- Use pagination for accounts with many templates

### Related Commands

- [templates get](#templates-get) - View template details
- [templates create](#templates-create) - Create new template
- [campaigns create](/en/cli/command-reference/campaigns#campaigns-create) - Use template in campaign

---

## templates get

Get detailed information about a specific template including content.

### Usage

```bash
cakemail templates get <id>
```

### Arguments

- `id` - Template ID (required)

### Examples

**Get template details:**

```bash
$ cakemail templates get 201
```

**Output:**
```
{
  "id": 201,
  "name": "Newsletter Template",
  "subject": "Monthly Newsletter - {{month}}",
  "html": "<!DOCTYPE html>\n<html>\n<head>...</head>\n<body>\n<h1>Welcome!</h1>\n<p>{{content}}</p>\n</body>\n</html>",
  "text": "Welcome!\n\n{{content}}",
  "tags": ["newsletter", "monthly"],
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-02-10T16:45:00Z"
}
```

**Extract HTML content:**

```bash
$ cakemail templates get 201 -f json | jq -r '.html' > template.html
```

**Extract template name:**

```bash
$ cakemail templates get 201 -f json | jq -r '.name'
```

**Output:**
```
Newsletter Template
```

**View template tags:**

```bash
$ cakemail templates get 201 -f json | jq '.tags'
```

**Output:**
```json
["newsletter", "monthly"]
```

### Notes

- Returns complete template including HTML and text content
- Subject line may include merge tags (e.g., `{{variable}}`)
- HTML content includes full document structure
- Text content is plain text alternative

### Related Commands

- [templates render](#templates-render) - Preview rendered template
- [templates update](#templates-update) - Modify template
- [templates list](#templates-list) - Find template IDs

---

## templates create

Create a new email template with HTML and text content.

### Usage

```bash
cakemail templates create [options]
```

### Options

**Required:**
- `-n, --name <name>` - Template name

**Content (at least one required):**
- `--html <html>` - HTML content (inline)
- `--html-file <path>` - Path to HTML file
- `--text <text>` - Plain text content (inline)
- `--text-file <path>` - Path to text file

**Optional:**
- `--subject <subject>` - Default email subject
- `--tags <tags>` - Comma-separated tags

### Examples

**Create template from file:**

```bash
$ cakemail templates create \
  -n "Newsletter Template" \
  --html-file ./templates/newsletter.html \
  --text-file ./templates/newsletter.txt \
  --subject "Monthly Newsletter"
```

**Output:**
```
✓ Template created: 201
{
  "id": 201,
  "name": "Newsletter Template",
  "subject": "Monthly Newsletter"
}
```

**Create template with inline HTML:**

```bash
$ cakemail templates create \
  -n "Simple Promo" \
  --html "<h1>Special Offer!</h1><p>Save 20% today.</p>" \
  --text "Special Offer! Save 20% today."
```

**Output:**
```
✓ Template created: 202
```

**Create template with tags:**

```bash
$ cakemail templates create \
  -n "Welcome Email" \
  --html-file ./welcome.html \
  --tags "onboarding,welcome,automated"
```

**Output:**
```
✓ Template created: 203
{
  "id": 203,
  "name": "Welcome Email",
  "tags": ["onboarding", "welcome", "automated"]
}
```

**Create template with subject and merge tags:**

```bash
$ cakemail templates create \
  -n "Personalized Newsletter" \
  --html-file ./newsletter.html \
  --subject "Hi {{first_name}}, here's your newsletter"
```

**Create multipart template:**

```bash
$ cakemail templates create \
  -n "Product Update" \
  --html-file ./update.html \
  --text-file ./update.txt \
  --subject "New Product Features" \
  --tags "product,update"
```

### Merge Tags

Templates support merge tags for personalization:

- `{{first_name}}` - Contact's first name
- `{{last_name}}` - Contact's last name
- `{{email}}` - Contact's email
- `{{custom_field}}` - Any custom attribute

### Notes

- At least one content type (HTML or text) required
- Both HTML and text recommended for best deliverability
- Subject line is optional but recommended
- Tags help organize and filter templates
- HTML content should include full document structure
- Merge tags replaced when sending campaign

### Related Commands

- [templates get](#templates-get) - View created template
- [templates render](#templates-render) - Preview template
- [campaigns create](/en/cli/command-reference/campaigns#campaigns-create) - Use template

---

## templates update

Update an existing template's content or metadata.

### Usage

```bash
cakemail templates update <id> [options]
```

### Arguments

- `id` - Template ID (required)

### Options

- `-n, --name <name>` - New template name
- `--html <html>` - New HTML content (inline)
- `--html-file <path>` - Path to new HTML file
- `--text <text>` - New plain text content (inline)
- `--text-file <path>` - Path to new text file
- `--subject <subject>` - New default subject
- `--tags <tags>` - New comma-separated tags (replaces existing)

### Examples

**Update template name:**

```bash
$ cakemail templates update 201 -n "Monthly Newsletter Template"
```

**Output:**
```
✓ Template 201 updated
{
  "id": 201,
  "name": "Monthly Newsletter Template"
}
```

**Update HTML content from file:**

```bash
$ cakemail templates update 201 --html-file ./templates/newsletter-v2.html
```

**Output:**
```
✓ Template 201 updated
```

**Update subject line:**

```bash
$ cakemail templates update 201 --subject "{{month}} Newsletter - Special Edition"
```

**Update tags:**

```bash
$ cakemail templates update 201 --tags "newsletter,monthly,featured"
```

**Update multiple fields:**

```bash
$ cakemail templates update 201 \
  -n "Premium Newsletter" \
  --html-file ./premium-newsletter.html \
  --text-file ./premium-newsletter.txt \
  --subject "Premium: {{month}} Newsletter" \
  --tags "premium,newsletter"
```

**Update only HTML (keep text):**

```bash
$ cakemail templates update 201 --html-file ./new-design.html
```

**Update inline content:**

```bash
$ cakemail templates update 202 \
  --html "<h1>Updated Offer!</h1><p>Save 30% now.</p>"
```

### Notes

- Only provided fields are updated (partial updates)
- Tags are replaced entirely (not merged)
- File paths must point to valid accessible files
- Changes apply to future campaign uses (not retroactive)
- Template ID remains the same

### Related Commands

- [templates get](#templates-get) - View current template
- [templates render](#templates-render) - Preview changes
- [templates create](#templates-create) - Create new template

---

## templates render

Preview/render a template to see how it will appear.

### Usage

```bash
cakemail templates render <id>
```

### Arguments

- `id` - Template ID (required)

### Examples

**Render template:**

```bash
$ cakemail templates render 201
```

**Output:**
```
{
  "html": "<!DOCTYPE html>\n<html>\n<head>...</head>\n<body>\n<h1>Welcome!</h1>\n<p>This is your newsletter.</p>\n</body>\n</html>",
  "text": "Welcome!\n\nThis is your newsletter.",
  "subject": "Monthly Newsletter"
}
```

**Save rendered HTML to file:**

```bash
$ cakemail templates render 201 -f json | jq -r '.html' > preview.html
```

**Open rendered HTML in browser:**

```bash
$ cakemail templates render 201 -f json | jq -r '.html' > preview.html && open preview.html
```

**View rendered text version:**

```bash
$ cakemail templates render 201 -f json | jq -r '.text'
```

**Output:**
```
Welcome!

This is your newsletter.
```

**Check rendered subject:**

```bash
$ cakemail templates render 201 -f json | jq -r '.subject'
```

**Output:**
```
Monthly Newsletter
```

### Notes

- Shows how template will appear when sent
- Merge tags shown as-is (not replaced with data)
- Use to verify template design before sending
- Useful for testing template changes
- No emails sent (preview only)

### Related Commands

- [templates get](#templates-get) - View template source
- [templates update](#templates-update) - Modify template
- [campaigns test](/en/cli/command-reference/campaigns#campaigns-test) - Send test with data

---

## templates delete

Permanently delete a template.

### Usage

```bash
cakemail templates delete <id> [options]
```

### Arguments

- `id` - Template ID (required)

### Options

- `-f, --force` - Skip confirmation prompt (use in scripts)

### Examples

**Delete template with confirmation:**

```bash
$ cakemail templates delete 203
```

**Output:**
```
⚠ Delete template 203?

The following will happen:
  • Template will be permanently deleted
  • Any campaigns using this template may be affected

Type 'yes' to confirm: yes

✓ Template 203 deleted
```

**Force delete without confirmation:**

```bash
$ cakemail templates delete 203 --force
```

**Output:**
```
✓ Template 203 deleted
```

**Delete in script:**

```bash
$ cakemail templates delete 203 --force --batch
```

### Notes

- Deletion is permanent and cannot be undone
- Historical campaigns using template remain intact
- Future campaigns cannot use deleted template
- Template content cannot be recovered
- Confirmation required unless `--force` is used

### Related Commands

- [templates list](#templates-list) - View templates before deletion
- [templates get](#templates-get) - Review template before deleting

---

## Common Workflows

### Workflow 1: Create Template from Files

```bash
# Prepare HTML and text files
# templates/newsletter.html
# templates/newsletter.txt

# Create template
$ cakemail templates create \
  -n "March Newsletter" \
  --html-file ./templates/newsletter.html \
  --text-file ./templates/newsletter.txt \
  --subject "{{month}} Newsletter" \
  --tags "newsletter,monthly"

# Note template ID (e.g., 201)

# Preview template
$ cakemail templates render 201 -f json | jq -r '.html' > preview.html
$ open preview.html

# Use in campaign
$ cakemail campaigns create \
  -n "March Newsletter Campaign" \
  -l 123 \
  -s 101 \
  --template 201
```

### Workflow 2: Update Existing Template

```bash
# Get current template
$ cakemail templates get 201

# Make changes to local files
# Edit: templates/newsletter-v2.html

# Update template
$ cakemail templates update 201 --html-file ./templates/newsletter-v2.html

# Preview changes
$ cakemail templates render 201 -f json | jq -r '.html' > preview-v2.html
$ open preview-v2.html
```

### Workflow 3: Template Organization

```bash
# List all templates
$ cakemail templates list

# Add tags to organize
$ cakemail templates update 201 --tags "newsletter,active"
$ cakemail templates update 202 --tags "promo,seasonal"
$ cakemail templates update 203 --tags "onboarding,automated"

# Find templates by tag
$ cakemail templates list -f json | jq '.data[] | select(.tags[] | contains("newsletter"))'
```

### Workflow 4: Template Testing

```bash
# Create test template
$ cakemail templates create \
  -n "Test Design" \
  --html-file ./test-design.html \
  --tags "test"

# Render preview
$ cakemail templates render 204 -f json | jq -r '.html' > test.html

# Review in browser
$ open test.html

# If good, update production template
$ cakemail templates update 201 --html-file ./test-design.html

# Delete test template
$ cakemail templates delete 204 --force
```

### Workflow 5: Template Backup

```bash
# Export all templates
$ cakemail templates list -f json > templates-backup.json

# Extract each template's content
for id in $(jq -r '.data[].id' templates-backup.json); do
  echo "Backing up template $id..."
  cakemail templates get $id -f json > "backup-template-$id.json"
  cakemail templates get $id -f json | jq -r '.html' > "backup-template-$id.html"
done
```

## Best Practices

1. **Version Control**: Store template HTML/CSS in version control
2. **Multipart Templates**: Always include both HTML and text versions
3. **Test Before Use**: Preview templates before using in campaigns
4. **Consistent Naming**: Use clear, descriptive template names
5. **Tag Organization**: Use tags to categorize templates
6. **Responsive Design**: Ensure HTML templates work on mobile devices
7. **Merge Tags**: Use merge tags for personalization
8. **Regular Cleanup**: Delete unused or outdated templates
9. **Backup Important Templates**: Export templates regularly

## Troubleshooting

### Error: "Template ID not found"

Template doesn't exist or was deleted.

**Solution:**
```bash
# List templates to find valid ID
$ cakemail templates list

# Use correct template ID
$ cakemail templates get 201
```

### HTML Not Rendering Correctly

CSS or HTML structure issues.

**Solution:**
```bash
# Preview template
$ cakemail templates render 201 -f json | jq -r '.html' > test.html

# Open in browser
$ open test.html

# Check for:
# - Missing closing tags
# - Invalid CSS
# - External resource links (should be inline or absolute URLs)

# Fix and update
$ cakemail templates update 201 --html-file ./fixed-template.html
```

### Merge Tags Not Working

Incorrect syntax or unsupported field.

**Solution:**
```bash
# Use double curly braces
# Correct: {{first_name}}
# Incorrect: {first_name} or $first_name

# Ensure field exists in contacts
$ cakemail contacts get 123 501 -f json | jq '.custom_attributes'

# Update template with correct tags
$ cakemail templates update 201 --subject "Hi {{first_name}}, welcome!"
```

### Template Too Large

HTML file size exceeds limits.

**Solution:**
```bash
# Check file size
$ ls -lh ./templates/large-template.html

# Optimize:
# - Inline CSS instead of external stylesheets
# - Compress/minify HTML
# - Remove unnecessary whitespace
# - Optimize images (use external URLs)
# - Remove comments

# Update with optimized version
$ cakemail templates update 201 --html-file ./optimized-template.html
```

### Cannot Delete Template

Template may be in use by active campaigns.

**Solution:**
```bash
# Check which campaigns use this template
$ cakemail campaigns list -f json | jq '.data[] | select(.template_id == 201)'

# Wait for campaigns to complete
# Or update campaigns to use different template

# Then delete
$ cakemail templates delete 201 --force
```

### Text Version Not Displaying

Text content may be missing or not provided.

**Solution:**
```bash
# Check if template has text content
$ cakemail templates get 201 -f json | jq '.text'

# If null or missing, add text version
$ cakemail templates update 201 --text-file ./newsletter.txt

# Or generate from HTML (manual process)
$ cakemail templates get 201 -f json | jq -r '.html' | html2text > newsletter.txt
$ cakemail templates update 201 --text-file ./newsletter.txt
```

---

**Related Documentation:**
- [Campaigns Commands](/en/cli/command-reference/campaigns/) - Use templates in campaigns
- [Transactional Templates Commands](/en/cli/command-reference/transactional-templates/) - Templates for Email API
- [Senders Commands](/en/cli/command-reference/senders/) - Manage sender identities
