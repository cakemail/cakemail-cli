# Interests Commands

Manage list-specific contact interests.

## Overview

Interests are list-specific preferences that contacts can subscribe to. Unlike tags which are global, interests are specific to each list and are commonly used for newsletter preferences, topic subscriptions, and opt-in categories.

**Available Commands:**
- [`interests list`](#interests-list) - List all interests in a list
- [`interests get`](#interests-get) - Get interest details
- [`interests create`](#interests-create) - Create a new interest
- [`interests update`](#interests-update) - Update interest name or alias
- [`interests delete`](#interests-delete) - Delete an interest

**Contact-Level Operations:**
See [Contacts Commands](/en/cli/command-reference/contacts/) for:
- `contacts add-interests` - Add interests to contacts (bulk supported)
- `contacts remove-interests` - Remove interests from contacts (bulk supported)

**Key Features:**
- List-specific (not global like tags)
- Support auto-detection when only one list exists
- Optional URL-friendly aliases
- Used for subscription preferences
- Profile-aware delete confirmations

**Use Cases:**
- Newsletter topic preferences ("Product Updates", "Weekly Digest")
- Content categories ("Tech News", "Marketing Tips", "Sales Updates")
- Event notifications ("Webinars", "Product Launches")
- Frequency preferences ("Daily", "Weekly", "Monthly")

---

## interests list

List all interests for a specific list.

### Usage

```bash
cakemail interests list [list-id] [options]
```

### Arguments

- `[list-id]` - List ID (optional - auto-detects if only one list exists)

### Options

- `-p, --page <number>` - Page number for pagination
- `--per-page <number>` - Results per page
- `--sort <sort>` - Sort order (e.g., `+name`, `-created_on`)

### Examples

**List interests (auto-detect list):**
```bash
$ cakemail interests list
```

**Output:**
```
✓ Auto-detected list: 123 (Newsletter Subscribers)

┌────┬──────────────────┬──────────────┬─────────────────────┐
│ ID │ Name             │ Alias        │ Created At          │
├────┼──────────────────┼──────────────┼─────────────────────┤
│ 1  │ Product Updates  │ updates      │ 2025-09-15 10:23:11 │
│ 2  │ Weekly Digest    │ digest       │ 2025-09-20 14:05:42 │
│ 3  │ Event Invites    │ events       │ 2025-10-01 08:15:33 │
└────┴──────────────────┴──────────────┴─────────────────────┘
```

**List interests for specific list:**
```bash
$ cakemail interests list 123
```

**Sorted by name:**
```bash
$ cakemail interests list --sort +name
```

**JSON output (Developer profile):**
```bash
$ cakemail --profile developer interests list 123
```

**Output:**
```json
{
  "data": [
    {"id": 1, "name": "Product Updates", "alias": "updates", "created_on": "2025-09-15T10:23:11Z"},
    {"id": 2, "name": "Weekly Digest", "alias": "digest", "created_on": "2025-09-20T14:05:42Z"}
  ]
}
```

### Notes

- List ID is optional if you have only one list
- Interests are list-specific (different lists have different interests)
- Use aliases for URL-friendly subscription preferences

---

## interests get

Get details for a specific interest.

### Usage

```bash
cakemail interests get [list-id] <interest-name>
```

### Arguments

- `[list-id]` - List ID (optional - auto-detects if only one list exists)
- `<interest-name>` - Interest name or alias (required)

### Examples

**Get interest by name (auto-detect list):**
```bash
$ cakemail interests get "Product Updates"
```

**Output:**
```
Interest: Product Updates

Details:
  ID: 1
  Name: Product Updates
  Alias: updates
  List: Newsletter Subscribers (123)
  Created: 2025-09-15 10:23:11
  Subscribers: 342
```

**Get interest with specific list:**
```bash
$ cakemail interests get 123 "Weekly Digest"
```

**Get by alias:**
```bash
$ cakemail interests get 123 digest
```

**JSON output:**
```bash
$ cakemail -f json interests get updates
```

**Output:**
```json
{
  "id": 1,
  "name": "Product Updates",
  "alias": "updates",
  "list_id": 123,
  "created_on": "2025-09-15T10:23:11Z",
  "subscribers_count": 342
}
```

---

## interests create

Create a new interest for a list.

### Usage

```bash
cakemail interests create [list-id] --name <name> [options]
```

### Arguments

- `[list-id]` - List ID (optional - auto-detects if only one list exists)

### Options

- `-n, --name <name>` - Interest name (required)
- `-a, --alias <alias>` - URL-friendly alias (optional)

### Examples

**Create interest (auto-detect list):**
```bash
$ cakemail interests create --name "Product Updates"
```

**Output:**
```
✓ Auto-detected list: 123 (Newsletter Subscribers)
✓ Interest created successfully

Interest: Product Updates
  ID: 4
  List: Newsletter Subscribers (123)
  Created: just now
```

**Create with alias:**
```bash
$ cakemail interests create --name "Product Updates" --alias "updates"
```

**Output:**
```
✓ Interest created successfully

Interest: Product Updates
  Alias: updates (use in URLs: ?interests=updates)
  ID: 4
```

**Create for specific list:**
```bash
$ cakemail interests create 456 --name "Event Invites" --alias "events"
```

**Developer profile (JSON):**
```bash
$ cakemail --profile developer interests create --name "Weekly Tips" --alias "tips"
```

**Output:**
```json
{
  "id": 5,
  "name": "Weekly Tips",
  "alias": "tips",
  "list_id": 123,
  "created_on": "2025-10-11T15:30:00Z"
}
```

### Interest Naming

**Name:**
- Human-readable description
- Can contain spaces and special characters
- Examples: "Product Updates", "Weekly Digest", "News & Events"

**Alias (optional):**
- URL-friendly identifier
- No spaces, lowercase recommended
- Used in subscription URLs and forms
- Examples: `updates`, `digest`, `news-events`

### Use Cases

**Newsletter preferences:**
```bash
cakemail interests create --name "Daily Newsletter" --alias "daily"
cakemail interests create --name "Weekly Digest" --alias "weekly"
cakemail interests create --name "Monthly Roundup" --alias "monthly"
```

**Topic subscriptions:**
```bash
cakemail interests create --name "Product Updates" --alias "products"
cakemail interests create --name "Company News" --alias "news"
cakemail interests create --name "Industry Insights" --alias "insights"
```

---

## interests update

Update an interest's name or alias.

### Usage

```bash
cakemail interests update [list-id] <interest-name> [options]
```

### Arguments

- `[list-id]` - List ID (optional - auto-detects if only one list exists)
- `<interest-name>` - Current interest name or alias (required)

### Options

- `-n, --name <name>` - New interest name (optional)
- `-a, --alias <alias>` - New alias (optional)

### Examples

**Update name (auto-detect list):**
```bash
$ cakemail interests update "Product Updates" --name "Product Announcements"
```

**Output:**
```
✓ Interest updated successfully

Interest:
  Old name: Product Updates
  New name: Product Announcements
  Alias: updates (unchanged)
  Subscribers: 342 (unchanged)
```

**Update alias:**
```bash
$ cakemail interests update "Product Announcements" --alias "announcements"
```

**Update both:**
```bash
$ cakemail interests update 123 updates --name "Product News" --alias "product-news"
```

### Notes

- Interest ID remains unchanged
- Subscribers keep their preferences (only metadata changes)
- Update by current name or alias
- Existing subscription forms continue to work with new alias

---

## interests delete

Delete an interest from a list.

### Usage

```bash
cakemail interests delete [list-id] <interest-name> [options]
```

### Arguments

- `[list-id]` - List ID (optional - auto-detects if only one list exists)
- `<interest-name>` - Interest name or alias (required)

### Options

- `-f, --force` - Skip confirmation prompt

### Examples

**Delete with confirmation (Balanced/Marketer profile):**
```bash
$ cakemail interests delete "Old Interest"
```

**Output:**
```
✓ Auto-detected list: 123 (Newsletter Subscribers)

⚠ Delete interest 'Old Interest'?
  Interest will be removed from the list
  342 contacts currently subscribed
  This action cannot be undone

Delete interest? (y/N): y

✓ Interest 'Old Interest' deleted successfully
✓ Removed from 342 contacts
```

**Force delete (skip confirmation):**
```bash
$ cakemail interests delete "Old Interest" --force
```

**Delete from specific list:**
```bash
$ cakemail interests delete 123 "Old Interest" --force
```

**Developer profile (no confirmation):**
```bash
$ cakemail --profile developer interests delete updates
```

**Output:**
```json
{"success":true,"interest":"updates","contacts_affected":342}
```

### Confirmation Behavior

Same as tags - profile-aware confirmations:
- **Marketer**: Always confirms
- **Balanced**: Confirms in interactive mode, skips in scripts
- **Developer**: Never confirms

### Important Notes

**⚠️ Warning: This action is destructive**

When you delete an interest:
- Interest is permanently removed from the list
- Removed from all contacts who subscribed
- Subscription forms using this interest stop working
- Segments filtering by this interest may break
- Cannot be undone

---

## Common Workflows

### Workflow 1: Setup Newsletter Preferences

```bash
# Create frequency preferences
cakemail interests create --name "Daily Updates" --alias "daily"
cakemail interests create --name "Weekly Digest" --alias "weekly"
cakemail interests create --name "Monthly Newsletter" --alias "monthly"

# Verify
cakemail interests list --sort +name
```

---

### Workflow 2: Migrate Interest Names

```bash
# Check current interest
cakemail interests get "Old Name"

# Update to new naming convention
cakemail interests update "Old Name" --name "New Name" --alias "new-alias"

# Verify
cakemail interests get "New Name"
```

---

### Workflow 3: Bulk Interest Management

```bash
# Create multiple topic interests
cakemail interests create --name "Product Updates" --alias "products"
cakemail interests create --name "Industry News" --alias "news"
cakemail interests create --name "Events" --alias "events"

# Apply to contacts
cakemail contacts add-interests 123 \
  --interests "products,news,events" \
  --query "status==active"
```

---

## Integration with Contact Commands

### Adding Interests to Contacts

After creating interests, apply them to contacts:

**Single contact:**
```bash
# This would be done via contact update/preferences API
# Check contacts command reference
```

**Bulk operations:**
```bash
# Add interests to specific contacts
cakemail contacts add-interests 123 \
  --interests "updates,digest" \
  --contacts "1,2,3,4,5"

# Add interests by query
cakemail contacts add-interests 123 \
  --interests "vip-updates" \
  --query "tags==vip"

# Remove interests
cakemail contacts remove-interests 123 \
  --interests "old-interest" \
  --query "status==unsubscribed"
```

### Segmentation by Interests

```bash
# Create segment of contacts interested in products
cakemail segments create 123 \
  --name "Product Interest" \
  --query "interests==products"

# Multiple interests
cakemail segments create 123 \
  --name "Engaged Subscribers" \
  --query "interests==products;interests==news"
```

---

## Interests vs Tags

Understanding when to use each:

**Use Interests When:**
- ✅ Subscription preferences (user-controlled)
- ✅ List-specific categories
- ✅ Newsletter topic selection
- ✅ Opt-in preferences
- ✅ Need URL-friendly aliases

**Use Tags When:**
- ✅ Internal organization (admin-controlled)
- ✅ Cross-list categorization
- ✅ Customer lifecycle stages
- ✅ Behavior-based labels
- ✅ Global classification

**Example:**

**Interests (subscriber chooses):**
- "Product Updates"
- "Weekly Digest"
- "Event Invitations"

**Tags (admin applies):**
- "vip"
- "high-value"
- "churned-customer"

---

## Best Practices

### 1. Use Clear, User-Friendly Names

**Good:**
```bash
cakemail interests create --name "Product Updates" --alias "products"
cakemail interests create --name "Weekly Newsletter" --alias "weekly"
```

**Avoid:**
```bash
cakemail interests create --name "INT_PROD_UPD" --alias "int1"
cakemail interests create --name "Newsletter_wkly" --alias "nwsltr"
```

### 2. Provide Aliases for All Interests

```bash
# Always include aliases for subscription forms
cakemail interests create \
  --name "Product Announcements" \
  --alias "announcements"
```

### 3. Keep Interest Count Manageable

**Recommended:**
- 3-7 interests for simple newsletters
- 10-15 interests for comprehensive programs
- <20 interests to avoid overwhelming subscribers

### 4. Organize by Category

```bash
# Content type
cakemail interests create --name "Blog Posts" --alias "blog"
cakemail interests create --name "Case Studies" --alias "cases"
cakemail interests create --name "Webinars" --alias "webinars"

# Or by frequency
cakemail interests create --name "Daily Tips" --alias "daily"
cakemail interests create --name "Weekly Roundup" --alias "weekly"
```

---

## Troubleshooting

### Interest Not Found

**Problem:**
```
Error: Interest 'updates' not found in list 123
```

**Solutions:**
1. List all interests: `cakemail interests list 123`
2. Check spelling
3. Verify you're using correct list ID
4. Try interest name instead of alias

---

### Cannot Delete Interest

**Problem:**
```
Error: Cannot delete interest - subscribers exist
```

**Solutions:**
1. Check subscriber count: `cakemail interests get updates`
2. This is expected - delete anyway with confirmation
3. Remove from contacts first (optional but not required)

---

### Duplicate Interest

**Problem:**
```
Error: Interest 'Product Updates' already exists in this list
```

**Solutions:**
1. List interests: `cakemail interests list`
2. Use different name
3. Or update existing: `cakemail interests update "Product Updates" --alias "new-alias"`

---

