# List Commands

Manage contact lists, including creation, updates, archiving, and subscription form endpoints.

## Overview

List commands allow you to:
- Create and manage contact lists
- List all lists with filtering and sorting
- Archive lists instead of deleting them
- Manage subscription form endpoints for list signup
- Accept policy requirements for lists

Lists are the primary organizational structure for contacts in Cakemail. Each list can have its own interests, segments, and subscription forms.

## Commands

- [lists list](#lists-list) - List all contact lists
- [lists get](#lists-get) - Get list details
- [lists create](#lists-create) - Create a new list
- [lists update](#lists-update) - Update list information
- [lists delete](#lists-delete) - Delete a list permanently
- [lists archive](#lists-archive) - Archive a list
- [lists accept-policy](#lists-accept-policy) - Accept policy for list
- [lists forms](#lists-forms) - List subscription form endpoints
- [lists form-create](#lists-form-create) - Create subscription form
- [lists form-delete](#lists-form-delete) - Delete subscription form

---

## lists list

List all contact lists in your account with optional filtering and sorting.

### Usage

```bash
cakemail lists list [options]
```

### Options

- `-l, --limit <number>` - Limit number of results per page
- `-p, --page <number>` - Page number (default: 1)
- `--sort <sort>` - Sort order (e.g., `+name`, `-created_on`)
- `--filter <filter>` - Filter expression (e.g., `status==active;name==Newsletter`)

### Examples

**List all lists:**

```bash
$ cakemail lists list
```

**Output:**
```
┌────────┬─────────────────────┬────────────┬───────────┬─────────────────────┐
│ ID     │ Name                │ Contacts   │ Language  │ Created             │
├────────┼─────────────────────┼────────────┼───────────┼─────────────────────┤
│ 123    │ Newsletter Sub...   │ 1,234      │ en        │ 2024-01-15 10:30:00 │
│ 124    │ Product Updates     │ 856        │ en        │ 2024-02-20 14:15:00 │
│ 125    │ VIP Customers       │ 45         │ fr        │ 2024-03-01 09:00:00 │
└────────┴─────────────────────┴────────────┴───────────┴─────────────────────┘
```

**Filter active lists:**

```bash
$ cakemail lists list --filter "status==active"
```

**Sort by name (ascending):**

```bash
$ cakemail lists list --sort "+name"
```

**Output:**
```
┌────────┬─────────────────────┬────────────┬───────────┐
│ ID     │ Name                │ Contacts   │ Language  │
├────────┼─────────────────────┼────────────┼───────────┤
│ 123    │ Newsletter Sub...   │ 1,234      │ en        │
│ 124    │ Product Updates     │ 856        │ en        │
│ 125    │ VIP Customers       │ 45         │ fr        │
└────────┴─────────────────────┴────────────┴───────────┘
```

**Sort by most recently created:**

```bash
$ cakemail lists list --sort "-created_on" -l 5
```

**List in JSON format for automation:**

```bash
$ cakemail lists list -f json | jq '.data[] | {id, name, contacts: .contact_count}'
```

**Output:**
```json
{"id": 123, "name": "Newsletter Subscribers", "contacts": 1234}
{"id": 124, "name": "Product Updates", "contacts": 856}
{"id": 125, "name": "VIP Customers", "contacts": 45}
```

### Notes

- Default sort order is by creation date (newest first)
- Filter syntax: `field==value` with semicolons for multiple filters
- Sort accepts `+` (ascending) or `-` (descending) prefix
- Common filter fields: `status`, `name`, `language`
- Use `--limit` for pagination control

### Related Commands

- [lists get](#lists-get) - View detailed list information
- [lists create](#lists-create) - Create a new list
- [contacts list](/en/cli/command-reference/contacts#contacts-list) - View contacts in a list

---

## lists get

Get detailed information about a specific list.

### Usage

```bash
cakemail lists get <id>
```

### Arguments

- `id` - List ID (required)

### Examples

**Get list details:**

```bash
$ cakemail lists get 123
```

**Output:**
```
{
  "id": 123,
  "name": "Newsletter Subscribers",
  "language": "en",
  "status": "active",
  "contact_count": 1234,
  "subscribed_count": 1180,
  "unsubscribed_count": 54,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-03-15T14:20:00Z",
  "policy_accepted": true
}
```

**Extract specific fields:**

```bash
$ cakemail lists get 123 -f json | jq '{name, contacts: .contact_count}'
```

**Output:**
```json
{
  "name": "Newsletter Subscribers",
  "contacts": 1234
}
```

### Notes

- Returns complete list metadata including contact counts
- Shows subscription statistics (subscribed vs unsubscribed)
- Indicates if policy has been accepted
- Use `-f json` for structured output

### Related Commands

- [lists list](#lists-list) - Find list IDs
- [lists update](#lists-update) - Modify list details
- [contacts list](/en/cli/command-reference/contacts#contacts-list) - View list contacts

---

## lists create

Create a new contact list.

### Usage

```bash
cakemail lists create [options]
```

### Options

- `-n, --name <name>` - List name (optional - prompts if not provided)
- `-l, --language <lang>` - Language code, e.g., `en`, `fr` (optional)

### Examples

**Create list with name option (Developer profile):**

```bash
$ cakemail lists create -n "Newsletter Subscribers"
```

**Output:**
```
✓ List created: 123
{
  "id": 123,
  "name": "Newsletter Subscribers",
  "status": "active",
  "contact_count": 0
}
```

**Create list with language:**

```bash
$ cakemail lists create -n "Abonnés Newsletter" -l fr
```

**Output:**
```
✓ List created: 124
{
  "id": 124,
  "name": "Abonnés Newsletter",
  "language": "fr",
  "status": "active",
  "contact_count": 0
}
```

**Interactive creation (Marketer/Balanced profile):**

```bash
$ cakemail lists create
```

**Output:**
```
List name: Product Updates
Language code (optional, e.g., en, fr): en

✓ List created: 125
{
  "id": 125,
  "name": "Product Updates",
  "language": "en",
  "status": "active"
}
```

**Create list in script:**

```bash
$ cakemail lists create -n "VIP Customers" -l en --batch
```

### Profile Behavior

- **Developer**: Requires `--name` option, no prompts
- **Marketer**: Interactive prompts if options missing
- **Balanced**: Interactive prompts with option preferences

### Notes

- List name is required (prompted if not provided in interactive profiles)
- Language defaults to account language if not specified
- New lists start with 0 contacts
- List status is automatically set to "active"
- Language affects default email templates and subscription forms

### Related Commands

- [lists list](#lists-list) - View all lists
- [contacts add](/en/cli/command-reference/contacts#contacts-add) - Add contacts to list
- [lists update](#lists-update) - Modify list after creation

---

## lists update

Update an existing list's information.

### Usage

```bash
cakemail lists update <id> [options]
```

### Arguments

- `id` - List ID (required)

### Options

- `-n, --name <name>` - New list name
- `-l, --language <lang>` - New language code

### Examples

**Update list name:**

```bash
$ cakemail lists update 123 -n "Monthly Newsletter"
```

**Output:**
```
✓ List 123 updated
{
  "id": 123,
  "name": "Monthly Newsletter",
  "language": "en"
}
```

**Update language:**

```bash
$ cakemail lists update 123 -l fr
```

**Output:**
```
✓ List 123 updated
{
  "id": 123,
  "name": "Monthly Newsletter",
  "language": "fr"
}
```

**Update multiple fields:**

```bash
$ cakemail lists update 123 -n "Newsletter Mensuel" -l fr
```

**Output:**
```
✓ List 123 updated
{
  "id": 123,
  "name": "Newsletter Mensuel",
  "language": "fr"
}
```

### Notes

- Only provided fields are updated (partial updates)
- Changing language affects future email templates
- List ID cannot be changed
- Contact data is preserved during updates

### Related Commands

- [lists get](#lists-get) - View current list details
- [lists create](#lists-create) - Create new list

---

## lists delete

Permanently delete a list and all its contents.

### Usage

```bash
cakemail lists delete <id> [options]
```

### Arguments

- `id` - List ID (required)

### Options

- `-f, --force` - Skip confirmation prompt (use in scripts)

### Examples

**Delete list with confirmation:**

```bash
$ cakemail lists delete 123
```

**Output:**
```
⚠ DANGER: Delete list 123?

This is a dangerous operation. The following will happen:
  • All contacts in this list will be deleted
  • All segments in this list will be deleted
  • This action cannot be undone

Type the list ID (123) to confirm: 123

✓ List 123 deleted
```

**Force delete without confirmation:**

```bash
$ cakemail lists delete 123 --force
```

**Output:**
```
✓ List 123 deleted
```

**Delete in script:**

```bash
$ cakemail lists delete 123 --force --batch
```

### Notes

- Deletion is **permanent** and **irreversible**
- All contacts in the list are permanently deleted
- All segments, interests, and custom attributes are lost
- All campaign history for the list is lost
- Requires extra confirmation due to destructive nature
- Consider using [lists archive](#lists-archive) instead to preserve data

### Related Commands

- [lists archive](#lists-archive) - Archive list without deletion
- [lists list](#lists-list) - View lists before deletion
- [lists get](#lists-get) - Review list contents

---

## lists archive

Archive a list (preserves data but hides from active use).

### Usage

```bash
cakemail lists archive <id>
```

### Arguments

- `id` - List ID (required)

### Examples

**Archive a list:**

```bash
$ cakemail lists archive 123
```

**Output:**
```
✓ List 123 archived
{
  "id": 123,
  "name": "Newsletter Subscribers",
  "status": "archived",
  "archived_at": "2024-03-15T10:30:00Z"
}
```

**Verify archive status:**

```bash
$ cakemail lists get 123 -f json | jq '.status'
```

**Output:**
```
"archived"
```

### Notes

- Archived lists are hidden from default list views
- All data is preserved (contacts, segments, campaigns)
- Campaigns cannot be sent to archived lists
- No new contacts can be added to archived lists
- Archived lists still count towards account limits
- Archiving is reversible (contact support to unarchive)
- Preferred over [lists delete](#lists-delete) for data preservation

### Related Commands

- [lists delete](#lists-delete) - Permanently delete list
- [lists list](#lists-list) - View active lists
- [lists get](#lists-get) - Check list status

---

## lists accept-policy

Accept the required policy for a list.

### Usage

```bash
cakemail lists accept-policy <id>
```

### Arguments

- `id` - List ID (required)

### Examples

**Accept policy for list:**

```bash
$ cakemail lists accept-policy 123
```

**Output:**
```
✓ Policy accepted for list 123
{
  "id": 123,
  "name": "Newsletter Subscribers",
  "policy_accepted": true,
  "policy_accepted_at": "2024-03-15T10:30:00Z"
}
```

**Verify policy status:**

```bash
$ cakemail lists get 123 -f json | jq '.policy_accepted'
```

**Output:**
```
true
```

### Notes

- Required before sending campaigns to certain lists
- Policy acceptance is tracked per list
- Timestamp is recorded for compliance
- Cannot be undone once accepted
- Required for GDPR/anti-spam compliance

### Related Commands

- [lists get](#lists-get) - Check policy status
- [campaigns send](/en/cli/command-reference/campaigns#campaigns-send) - Send to list

---

## lists forms

List all subscription form endpoints for a list.

### Usage

```bash
cakemail lists forms <id>
```

### Arguments

- `id` - List ID (required)

### Examples

**List subscription forms:**

```bash
$ cakemail lists forms 123
```

**Output:**
```
{
  "data": [
    {
      "id": "form_abc123",
      "name": "Website Signup",
      "domain": "example.com",
      "endpoint_url": "https://api.cakemail.com/v1/subscribe/form_abc123",
      "double_opt_in": true,
      "created_at": "2024-01-15T10:30:00Z"
    },
    {
      "id": "form_def456",
      "name": "Landing Page",
      "domain": "landing.example.com",
      "endpoint_url": "https://api.cakemail.com/v1/subscribe/form_def456",
      "double_opt_in": false,
      "created_at": "2024-02-01T14:20:00Z"
    }
  ],
  "count": 2
}
```

**Extract form URLs:**

```bash
$ cakemail lists forms 123 -f json | jq -r '.data[] | "\(.name): \(.endpoint_url)"'
```

**Output:**
```
Website Signup: https://api.cakemail.com/v1/subscribe/form_abc123
Landing Page: https://api.cakemail.com/v1/subscribe/form_def456
```

### Notes

- Each form has a unique endpoint URL
- Forms can be configured for double opt-in
- Domain restriction helps prevent form abuse
- Multiple forms can exist per list

### Related Commands

- [lists form-create](#lists-form-create) - Create subscription form
- [lists form-delete](#lists-form-delete) - Delete subscription form

---

## lists form-create

Create a subscription form endpoint for a list.

### Usage

```bash
cakemail lists form-create <id> [options]
```

### Arguments

- `id` - List ID (required)

### Options

- `-d, --domain <domain>` - Domain name hosting the form
- `-n, --name <name>` - Name of the form
- `--double-opt-in` - Enable double opt-in requirement

### Examples

**Create basic subscription form:**

```bash
$ cakemail lists form-create 123 -n "Website Signup" -d "example.com"
```

**Output:**
```
✓ Subscription form created
{
  "id": "form_abc123",
  "name": "Website Signup",
  "domain": "example.com",
  "endpoint_url": "https://api.cakemail.com/v1/subscribe/form_abc123",
  "double_opt_in": false
}
```

**Create form with double opt-in:**

```bash
$ cakemail lists form-create 123 \
  -n "Landing Page" \
  -d "landing.example.com" \
  --double-opt-in
```

**Output:**
```
✓ Subscription form created
{
  "id": "form_def456",
  "name": "Landing Page",
  "domain": "landing.example.com",
  "endpoint_url": "https://api.cakemail.com/v1/subscribe/form_def456",
  "double_opt_in": true
}
```

**Create form without domain restriction:**

```bash
$ cakemail lists form-create 123 -n "Public Form"
```

### Notes

- Endpoint URL is automatically generated
- Domain restriction helps prevent unauthorized submissions
- Double opt-in requires email confirmation before subscribing
- Form endpoint accepts POST requests with contact data
- Use the endpoint URL in your website's form action

### Related Commands

- [lists forms](#lists-forms) - View all form endpoints
- [lists form-delete](#lists-form-delete) - Delete form endpoint

---

## lists form-delete

Delete a subscription form endpoint.

### Usage

```bash
cakemail lists form-delete <list-id> <form-id> [options]
```

### Arguments

- `list-id` - List ID (required)
- `form-id` - Form ID (required)

### Options

- `-f, --force` - Skip confirmation prompt

### Examples

**Delete form with confirmation:**

```bash
$ cakemail lists form-delete 123 form_abc123
```

**Output:**
```
⚠ Delete subscription form form_abc123?

The following will happen:
  • Subscription form endpoint will be deleted
  • Any websites using this form will stop working

Type 'yes' to confirm: yes

✓ Subscription form form_abc123 deleted
```

**Force delete:**

```bash
$ cakemail lists form-delete 123 form_abc123 --force
```

**Output:**
```
✓ Subscription form form_abc123 deleted
```

### Notes

- Deletion is immediate
- Forms using this endpoint will stop working
- Existing contacts remain in the list
- Consider updating websites before deletion
- No undo available

### Related Commands

- [lists forms](#lists-forms) - View form endpoints before deletion
- [lists form-create](#lists-form-create) - Create new form

---

## Common Workflows

### Workflow 1: Create List and Add Subscription Form

```bash
# Create list
$ cakemail lists create -n "Newsletter" -l en

# Note the list ID from output (e.g., 123)

# Create subscription form
$ cakemail lists form-create 123 \
  -n "Website Signup" \
  -d "example.com" \
  --double-opt-in

# Get form endpoint URL
$ cakemail lists forms 123
```

### Workflow 2: Archive Old Lists

```bash
# List all lists
$ cakemail lists list

# Archive inactive lists (preserves data)
$ cakemail lists archive 124
$ cakemail lists archive 125

# Verify archives
$ cakemail lists get 124 -f json | jq '.status'
```

### Workflow 3: List Migration

```bash
# Get source list details
$ cakemail lists get 123 > old-list.json

# Create new list with same settings
$ cakemail lists create -n "New Newsletter" -l en

# Export contacts from old list
$ cakemail contacts export 123

# Import to new list (manual process or use API)
# Archive old list
$ cakemail lists archive 123
```

### Workflow 4: Multi-Form Setup

```bash
# Create list
$ cakemail lists create -n "Multi-Channel List"

# Create forms for different sources
$ cakemail lists form-create 123 -n "Website" -d "example.com"
$ cakemail lists form-create 123 -n "Landing Page" -d "lp.example.com"
$ cakemail lists form-create 123 -n "Mobile App" -d "app.example.com"

# List all forms
$ cakemail lists forms 123
```

## Best Practices

1. **Use Archive Instead of Delete**: Preserve historical data by archiving lists rather than deleting
2. **Double Opt-In**: Enable for subscription forms to ensure list quality
3. **Domain Restrictions**: Set domains on subscription forms to prevent abuse
4. **Language Settings**: Set appropriate language for localized content
5. **Naming Convention**: Use clear, descriptive list names
6. **Accept Policies**: Accept list policies before sending campaigns
7. **Regular Audits**: Periodically review and archive unused lists
8. **Form Management**: Create separate forms for different acquisition channels

## Troubleshooting

### Error: "List ID not found"

The specified list doesn't exist or was deleted.

**Solution:**
```bash
# List all lists to verify ID
$ cakemail lists list

# Use correct list ID
$ cakemail lists get 123
```

### Error: "List cannot be deleted"

List may have active campaigns or dependencies.

**Solution:**
```bash
# Archive instead of deleting
$ cakemail lists archive 123

# Or check for active campaigns
$ cakemail campaigns list --filter "list_id==123;status==active"
```

### Error: "Policy not accepted"

Some operations require policy acceptance.

**Solution:**
```bash
# Accept policy for list
$ cakemail lists accept-policy 123

# Verify acceptance
$ cakemail lists get 123 -f json | jq '.policy_accepted'
```

### Subscription Form Not Working

Form endpoint may be misconfigured.

**Solution:**
```bash
# Check form configuration
$ cakemail lists forms 123

# Verify endpoint URL is correct
# Check domain matches your website
# Ensure form POST matches API format
```

### Cannot Create List

May have reached account limit.

**Solution:**
```bash
# Check total list count
$ cakemail lists list -f json | jq '.count'

# Archive unused lists
$ cakemail lists archive <old-list-id>

# Contact support for limit increase
```

### Language Not Applied

Language must be valid ISO code.

**Solution:**
```bash
# Use standard language codes
$ cakemail lists create -n "Newsletter" -l en  # English
$ cakemail lists create -n "Newsletter" -l fr  # French
$ cakemail lists create -n "Newsletter" -l es  # Spanish

# Check supported languages in account settings
```

---

**Related Documentation:**
- [Contacts Commands](/en/cli/command-reference/contacts/) - Manage list contacts
- [Segments Commands](/en/cli/command-reference/segments/) - Create dynamic list segments
- [Interests Commands](/en/cli/command-reference/interests/) - Manage list-specific interests
- [Campaigns Commands](/en/cli/command-reference/campaigns/) - Send campaigns to lists
