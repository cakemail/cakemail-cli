# Segment Commands

Manage dynamic contact segments with condition-based filtering.

## Overview

Segment commands allow you to:
- Create dynamic segments based on contact attributes
- Filter contacts using complex conditions
- Update segment definitions
- List contacts matching segment criteria
- Delete unused segments

Segments are dynamic filters that automatically include contacts matching specified conditions. Unlike static lists, segment membership updates automatically as contact data changes.

All segment operations support **smart defaults** - list IDs are auto-detected when you have only one list.

## Commands

- [segments list](#segments-list) - List all segments in a list
- [segments get](#segments-get) - Get segment details
- [segments create](#segments-create) - Create a new segment
- [segments update](#segments-update) - Update segment definition
- [segments delete](#segments-delete) - Delete a segment
- [segments contacts](#segments-contacts) - List contacts in segment

---

## segments list

List all segments in a list with pagination support.

### Usage

```bash
cakemail segments list [list-id] [options]
```

### Arguments

- `list-id` - List ID (optional - auto-detected if only one list exists)

### Options

- `-l, --limit <number>` - Limit number of results per page
- `-p, --page <number>` - Page number (default: 1)

### Examples

**List segments with auto-detection:**

```bash
$ cakemail segments list
```

**Output:**
```
✓ Auto-detected list: 123 (Newsletter Subscribers)
┌────────┬─────────────────────┬────────────┬─────────────────────┐
│ ID     │ Name                │ Contacts   │ Created             │
├────────┼─────────────────────┼────────────┼─────────────────────┤
│ 456    │ Active Subscribers  │ 1,180      │ 2024-01-15 10:30:00 │
│ 457    │ High Engagement     │ 342        │ 2024-02-01 14:20:00 │
│ 458    │ VIP Customers       │ 45         │ 2024-03-01 09:00:00 │
└────────┴─────────────────────┴────────────┴─────────────────────┘
```

**List segments for specific list:**

```bash
$ cakemail segments list 123
```

**List with pagination:**

```bash
$ cakemail segments list 123 -l 10 -p 1
```

**Export segment list as JSON:**

```bash
$ cakemail segments list 123 -f json > segments.json
```

**Output:**
```json
{
  "data": [
    {
      "id": 456,
      "name": "Active Subscribers",
      "contact_count": 1180,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "count": 3
}
```

### Notes

- Contact counts update dynamically as contacts meet/don't meet criteria
- Auto-detection works when you have exactly one list
- Use pagination for lists with many segments
- Segments are list-specific (not shared across lists)

### Related Commands

- [segments get](#segments-get) - View segment details
- [segments create](#segments-create) - Create new segment
- [lists list](/en/cli/command-reference/lists#lists-list) - View all lists

---

## segments get

Get detailed information about a specific segment including conditions.

### Usage

```bash
cakemail segments get [list-id] <segment-id>
```

### Arguments

- `list-id` - List ID (optional - auto-detected if only one list exists)
- `segment-id` - Segment ID (required)

### Examples

**Get segment details with auto-detection:**

```bash
$ cakemail segments get 456
```

**Output:**
```
✓ Auto-detected list: 123 (Newsletter Subscribers)
{
  "id": 456,
  "name": "Active Subscribers",
  "list_id": 123,
  "contact_count": 1180,
  "conditions": {
    "match": "all",
    "rules": [
      {
        "field": "status",
        "operator": "equals",
        "value": "subscribed"
      },
      {
        "field": "last_open_date",
        "operator": "greater_than",
        "value": "2024-01-01"
      }
    ]
  },
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-03-10T16:45:00Z"
}
```

**Get segment with list ID:**

```bash
$ cakemail segments get 123 456
```

**Extract segment conditions:**

```bash
$ cakemail segments get 456 -f json | jq '.conditions'
```

**Output:**
```json
{
  "match": "all",
  "rules": [
    {
      "field": "status",
      "operator": "equals",
      "value": "subscribed"
    },
    {
      "field": "last_open_date",
      "operator": "greater_than",
      "value": "2024-01-01"
    }
  ]
}
```

**Check segment size:**

```bash
$ cakemail segments get 456 -f json | jq '.contact_count'
```

**Output:**
```
1180
```

### Notes

- Contact count updates dynamically
- Conditions define which contacts are included
- `match: "all"` means contacts must meet all rules
- `match: "any"` means contacts need to meet at least one rule
- Auto-detection works when you have exactly one list

### Related Commands

- [segments contacts](#segments-contacts) - View contacts in segment
- [segments update](#segments-update) - Modify segment conditions
- [segments list](#segments-list) - Find segment IDs

---

## segments create

Create a new segment with condition-based filtering.

### Usage

```bash
cakemail segments create [list-id] [options]
```

### Arguments

- `list-id` - List ID (optional - auto-detected if only one list exists)

### Options

- `-n, --name <name>` - Segment name (required)
- `-c, --conditions <json>` - Segment conditions as JSON (optional)

### Examples

**Create simple segment with auto-detection:**

```bash
$ cakemail segments create -n "Active Subscribers"
```

**Output:**
```
✓ Auto-detected list: 123 (Newsletter Subscribers)
✓ Segment created: 456
{
  "id": 456,
  "name": "Active Subscribers",
  "list_id": 123,
  "contact_count": 0
}
```

**Create segment with conditions:**

```bash
$ cakemail segments create -n "High Engagement" \
  -c '{
    "match": "all",
    "rules": [
      {"field": "status", "operator": "equals", "value": "subscribed"},
      {"field": "last_open_date", "operator": "greater_than", "value": "2024-01-01"}
    ]
  }'
```

**Output:**
```
✓ Auto-detected list: 123 (Newsletter Subscribers)
✓ Segment created: 457
{
  "id": 457,
  "name": "High Engagement",
  "contact_count": 342,
  "conditions": {
    "match": "all",
    "rules": [...]
  }
}
```

**Create segment for specific list:**

```bash
$ cakemail segments create 123 -n "VIP Customers" \
  -c '{
    "match": "all",
    "rules": [
      {"field": "custom_attributes.plan", "operator": "equals", "value": "premium"}
    ]
  }'
```

**Create segment with "any" match:**

```bash
$ cakemail segments create -n "Engaged or Recent" \
  -c '{
    "match": "any",
    "rules": [
      {"field": "last_click_date", "operator": "greater_than", "value": "2024-03-01"},
      {"field": "subscribed_on", "operator": "greater_than", "value": "2024-03-01"}
    ]
  }'
```

**Output:**
```
✓ Segment created: 458
{
  "id": 458,
  "name": "Engaged or Recent",
  "contact_count": 567
}
```

### Condition Structure

```json
{
  "match": "all|any",
  "rules": [
    {
      "field": "field_name",
      "operator": "operator_type",
      "value": "comparison_value"
    }
  ]
}
```

### Available Operators

- `equals` - Exact match
- `not_equals` - Not equal to
- `greater_than` - Greater than (numbers, dates)
- `less_than` - Less than (numbers, dates)
- `contains` - Contains substring
- `not_contains` - Does not contain
- `starts_with` - Starts with
- `ends_with` - Ends with
- `is_empty` - Field is empty/null
- `is_not_empty` - Field has value

### Common Fields

- `email` - Contact email
- `first_name` - Contact first name
- `last_name` - Contact last name
- `status` - Subscription status (subscribed, unsubscribed)
- `subscribed_on` - Subscription date
- `last_open_date` - Last email open date
- `last_click_date` - Last link click date
- `custom_attributes.field_name` - Custom attribute value

### Notes

- Segments update dynamically as contact data changes
- Empty conditions segment includes all contacts
- Custom attributes accessed via dot notation
- Date values in ISO format (YYYY-MM-DD)
- Contact count calculated immediately

### Related Commands

- [segments get](#segments-get) - View created segment
- [segments contacts](#segments-contacts) - View matching contacts
- [segments update](#segments-update) - Modify conditions

---

## segments update

Update an existing segment's name or conditions.

### Usage

```bash
cakemail segments update [list-id] <segment-id> [options]
```

### Arguments

- `list-id` - List ID (optional - auto-detected if only one list exists)
- `segment-id` - Segment ID (required)

### Options

- `-n, --name <name>` - New segment name
- `-c, --conditions <json>` - New segment conditions as JSON

### Examples

**Update segment name:**

```bash
$ cakemail segments update 456 -n "Highly Active Subscribers"
```

**Output:**
```
✓ Auto-detected list: 123 (Newsletter Subscribers)
✓ Segment 456 updated
{
  "id": 456,
  "name": "Highly Active Subscribers",
  "contact_count": 1180
}
```

**Update segment conditions:**

```bash
$ cakemail segments update 456 \
  -c '{
    "match": "all",
    "rules": [
      {"field": "status", "operator": "equals", "value": "subscribed"},
      {"field": "last_open_date", "operator": "greater_than", "value": "2024-02-01"}
    ]
  }'
```

**Output:**
```
✓ Segment 456 updated
{
  "id": 456,
  "name": "Highly Active Subscribers",
  "contact_count": 892,
  "conditions": {...}
}
```

**Update both name and conditions:**

```bash
$ cakemail segments update 123 456 \
  -n "Premium Customers" \
  -c '{
    "match": "all",
    "rules": [
      {"field": "custom_attributes.plan", "operator": "equals", "value": "premium"},
      {"field": "status", "operator": "equals", "value": "subscribed"}
    ]
  }'
```

**Broaden segment criteria:**

```bash
$ cakemail segments update 457 \
  -c '{
    "match": "any",
    "rules": [
      {"field": "last_open_date", "operator": "greater_than", "value": "2024-01-01"},
      {"field": "last_click_date", "operator": "greater_than", "value": "2024-01-01"}
    ]
  }'
```

### Notes

- Only provided fields are updated (partial updates)
- Contact count recalculates immediately
- Changing conditions affects which contacts are included
- Use [segments contacts](#segments-contacts) to preview changes

### Related Commands

- [segments get](#segments-get) - View current segment definition
- [segments contacts](#segments-contacts) - Preview affected contacts
- [segments create](#segments-create) - Create new segment

---

## segments delete

Permanently delete a segment.

### Usage

```bash
cakemail segments delete [list-id] <segment-id> [options]
```

### Arguments

- `list-id` - List ID (optional - auto-detected if only one list exists)
- `segment-id` - Segment ID (required)

### Options

- `-f, --force` - Skip confirmation prompt (use in scripts)

### Examples

**Delete segment with confirmation:**

```bash
$ cakemail segments delete 456
```

**Output:**
```
✓ Auto-detected list: 123 (Newsletter Subscribers)
⚠ Delete segment 456?

The following will happen:
  • Segment will be permanently deleted

Type 'yes' to confirm: yes

✓ Segment 456 deleted
```

**Force delete without confirmation:**

```bash
$ cakemail segments delete 456 --force
```

**Output:**
```
✓ Auto-detected list: 123 (Newsletter Subscribers)
✓ Segment 456 deleted
```

**Delete with list ID:**

```bash
$ cakemail segments delete 123 456 --force
```

**Delete in script:**

```bash
$ cakemail segments delete 456 --force --batch
```

### Notes

- Deletion is permanent and cannot be undone
- Contacts in the segment are not deleted (only the segment definition)
- Campaigns previously sent to this segment remain in history
- No confirmation shown when `--force` is used

### Related Commands

- [segments list](#segments-list) - View segments before deletion
- [segments get](#segments-get) - Review segment details

---

## segments contacts

List all contacts that match a segment's conditions.

### Usage

```bash
cakemail segments contacts [list-id] <segment-id> [options]
```

### Arguments

- `list-id` - List ID (optional - auto-detected if only one list exists)
- `segment-id` - Segment ID (required)

### Options

- `-l, --limit <number>` - Limit number of results per page
- `-p, --page <number>` - Page number (default: 1)

### Examples

**List segment contacts with auto-detection:**

```bash
$ cakemail segments contacts 456
```

**Output:**
```
✓ Auto-detected list: 123 (Newsletter Subscribers)
┌────────┬──────────────────────┬────────────┬────────────┬──────────────┐
│ ID     │ Email                │ First Name │ Last Name  │ Status       │
├────────┼──────────────────────┼────────────┼────────────┼──────────────┤
│ 501    │ john@example.com     │ John       │ Doe        │ subscribed   │
│ 502    │ jane@example.com     │ Jane       │ Smith      │ subscribed   │
│ 503    │ bob@example.com      │ Bob        │ Johnson    │ subscribed   │
└────────┴──────────────────────┴────────────┴────────────┴──────────────┘
```

**List with list ID:**

```bash
$ cakemail segments contacts 123 456
```

**List with pagination:**

```bash
$ cakemail segments contacts 456 -l 50 -p 1
```

**Export segment contacts:**

```bash
$ cakemail segments contacts 456 -f json > segment-contacts.json
```

**Count segment contacts:**

```bash
$ cakemail segments contacts 456 -f json | jq '.count'
```

**Output:**
```
1180
```

**Extract email addresses:**

```bash
$ cakemail segments contacts 456 -f json | jq -r '.data[].email' > emails.txt
```

### Notes

- Results update dynamically based on segment conditions
- Same contact filtering as [contacts list](/en/cli/command-reference/contacts#contacts-list)
- Use pagination for large segments
- Useful for previewing segment before sending campaign

### Related Commands

- [segments get](#segments-get) - View segment definition
- [contacts list](/en/cli/command-reference/contacts#contacts-list) - List all contacts
- [campaigns create](/en/cli/command-reference/campaigns#campaigns-create) - Send to segment

---

## Common Workflows

### Workflow 1: Create Engagement-Based Segment

```bash
# Create segment for highly engaged contacts
$ cakemail segments create -n "Highly Engaged" \
  -c '{
    "match": "all",
    "rules": [
      {"field": "status", "operator": "equals", "value": "subscribed"},
      {"field": "last_open_date", "operator": "greater_than", "value": "2024-01-01"},
      {"field": "last_click_date", "operator": "greater_than", "value": "2024-01-01"}
    ]
  }'

# Check segment size
$ cakemail segments get 456 -f json | jq '.contact_count'

# Preview contacts
$ cakemail segments contacts 456 -l 10
```

### Workflow 2: Target Recent Subscribers

```bash
# Create segment for new subscribers (last 30 days)
$ cakemail segments create -n "New Subscribers" \
  -c '{
    "match": "all",
    "rules": [
      {"field": "subscribed_on", "operator": "greater_than", "value": "2024-02-15"}
    ]
  }'

# Send welcome campaign to segment
$ cakemail campaigns create \
  -n "Welcome Series" \
  -l 123 \
  -s 101 \
  --segment 457
```

### Workflow 3: Re-engagement Campaign

```bash
# Create segment for inactive subscribers
$ cakemail segments create -n "Inactive Subscribers" \
  -c '{
    "match": "all",
    "rules": [
      {"field": "status", "operator": "equals", "value": "subscribed"},
      {"field": "last_open_date", "operator": "less_than", "value": "2023-12-01"}
    ]
  }'

# Check size
$ cakemail segments get 458 -f json | jq '.contact_count'

# Export for analysis
$ cakemail segments contacts 458 -f json > inactive-contacts.json
```

### Workflow 4: Custom Attribute Targeting

```bash
# Create segment based on custom attributes
$ cakemail segments create -n "Premium Plan Users" \
  -c '{
    "match": "all",
    "rules": [
      {"field": "custom_attributes.plan", "operator": "equals", "value": "premium"},
      {"field": "custom_attributes.active", "operator": "equals", "value": "true"}
    ]
  }'

# List premium users
$ cakemail segments contacts 459 -l 100
```

### Workflow 5: Segment Cleanup

```bash
# List all segments
$ cakemail segments list

# Check each segment size
for id in 456 457 458; do
  echo "Segment $id:"
  cakemail segments get $id -f json | jq '{name, contacts: .contact_count}'
done

# Delete unused segments
$ cakemail segments delete 460 --force
$ cakemail segments delete 461 --force
```

## Best Practices

1. **Descriptive Names**: Use clear segment names that describe the criteria
2. **Test Conditions**: Preview contacts before using segment in campaigns
3. **Regular Reviews**: Periodically review and update segment conditions
4. **Performance**: Keep condition rules simple for faster evaluation
5. **Documentation**: Document complex segment logic for team reference
6. **Avoid Over-Segmentation**: Don't create too many narrow segments
7. **Dynamic Updates**: Leverage segments' dynamic nature instead of static exports
8. **Date-Based Rules**: Use date comparisons for time-sensitive targeting

## Troubleshooting

### Error: "List ID not found"

Auto-detection failed or invalid list ID.

**Solution:**
```bash
# List your lists
$ cakemail lists list

# Use specific list ID
$ cakemail segments list 123
```

### Segment Has Zero Contacts

Conditions may be too restrictive or no contacts match criteria.

**Solution:**
```bash
# Review segment conditions
$ cakemail segments get 456 -f json | jq '.conditions'

# Test with broader conditions
$ cakemail segments update 456 \
  -c '{
    "match": "any",
    "rules": [
      {"field": "status", "operator": "equals", "value": "subscribed"}
    ]
  }'

# Check contact count
$ cakemail segments get 456 -f json | jq '.contact_count'
```

### Invalid JSON in Conditions

Malformed JSON causes creation/update to fail.

**Solution:**
```bash
# Validate JSON before using
$ echo '{
  "match": "all",
  "rules": [
    {"field": "status", "operator": "equals", "value": "subscribed"}
  ]
}' | jq .

# If valid, use in command
$ cakemail segments create -n "Test" -c '{"match":"all","rules":[...]}'
```

### Unexpected Segment Size

Contacts may meet conditions you didn't anticipate.

**Solution:**
```bash
# Preview contacts in segment
$ cakemail segments contacts 456 -l 50

# Export for analysis
$ cakemail segments contacts 456 -f json > review.json

# Check specific contacts
$ jq '.data[] | {email, status, last_open_date}' review.json
```

### Custom Attribute Not Working

Field name may be incorrect or attribute doesn't exist.

**Solution:**
```bash
# List contact to see available attributes
$ cakemail contacts get 123 501 -f json | jq '.custom_attributes'

# Use correct field name with dot notation
$ cakemail segments create -n "Test" \
  -c '{
    "match": "all",
    "rules": [
      {"field": "custom_attributes.plan", "operator": "equals", "value": "premium"}
    ]
  }'
```

### Segment Updates Not Reflecting

Contact data may not have changed or cache issue.

**Solution:**
```bash
# Force refresh by re-fetching
$ cakemail segments get 456

# Check specific contacts
$ cakemail segments contacts 456 -l 10

# Verify contact data
$ cakemail contacts get 123 501 -f json | jq '{last_open_date, status}'
```

### Date Comparison Not Working

Date format may be incorrect.

**Solution:**
```bash
# Use ISO date format (YYYY-MM-DD)
$ cakemail segments create -n "Recent Opens" \
  -c '{
    "match": "all",
    "rules": [
      {"field": "last_open_date", "operator": "greater_than", "value": "2024-03-01"}
    ]
  }'

# Avoid formats like: "03/01/2024" or "March 1, 2024"
```

---

**Related Documentation:**
- [Lists Commands](/en/cli/command-reference/lists/) - Manage contact lists
- [Contacts Commands](/en/cli/command-reference/contacts/) - Manage contacts
- [Campaigns Commands](/en/cli/command-reference/campaigns/) - Send campaigns to segments
- [Attributes Commands](/en/cli/command-reference/attributes/) - Custom contact attributes
- [Interests Commands](/en/cli/command-reference/interests/) - List-specific interests
