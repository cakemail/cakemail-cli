# Contact Commands

Manage individual contacts within lists, including CRUD operations, tagging, interests, and bulk exports.

## Overview

Contact commands allow you to:
- List and search contacts with advanced filtering
- Add, update, and delete individual contacts
- Manage contact subscriptions and status
- Apply tags and interests to contacts (individually or in bulk)
- Export contacts with status filtering
- Manage contact custom attributes

All contact operations support **smart defaults** - list IDs are auto-detected when you have only one list, making commands simpler to use.

## Commands

- [contacts list](#contacts-list) - List contacts in a list
- [contacts get](#contacts-get) - Get contact details
- [contacts add](#contacts-add) - Add a contact to a list
- [contacts update](#contacts-update) - Update contact information
- [contacts delete](#contacts-delete) - Delete a contact from a list
- [contacts unsubscribe](#contacts-unsubscribe) - Unsubscribe a contact
- [contacts export](#contacts-export) - Create and download contacts export
- [contacts exports](#contacts-exports) - List contact exports
- [contacts export-get](#contacts-export-get) - Get export status
- [contacts export-download](#contacts-export-download) - Download export file
- [contacts export-delete](#contacts-export-delete) - Delete an export
- [contacts tag](#contacts-tag) - Tag a single contact
- [contacts untag](#contacts-untag) - Remove tags from a contact
- [contacts tag-bulk](#contacts-tag-bulk) - Tag multiple contacts
- [contacts untag-bulk](#contacts-untag-bulk) - Remove tags from multiple contacts
- [contacts add-interests](#contacts-add-interests) - Add interests to contacts
- [contacts remove-interests](#contacts-remove-interests) - Remove interests from contacts

---

## contacts list

List contacts in a list with optional filtering, sorting, and pagination.

### Usage

```bash
cakemail contacts list [list-id] [options]
```

### Arguments

- `list-id` - List ID (optional - auto-detected if only one list exists)

### Options

- `-l, --limit <number>` - Limit number of results per page
- `-p, --page <number>` - Page number (default: 1)
- `-q, --query <query>` - Search query (searches across email, name fields)
- `--sort <sort>` - Sort order (e.g., `+email`, `-subscribed_on`, `+status`)
- `--filter <filter>` - Filter expression (e.g., `status==active;email==user@example.com`)

### Examples

**List all contacts with auto-detection:**

```bash
$ cakemail contacts list
```

**Output:**
```
✓ Auto-detected list: 123 (Newsletter Subscribers)
┌────────┬──────────────────────┬────────────┬────────────┬──────────────┐
│ ID     │ Email                │ First Name │ Last Name  │ Status       │
├────────┼──────────────────────┼────────────┼────────────┼──────────────┤
│ 501    │ john@example.com     │ John       │ Doe        │ subscribed   │
│ 502    │ jane@example.com     │ Jane       │ Smith      │ subscribed   │
│ 503    │ bob@example.com      │ Bob        │ Johnson    │ unsubscribed │
└────────┴──────────────────────┴────────────┴────────────┴──────────────┘
```

**List contacts for specific list:**

```bash
$ cakemail contacts list 123
```

**Filter by status:**

```bash
$ cakemail contacts list 123 --filter "status==subscribed"
```

**Output:**
```
┌────────┬──────────────────────┬────────────┬────────────┬──────────────┐
│ ID     │ Email                │ First Name │ Last Name  │ Status       │
├────────┼──────────────────────┼────────────┼────────────┼──────────────┤
│ 501    │ john@example.com     │ John       │ Doe        │ subscribed   │
│ 502    │ jane@example.com     │ Jane       │ Smith      │ subscribed   │
└────────┴──────────────────────┴────────────┴────────────┴──────────────┘
```

**Search with query:**

```bash
$ cakemail contacts list 123 -q "john"
```

**Sort by most recently subscribed:**

```bash
$ cakemail contacts list 123 --sort "-subscribed_on" -l 10
```

**Combine multiple filters:**

```bash
$ cakemail contacts list 123 --filter "status==subscribed;email==*@gmail.com" -q "smith"
```

### Notes

- Auto-detection works when you have exactly one list in your account
- The `--filter` option uses semicolon-separated key==value pairs
- Sort accepts `+` (ascending) or `-` (descending) prefix
- Use `--limit` for pagination control
- Search query (`-q`) performs full-text search across contact fields

### Related Commands

- [contacts get](#contacts-get) - Get detailed contact information
- [contacts add](#contacts-add) - Add new contacts
- [lists list](/en/cli/command-reference/lists#lists-list) - View all your lists

---

## contacts get

Get detailed information about a specific contact.

### Usage

```bash
cakemail contacts get <list-id> <contact-id>
```

### Arguments

- `list-id` - List ID (required)
- `contact-id` - Contact ID (required)

### Examples

**Get contact details:**

```bash
$ cakemail contacts get 123 501
```

**Output:**
```
{
  "id": 501,
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "status": "subscribed",
  "subscribed_on": "2024-03-15T10:30:00Z",
  "custom_attributes": {
    "company": "Acme Corp",
    "plan": "premium"
  },
  "tags": ["vip", "customer"],
  "interests": ["product-updates", "promotions"],
  "list_id": 123
}
```

**Get contact in JSON format for piping:**

```bash
$ cakemail contacts get 123 501 -f json | jq '.email'
```

**Output:**
```
"john@example.com"
```

### Notes

- Returns complete contact information including custom attributes
- Shows all tags and interests associated with the contact
- Use `-f json` for structured output suitable for automation

### Related Commands

- [contacts list](#contacts-list) - Find contact IDs
- [contacts update](#contacts-update) - Modify contact details

---

## contacts add

Add a new contact to a list.

### Usage

```bash
cakemail contacts add [list-id] [options]
```

### Arguments

- `list-id` - List ID (optional - auto-detected if only one list exists)

### Options

- `-e, --email <email>` - Contact email (required)
- `-f, --first-name <name>` - First name
- `-l, --last-name <name>` - Last name
- `-d, --data <json>` - Custom attributes as JSON

### Examples

**Add contact with auto-detection:**

```bash
$ cakemail contacts add -e john@example.com -f John -l Doe
```

**Output:**
```
✓ Auto-detected list: 123 (Newsletter Subscribers)
✓ Contact added: 501
{
  "id": 501,
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "status": "subscribed"
}
```

**Add contact to specific list:**

```bash
$ cakemail contacts add 123 -e jane@example.com -f Jane -l Smith
```

**Add contact with custom attributes:**

```bash
$ cakemail contacts add 123 \
  -e bob@example.com \
  -f Bob \
  -l Johnson \
  -d '{"company":"Tech Inc","role":"Developer"}'
```

**Output:**
```
✓ Contact added: 502
{
  "id": 502,
  "email": "bob@example.com",
  "first_name": "Bob",
  "last_name": "Johnson",
  "custom_attributes": {
    "company": "Tech Inc",
    "role": "Developer"
  }
}
```

**Add contact with just email (minimal):**

```bash
$ cakemail contacts add -e minimal@example.com
```

### Notes

- Email validation is performed before creating the contact
- Duplicate emails in the same list are rejected
- Custom attributes must be valid JSON format
- Auto-detection works when you have exactly one list
- Contact status defaults to "subscribed"

### Related Commands

- [contacts update](#contacts-update) - Modify contact after creation
- [contacts tag](#contacts-tag) - Add tags to contact
- [contacts add-interests](#contacts-add-interests) - Add interests

---

## contacts update

Update an existing contact's information.

### Usage

```bash
cakemail contacts update <list-id> <contact-id> [options]
```

### Arguments

- `list-id` - List ID (required)
- `contact-id` - Contact ID (required)

### Options

- `-e, --email <email>` - New email address
- `-f, --first-name <name>` - New first name
- `-l, --last-name <name>` - New last name
- `-d, --data <json>` - Custom attributes as JSON (merges with existing)

### Examples

**Update contact name:**

```bash
$ cakemail contacts update 123 501 -f Jonathan
```

**Output:**
```
✓ Contact 501 updated
{
  "id": 501,
  "email": "john@example.com",
  "first_name": "Jonathan",
  "last_name": "Doe"
}
```

**Update email address:**

```bash
$ cakemail contacts update 123 501 -e newemail@example.com
```

**Update custom attributes:**

```bash
$ cakemail contacts update 123 501 -d '{"company":"New Corp","plan":"enterprise"}'
```

**Output:**
```
✓ Contact 501 updated
{
  "id": 501,
  "email": "john@example.com",
  "custom_attributes": {
    "company": "New Corp",
    "plan": "enterprise"
  }
}
```

**Update multiple fields:**

```bash
$ cakemail contacts update 123 501 \
  -f John \
  -l Doe-Smith \
  -d '{"updated":"2024-03-15"}'
```

### Notes

- Only provided fields are updated (partial updates)
- Email validation is performed if email is changed
- Custom attributes are merged with existing attributes
- Changing email to an existing email in the list will fail

### Related Commands

- [contacts get](#contacts-get) - View current contact details
- [contacts add](#contacts-add) - Add new contacts

---

## contacts delete

Permanently delete a contact from a list.

### Usage

```bash
cakemail contacts delete <list-id> <contact-id> [options]
```

### Arguments

- `list-id` - List ID (required)
- `contact-id` - Contact ID (required)

### Options

- `-f, --force` - Skip confirmation prompt (use in scripts)

### Examples

**Delete contact with confirmation:**

```bash
$ cakemail contacts delete 123 501
```

**Output:**
```
⚠ Delete contact 501?

The following will happen:
  • Contact will be permanently deleted from this list
  • Contact history and data will be lost

Type 'yes' to confirm: yes

✓ Contact 501 deleted
```

**Force delete without confirmation:**

```bash
$ cakemail contacts delete 123 501 --force
```

**Output:**
```
✓ Contact 501 deleted
```

**Delete in script (batch mode):**

```bash
$ cakemail contacts delete 123 501 --force --batch
```

### Notes

- Deletion is **permanent** and cannot be undone
- All contact history and custom attributes are lost
- Interactive confirmation is shown unless `--force` is used
- Consider using [contacts unsubscribe](#contacts-unsubscribe) instead to preserve history
- Contact is removed from this list only (if contact exists in other lists, those remain)

### Related Commands

- [contacts unsubscribe](#contacts-unsubscribe) - Unsubscribe without deleting
- [contacts list](#contacts-list) - View contacts before deletion

---

## contacts unsubscribe

Unsubscribe a contact from a list (preserves contact data).

### Usage

```bash
cakemail contacts unsubscribe <list-id> <contact-id>
```

### Arguments

- `list-id` - List ID (required)
- `contact-id` - Contact ID (required)

### Examples

**Unsubscribe a contact:**

```bash
$ cakemail contacts unsubscribe 123 501
```

**Output:**
```
✓ Contact 501 unsubscribed
```

**Verify unsubscribe status:**

```bash
$ cakemail contacts get 123 501 -f json | jq '.status'
```

**Output:**
```
"unsubscribed"
```

### Notes

- Changes contact status to "unsubscribed"
- Preserves all contact data and history
- Contact will not receive future campaigns sent to this list
- Preferred over [contacts delete](#contacts-delete) for compliance reasons
- Contact can be re-subscribed later if needed

### Related Commands

- [contacts delete](#contacts-delete) - Permanently remove contact
- [contacts get](#contacts-get) - Check subscription status

---

## contacts export

Create and download a contacts export from a list.

### Usage

```bash
cakemail contacts export [list-id] [options]
```

### Arguments

- `list-id` - List ID (optional - auto-detected if only one list exists)

### Options

- `--status <status>` - Filter by status (subscribed, unsubscribed, etc.)
- `--no-wait` - Create export job without waiting for completion

### Examples

**Export all contacts with auto-detection:**

```bash
$ cakemail contacts export
```

**Output:**
```
✓ Auto-detected list: 123 (Newsletter Subscribers)
✓ Export job created
⠋ Waiting for export to complete...
✓ Export ready
✓ Export completed. Download with: cakemail contacts export-download 123 export_abc123
{
  "id": "export_abc123",
  "status": "ready",
  "created_at": "2024-03-15T10:30:00Z",
  "download_url": "https://..."
}
```

**Export only subscribed contacts:**

```bash
$ cakemail contacts export 123 --status subscribed
```

**Output:**
```
✓ Export job created
⠋ Waiting for export to complete...
✓ Export ready
✓ Export completed. Download with: cakemail contacts export-download 123 export_def456
```

**Create export without waiting (background job):**

```bash
$ cakemail contacts export 123 --no-wait
```

**Output:**
```
✓ Export job created
ℹ Export ID: export_ghi789
ℹ Check status with: cakemail contacts export-get 123 export_ghi789
```

**Export with specific list ID:**

```bash
$ cakemail contacts export 123
```

### Notes

- Default behavior waits for export to complete (polls every 2 seconds)
- Use `--no-wait` for large lists to avoid timeout
- Export includes all contact fields and custom attributes
- Download URL expires after 24 hours
- Status filter options: `subscribed`, `unsubscribed`, `bounced`, `complained`

### Related Commands

- [contacts export-download](#contacts-export-download) - Download completed export
- [contacts exports](#contacts-exports) - List all exports
- [contacts export-get](#contacts-export-get) - Check export status

---

## contacts exports

List all contact exports for a list.

### Usage

```bash
cakemail contacts exports [list-id] [options]
```

### Arguments

- `list-id` - List ID (optional - auto-detected if only one list exists)

### Options

- `-l, --limit <number>` - Limit number of results
- `-p, --page <number>` - Page number

### Examples

**List all exports:**

```bash
$ cakemail contacts exports 123
```

**Output:**
```
┌──────────────┬──────────┬─────────────────────┬────────────────┐
│ ID           │ Status   │ Created             │ Records        │
├──────────────┼──────────┼─────────────────────┼────────────────┤
│ export_abc123│ ready    │ 2024-03-15 10:30:00 │ 1,234          │
│ export_def456│ ready    │ 2024-03-14 14:20:00 │ 1,189          │
│ export_ghi789│ processing│ 2024-03-15 10:35:00│ -              │
└──────────────┴──────────┴─────────────────────┴────────────────┘
```

**List recent exports (paginated):**

```bash
$ cakemail contacts exports 123 -l 5 -p 1
```

### Notes

- Shows all exports regardless of status (ready, processing, failed)
- Exports expire after 30 days
- Use [contacts export-download](#contacts-export-download) to download ready exports

### Related Commands

- [contacts export](#contacts-export) - Create new export
- [contacts export-get](#contacts-export-get) - Get export details

---

## contacts export-get

Get the status and details of a specific export.

### Usage

```bash
cakemail contacts export-get <list-id> <export-id>
```

### Arguments

- `list-id` - List ID (required)
- `export-id` - Export ID (required)

### Examples

**Check export status:**

```bash
$ cakemail contacts export-get 123 export_abc123
```

**Output:**
```
{
  "id": "export_abc123",
  "status": "ready",
  "created_at": "2024-03-15T10:30:00Z",
  "completed_at": "2024-03-15T10:31:30Z",
  "total_records": 1234,
  "download_url": "https://api.cakemail.com/exports/...",
  "expires_at": "2024-04-14T10:31:30Z"
}
```

**Monitor processing export:**

```bash
$ cakemail contacts export-get 123 export_ghi789
```

**Output:**
```
{
  "id": "export_ghi789",
  "status": "processing",
  "created_at": "2024-03-15T10:35:00Z",
  "progress": 45
}
```

### Notes

- Status values: `processing`, `ready`, `failed`
- `download_url` only available when status is `ready`
- Use this to poll export status when using `--no-wait`

### Related Commands

- [contacts export](#contacts-export) - Create export
- [contacts export-download](#contacts-export-download) - Download ready export

---

## contacts export-download

Download a completed contacts export file.

### Usage

```bash
cakemail contacts export-download <list-id> <export-id>
```

### Arguments

- `list-id` - List ID (required)
- `export-id` - Export ID (required)

### Examples

**Download export file:**

```bash
$ cakemail contacts export-download 123 export_abc123
```

**Output:**
```
✓ Export downloaded
{
  "filename": "contacts_export_abc123.csv",
  "size": 245678,
  "download_url": "https://..."
}
```

**Download and save to specific file:**

```bash
$ cakemail contacts export-download 123 export_abc123 -f json > contacts.json
```

### Notes

- Export must have status `ready` before download
- File format is CSV by default
- Download URL expires after 24 hours
- Large files may take time to download

### Related Commands

- [contacts export](#contacts-export) - Create export
- [contacts export-get](#contacts-export-get) - Check if ready

---

## contacts export-delete

Delete a contacts export file.

### Usage

```bash
cakemail contacts export-delete <list-id> <export-id> [options]
```

### Arguments

- `list-id` - List ID (required)
- `export-id` - Export ID (required)

### Options

- `-f, --force` - Skip confirmation prompt

### Examples

**Delete export with confirmation:**

```bash
$ cakemail contacts export-delete 123 export_abc123
```

**Output:**
```
⚠ Delete contacts export export_abc123?

The following will happen:
  • Export file will be permanently deleted

Type 'yes' to confirm: yes

✓ Export export_abc123 deleted
```

**Force delete:**

```bash
$ cakemail contacts export-delete 123 export_abc123 --force
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

- [contacts exports](#contacts-exports) - List all exports
- [contacts export](#contacts-export) - Create new export

---

## contacts tag

Add tags to a single contact.

### Usage

```bash
cakemail contacts tag <list-id> <contact-id> [options]
```

### Arguments

- `list-id` - List ID (required)
- `contact-id` - Contact ID (required)

### Options

- `-t, --tags <tags>` - Comma-separated tags (required)

### Examples

**Tag a contact:**

```bash
$ cakemail contacts tag 123 501 -t "vip,customer"
```

**Output:**
```
✓ Contact 501 tagged
```

**Add multiple tags:**

```bash
$ cakemail contacts tag 123 501 -t "premium,early-adopter,newsletter-subscriber"
```

**Verify tags were added:**

```bash
$ cakemail contacts get 123 501 -f json | jq '.tags'
```

**Output:**
```
["vip", "customer", "premium", "early-adopter", "newsletter-subscriber"]
```

### Notes

- Tags are global (shared across all lists)
- Tags must exist before applying (use [tags create](/en/cli/command-reference/tags#tags-create))
- Duplicate tags are ignored
- For bulk operations, use [contacts tag-bulk](#contacts-tag-bulk)

### Related Commands

- [contacts untag](#contacts-untag) - Remove tags
- [contacts tag-bulk](#contacts-tag-bulk) - Tag multiple contacts
- [tags list](/en/cli/command-reference/tags#tags-list) - View available tags

---

## contacts untag

Remove tags from a single contact.

### Usage

```bash
cakemail contacts untag <list-id> <contact-id> [options]
```

### Arguments

- `list-id` - List ID (required)
- `contact-id` - Contact ID (required)

### Options

- `-t, --tags <tags>` - Comma-separated tags to remove (required)

### Examples

**Remove tags from contact:**

```bash
$ cakemail contacts untag 123 501 -t "customer,trial"
```

**Output:**
```
✓ Tags removed from contact 501
```

**Remove single tag:**

```bash
$ cakemail contacts untag 123 501 -t "vip"
```

**Verify tags were removed:**

```bash
$ cakemail contacts get 123 501 -f json | jq '.tags'
```

**Output:**
```
["premium", "early-adopter"]
```

### Notes

- Only removes specified tags
- Non-existent tags are silently ignored
- For bulk operations, use [contacts untag-bulk](#contacts-untag-bulk)

### Related Commands

- [contacts tag](#contacts-tag) - Add tags
- [contacts untag-bulk](#contacts-untag-bulk) - Remove tags from multiple contacts

---

## contacts tag-bulk

Add tags to multiple contacts at once.

### Usage

```bash
cakemail contacts tag-bulk <list-id> [options]
```

### Arguments

- `list-id` - List ID (required)

### Options

- `-c, --contacts <ids>` - Comma-separated contact IDs (required)
- `-t, --tags <tags>` - Comma-separated tags (required)

### Examples

**Tag multiple contacts:**

```bash
$ cakemail contacts tag-bulk 123 -c "501,502,503" -t "webinar-attendee"
```

**Output:**
```
⠋ Tagging 3 contacts...
✓ Successfully tagged 3 contacts
```

**Tag many contacts with multiple tags:**

```bash
$ cakemail contacts tag-bulk 123 \
  -c "501,502,503,504,505,506,507,508,509,510" \
  -t "campaign-2024-q1,engaged,priority"
```

**Output:**
```
⠋ Tagging 10 contacts...
✓ Successfully tagged 10 contacts
```

### Notes

- More efficient than individual [contacts tag](#contacts-tag) calls
- Tags must exist before applying
- Progress indicator shows for large batches
- All specified tags are added to all specified contacts
- Maximum 1000 contacts per request

### Related Commands

- [contacts tag](#contacts-tag) - Tag single contact
- [contacts untag-bulk](#contacts-untag-bulk) - Remove tags from multiple contacts

---

## contacts untag-bulk

Remove tags from multiple contacts at once.

### Usage

```bash
cakemail contacts untag-bulk <list-id> [options]
```

### Arguments

- `list-id` - List ID (required)

### Options

- `-c, --contacts <ids>` - Comma-separated contact IDs (required)
- `-t, --tags <tags>` - Comma-separated tags to remove (required)

### Examples

**Remove tags from multiple contacts:**

```bash
$ cakemail contacts untag-bulk 123 -c "501,502,503" -t "trial,prospect"
```

**Output:**
```
⠋ Untagging 3 contacts...
✓ Successfully untagged 3 contacts
```

**Remove tag from many contacts:**

```bash
$ cakemail contacts untag-bulk 123 \
  -c "501,502,503,504,505" \
  -t "old-campaign"
```

**Output:**
```
⠋ Untagging 5 contacts...
✓ Successfully untagged 5 contacts
```

### Notes

- More efficient than individual [contacts untag](#contacts-untag) calls
- Non-existent tags are silently ignored
- Progress indicator shows for large batches
- Maximum 1000 contacts per request

### Related Commands

- [contacts untag](#contacts-untag) - Remove tags from single contact
- [contacts tag-bulk](#contacts-tag-bulk) - Add tags to multiple contacts

---

## contacts add-interests

Add list-specific interests to one or more contacts.

### Usage

```bash
cakemail contacts add-interests <list-id> [options]
```

### Arguments

- `list-id` - List ID (required)

### Options

- `-i, --interests <interests>` - Comma-separated interest names (required)
- `-c, --contacts <ids>` - Comma-separated contact IDs (optional)
- `-q, --query <query>` - SQL query to select contacts (optional)

Note: Either `--contacts` or `--query` must be provided.

### Examples

**Add interests to specific contacts:**

```bash
$ cakemail contacts add-interests 123 \
  -i "product-updates,promotions" \
  -c "501,502,503"
```

**Output:**
```
✓ Interests added to contacts
```

**Add interests using query:**

```bash
$ cakemail contacts add-interests 123 \
  -i "newsletter" \
  -q "status='subscribed' AND email LIKE '%@gmail.com'"
```

**Output:**
```
✓ Interests added to contacts
```

**Add single interest to one contact:**

```bash
$ cakemail contacts add-interests 123 -i "vip-access" -c "501"
```

### Notes

- Interests are list-specific (unlike tags which are global)
- Interests must exist on the list before applying
- Use `--query` for bulk operations based on conditions
- Query syntax is SQL-like (supports WHERE clause conditions)
- Maximum 1000 contacts when using `--contacts`

### Related Commands

- [contacts remove-interests](#contacts-remove-interests) - Remove interests
- [interests list](/en/cli/command-reference/interests#interests-list) - View list interests
- [interests create](/en/cli/command-reference/interests#interests-create) - Create new interest

---

## contacts remove-interests

Remove list-specific interests from one or more contacts.

### Usage

```bash
cakemail contacts remove-interests <list-id> [options]
```

### Arguments

- `list-id` - List ID (required)

### Options

- `-i, --interests <interests>` - Comma-separated interest names (required)
- `-c, --contacts <ids>` - Comma-separated contact IDs (optional)
- `-q, --query <query>` - SQL query to select contacts (optional)

Note: Either `--contacts` or `--query` must be provided.

### Examples

**Remove interests from specific contacts:**

```bash
$ cakemail contacts remove-interests 123 \
  -i "promotions" \
  -c "501,502,503"
```

**Output:**
```
✓ Interests removed from contacts
```

**Remove interests using query:**

```bash
$ cakemail contacts remove-interests 123 \
  -i "newsletter,updates" \
  -q "status='unsubscribed'"
```

**Output:**
```
✓ Interests removed from contacts
```

**Remove all promotional interests:**

```bash
$ cakemail contacts remove-interests 123 \
  -i "promotions,special-offers,deals" \
  -q "status='subscribed'"
```

### Notes

- Interests are list-specific
- Non-existent interests are silently ignored
- Query syntax supports complex SQL WHERE conditions
- Use to clean up interests during list maintenance

### Related Commands

- [contacts add-interests](#contacts-add-interests) - Add interests
- [interests list](/en/cli/command-reference/interests#interests-list) - View list interests

---

## Common Workflows

### Workflow 1: Add and Tag New Contacts

```bash
# Add contact
$ cakemail contacts add -e john@example.com -f John -l Doe

# Tag as customer
$ cakemail contacts tag 123 501 -t "customer,vip"

# Add interests
$ cakemail contacts add-interests 123 -i "product-updates" -c "501"
```

### Workflow 2: Export Subscribed Contacts

```bash
# Create filtered export
$ cakemail contacts export 123 --status subscribed

# Wait for completion (automatic with default behavior)
# Download is shown in output

# Or check status manually
$ cakemail contacts export-get 123 export_abc123

# Download when ready
$ cakemail contacts export-download 123 export_abc123
```

### Workflow 3: Bulk Tag Management

```bash
# List contacts to get IDs
$ cakemail contacts list 123 --filter "status==subscribed" -f json | \
  jq -r '.data[].id' | paste -sd "," -

# Tag all at once
$ cakemail contacts tag-bulk 123 -c "501,502,503,504,505" -t "campaign-2024"

# Verify tags
$ cakemail contacts get 123 501 -f json | jq '.tags'
```

### Workflow 4: Interest-Based Segmentation

```bash
# Add interests to engaged contacts
$ cakemail contacts add-interests 123 \
  -i "premium-content" \
  -q "last_open_date > '2024-01-01'"

# Remove interests from inactive contacts
$ cakemail contacts remove-interests 123 \
  -i "newsletter" \
  -q "last_open_date < '2023-01-01'"
```

## Best Practices

1. **Use Auto-Detection**: When working with a single list, omit list-id for cleaner commands
2. **Preserve History**: Prefer [contacts unsubscribe](#contacts-unsubscribe) over [contacts delete](#contacts-delete)
3. **Bulk Operations**: Use bulk commands for multiple contacts to improve performance
4. **Export Regularly**: Create periodic exports for backup and analysis
5. **Query Syntax**: Use SQL-like queries for powerful filtering with interests operations
6. **Tag Organization**: Use tags for global characteristics, interests for list-specific preferences
7. **Custom Attributes**: Store additional data as JSON for flexible contact profiles
8. **Validation**: Always validate email addresses before bulk imports

## Troubleshooting

### Error: "List ID not found"

Auto-detection failed. Possible causes:
- You have no lists in your account
- You have multiple lists (must specify list-id)
- Invalid list-id provided

**Solution:**
```bash
# List your lists first
$ cakemail lists list

# Use specific list-id
$ cakemail contacts list 123
```

### Error: "Email address is invalid"

The provided email fails validation.

**Solution:**
```bash
# Ensure proper email format
$ cakemail contacts add -e "user@example.com" -f John
```

### Error: "Contact already exists"

Email already exists in the list.

**Solution:**
```bash
# Use update instead of add
$ cakemail contacts update 123 501 -f "New Name"

# Or list to find existing contact
$ cakemail contacts list 123 -q "user@example.com"
```

### Error: "Either --contacts or --query is required"

Both interest operations require a target selector.

**Solution:**
```bash
# Provide contact IDs
$ cakemail contacts add-interests 123 -i "newsletter" -c "501,502"

# Or use query
$ cakemail contacts add-interests 123 -i "newsletter" -q "status='subscribed'"
```

### Export Takes Too Long

Large exports may timeout.

**Solution:**
```bash
# Use --no-wait for large exports
$ cakemail contacts export 123 --no-wait

# Check status separately
$ cakemail contacts export-get 123 export_abc123

# Download when ready
$ cakemail contacts export-download 123 export_abc123
```

### Tags Not Found

Tags must be created before applying.

**Solution:**
```bash
# Create tag first
$ cakemail tags create -n "customer"

# Then apply to contacts
$ cakemail contacts tag 123 501 -t "customer"
```

### Interests Not Found

Interests must exist on the list.

**Solution:**
```bash
# Create interest on list first
$ cakemail interests create 123 -n "product-updates"

# Then add to contacts
$ cakemail contacts add-interests 123 -i "product-updates" -c "501"
```

---

**Related Documentation:**
- [Lists Commands](/en/cli/command-reference/lists/) - Manage contact lists
- [Tags Commands](/en/cli/command-reference/tags/) - Global contact tags
- [Interests Commands](/en/cli/command-reference/interests/) - List-specific interests
- [Segments Commands](/en/cli/command-reference/segments/) - Dynamic contact filtering
- [Attributes Commands](/en/cli/command-reference/attributes/) - Custom contact fields
