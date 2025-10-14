# Tags Commands

Manage global contact tags.

## Overview

Tags are labels you can apply to contacts across all lists in your account. Unlike interests which are list-specific, tags are global and can be used for organization, segmentation, and filtering.

**Available Commands:**
- [`tags list`](#tags-list) - List all tags with optional counts
- [`tags show`](#tags-show) - Show tag details and statistics
- [`tags create`](#tags-create) - Create a new tag
- [`tags update`](#tags-update) - Rename an existing tag
- [`tags delete`](#tags-delete) - Delete a tag (removes from all contacts)

**Key Features:**
- Global scope (not list-specific)
- Can be applied to any contact in any list
- Support contact counts for analytics
- Profile-aware delete confirmations
- Case-insensitive tag names

**Related Commands:**
- [`contacts tag`](/en/cli/command-reference/contacts#contacts-tag) - Apply tags to a contact
- [`contacts untag`](/en/cli/command-reference/contacts#contacts-untag) - Remove tags from a contact
- [`contacts tag-bulk`](/en/cli/command-reference/contacts#contacts-tag-bulk) - Tag multiple contacts
- [`contacts untag-bulk`](/en/cli/command-reference/contacts#contacts-untag-bulk) - Untag multiple contacts

---

## tags list

List all global tags in your account.

### Usage

```bash
cakemail tags list [options]
```

### Options

- `-p, --page <number>` - Page number for pagination
- `--per-page <number>` - Results per page (default varies by API)
- `--with-count` - Include contact count for each tag
- `--sort <sort>` - Sort order (e.g., `+name`, `-created_on`)
- `--filter <filter>` - Filter tags (e.g., `name==vip`)

### Examples

**List all tags:**
```bash
$ cakemail tags list
```

**Output (Table format - Balanced profile):**
```
┌────┬─────────────┬─────────────────────┐
│ ID │ Name        │ Created At          │
├────┼─────────────┼─────────────────────┤
│ 1  │ vip         │ 2025-09-15 10:23:11 │
│ 2  │ premium     │ 2025-09-20 14:05:42 │
│ 3  │ early-bird  │ 2025-10-01 08:15:33 │
└────┴─────────────┴─────────────────────┘
```

**List tags with contact counts:**
```bash
$ cakemail tags list --with-count
```

**Output:**
```
✓ Tags retrieved successfully

┌────┬─────────────┬────────────────┬─────────────────────┐
│ ID │ Name        │ Contacts Count │ Created At          │
├────┼─────────────┼────────────────┼─────────────────────┤
│ 1  │ vip         │ 342            │ 2025-09-15 10:23:11 │
│ 2  │ premium     │ 128            │ 2025-09-20 14:05:42 │
│ 3  │ early-bird  │ 67             │ 2025-10-01 08:15:33 │
└────┴─────────────┴────────────────┴─────────────────────┘
```

**Sorted by name:**
```bash
$ cakemail tags list --sort +name --with-count
```

**Filtered tags:**
```bash
$ cakemail tags list --filter "name==vip"
```

**JSON output (Developer profile):**
```bash
$ cakemail --profile developer tags list --with-count
```

**Output:**
```json
{
  "data": [
    {"id": 1, "name": "vip", "contacts_count": 342, "created_on": "2025-09-15T10:23:11Z"},
    {"id": 2, "name": "premium", "contacts_count": 128, "created_on": "2025-09-20T14:05:42Z"}
  ],
  "pagination": {
    "page": 1,
    "per_page": 25,
    "total": 2
  }
}
```

### Notes

- Tags are returned in order of creation by default
- Use `--with-count` to see how many contacts have each tag
- Contact counts may impact performance on large datasets
- Supports standard pagination and filtering

---

## tags show

Show details and statistics for a specific tag.

### Usage

```bash
cakemail tags show <tag>
```

### Arguments

- `<tag>` - Tag name or ID (required)

### Examples

**Show tag by name:**
```bash
$ cakemail tags show vip
```

**Output:**
```
Tag: vip

Details:
  ID: 1
  Name: vip
  Created: 2025-09-15 10:23:11
  Contacts: 342

Usage:
  Lists using this tag: 5
  Campaigns targeting this tag: 12
```

**Show tag by ID:**
```bash
$ cakemail tags show 1
```

**JSON output:**
```bash
$ cakemail -f json tags show vip
```

**Output:**
```json
{
  "id": 1,
  "name": "vip",
  "created_on": "2025-09-15T10:23:11Z",
  "contacts_count": 342,
  "usage_stats": {
    "lists": 5,
    "campaigns": 12
  }
}
```

### Use Cases

- Audit tag usage before deletion
- Verify tag existence
- Check contact counts
- Review tag statistics

---

## tags create

Create a new global tag.

### Usage

```bash
cakemail tags create --name <name>
```

### Options

- `-n, --name <name>` - Tag name (required)

### Examples

**Create a tag:**
```bash
$ cakemail tags create --name "early-adopter"
```

**Output:**
```
✓ Tag created successfully

Tag: early-adopter
  ID: 4
  Created: just now
```

**Create with developer profile (JSON):**
```bash
$ cakemail --profile developer tags create --name "beta-tester"
```

**Output:**
```json
{
  "id": 4,
  "name": "beta-tester",
  "created_on": "2025-10-11T15:30:00Z"
}
```

### Tag Naming Rules

**Valid tag names:**
- Letters, numbers, hyphens, underscores
- Case-insensitive (`VIP` == `vip`)
- 1-50 characters

**Examples:**
- ✅ `vip`
- ✅ `early-bird`
- ✅ `customer_2024`
- ✅ `tier-1`
- ❌ `VIP Customer` (spaces not allowed)
- ❌ `special!` (special characters not allowed)

### Error Handling

**Duplicate tag:**
```
Error: Tag 'vip' already exists
Suggestion: Use 'cakemail tags list' to see existing tags
```

**Invalid name:**
```
Error: Invalid tag name 'VIP Customer'
Tag names can only contain letters, numbers, hyphens, and underscores
```

---

## tags update

Rename an existing tag.

### Usage

```bash
cakemail tags update <tag> --name <new-name>
```

### Arguments

- `<tag>` - Current tag name or ID (required)

### Options

- `-n, --name <name>` - New tag name (required)

### Examples

**Rename a tag:**
```bash
$ cakemail tags update "early-adopter" --name "beta-tester"
```

**Output:**
```
✓ Tag renamed successfully

Tag updated:
  Old name: early-adopter
  New name: beta-tester
  Contacts: 67 (unchanged)
```

**Update by ID:**
```bash
$ cakemail tags update 4 --name "alpha-tester"
```

### Notes

- Tag ID remains unchanged
- All contacts keep the tag (only name changes)
- Existing segments using this tag continue to work
- Tag history is preserved

---

## tags delete

Delete a tag and remove it from all contacts.

### Usage

```bash
cakemail tags delete <tag> [options]
```

### Arguments

- `<tag>` - Tag name or ID to delete (required)

### Options

- `-f, --force` - Skip confirmation prompt

### Examples

**Delete with confirmation (Balanced/Marketer profile):**
```bash
$ cakemail tags delete "old-tag"
```

**Output:**
```
⚠ Delete tag 'old-tag'?
  Tag will be removed from all 42 contacts
  This action cannot be undone
  Segments using this tag may be affected

Delete tag? (y/N): y

✓ Tag 'old-tag' deleted successfully
✓ Removed from 42 contacts
```

**Force delete (skip confirmation):**
```bash
$ cakemail tags delete "old-tag" --force
```

**Output:**
```
✓ Tag 'old-tag' deleted
✓ Removed from 42 contacts
```

**Developer profile (no confirmation):**
```bash
$ cakemail --profile developer tags delete "old-tag"
```

**Output:**
```
{"success":true,"tag":"old-tag","contacts_affected":42}
```

### Confirmation Behavior

**Marketer profile:**
- Always confirms, even with `--force`
- Shows detailed warning
- Displays affected contact count

**Balanced profile:**
- Confirms in interactive terminal
- Skips in scripts/CI
- Respects `--force` flag

**Developer profile:**
- Never confirms
- Immediate deletion
- JSON output

### Important Notes

**⚠️ Warning: This action is destructive**

When you delete a tag:
- Tag is permanently removed
- Removed from ALL contacts who have it
- Segments using this tag may stop working correctly
- Campaign filters using this tag will need updating
- Cannot be undone

**Before deleting:**
1. Check usage: `cakemail tags show <tag>`
2. Review affected contacts count
3. Update segments that reference this tag
4. Update campaign filters

---

## Common Workflows

### Workflow 1: Tag Audit and Cleanup

```bash
# List all tags with contact counts
cakemail tags list --with-count --sort +name

# Review each low-usage tag
cakemail tags show "rarely-used-tag"

# Delete unused tags
cakemail tags delete "unused-tag" --force
```

---

### Workflow 2: Tag Renaming Strategy

```bash
# Check current tag
cakemail tags show "old-name"

# Rename to new convention
cakemail tags update "old-name" --name "new-name"

# Verify
cakemail tags show "new-name"
```

---

### Workflow 3: Bulk Tag Management

```bash
# Create multiple tags
cakemail tags create --name "tier-1"
cakemail tags create --name "tier-2"
cakemail tags create --name "tier-3"

# List to verify
cakemail tags list --sort +name

# Bulk apply to contacts (see contacts command)
cakemail contacts tag-bulk 123 --tags "tier-1,tier-2" --query "engagement_score>80"
```

---

## Integration with Other Commands

### Tagging Contacts

After creating tags, apply them to contacts:

```bash
# Tag a single contact
cakemail contacts tag 123 456 --tags "vip,premium"

# Bulk tag contacts by query
cakemail contacts tag-bulk 123 --tags "early-bird" --query "created_on<2025-01-01"

# Bulk tag specific contacts
cakemail contacts tag-bulk 123 --tags "vip" --contacts "1,2,3,4,5"
```

### Segmentation

Use tags in segment queries:

```bash
# Create segment of VIP contacts
cakemail segments create 123 --name "VIP Customers" --query "tags==vip"

# Combine with other conditions
cakemail segments create 123 --name "Active VIPs" --query "tags==vip;status==active"
```

### Campaign Targeting

Filter campaign recipients by tags:

```bash
# This would be done through the Cakemail web UI
# But you can verify tag usage in campaigns
cakemail tags show vip  # Check "campaigns" count
```

---

## Best Practices

### 1. Use Consistent Naming

**Good:**
```bash
cakemail tags create --name "tier-1"
cakemail tags create --name "tier-2"
cakemail tags create --name "tier-3"
```

**Avoid:**
```bash
cakemail tags create --name "Tier1"
cakemail tags create --name "tier_2"
cakemail tags create --name "TIER-THREE"
```

### 2. Audit Regularly

```bash
# Monthly tag audit
cakemail tags list --with-count | grep " 0 "  # Find unused tags
```

### 3. Document Tag Meaning

Maintain a separate document explaining what each tag means and when to use it.

### 4. Limit Tag Count

Too many tags = confusion. Aim for:
- < 20 tags for small teams
- < 50 tags for medium organizations
- < 100 tags for enterprises

---

## Troubleshooting

### Tag Not Found

**Problem:**
```
Error: Tag 'vip' not found
```

**Solutions:**
1. List all tags: `cakemail tags list`
2. Check spelling (tags are case-insensitive)
3. Use tag ID instead: `cakemail tags show 1`

---

### Cannot Delete Tag

**Problem:**
```
Error: Cannot delete tag 'vip' - tag is in use
```

**Solutions:**
1. Check usage: `cakemail tags show vip`
2. Review affected segments
3. Use `--force` if you're sure
4. Contact support if blocked

---

### Duplicate Tag Error

**Problem:**
```
Error: Tag 'vip' already exists
```

**Solutions:**
1. List tags: `cakemail tags list`
2. Use different name
3. Or update existing tag: `cakemail tags update vip --name new-name`

---

