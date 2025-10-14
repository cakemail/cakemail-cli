# Attribute Commands

Manage custom attributes (custom fields) for storing additional contact data.

## Overview

Attribute commands allow you to:
- Define custom fields for contacts
- Store additional data beyond standard fields (email, name)
- Create attributes with different data types
- List all custom attributes in a list
- Delete unused attributes

Custom attributes extend contact records with business-specific data like plan type, purchase history, preferences, or any other information you need to store and segment by.

All attribute operations support **smart defaults** - list IDs are auto-detected when you have only one list.

## Commands

- [attributes list](#attributes-list) - List all custom attributes
- [attributes get](#attributes-get) - Get attribute details
- [attributes create](#attributes-create) - Create a new attribute
- [attributes delete](#attributes-delete) - Delete an attribute

---

## attributes list

List all custom attributes defined for a list.

### Usage

```bash
cakemail attributes list [list-id]
```

### Arguments

- `list-id` - List ID (optional - auto-detected if only one list exists)

### Examples

**List attributes with auto-detection:**

```bash
$ cakemail attributes list
```

**Output:**
```
✓ Auto-detected list: 123 (Newsletter Subscribers)
┌─────────────────┬──────────┬─────────────────────┐
│ Name            │ Type     │ Created             │
├─────────────────┼──────────┼─────────────────────┤
│ plan            │ text     │ 2024-01-15 10:30:00 │
│ signup_date     │ date     │ 2024-02-01 14:20:00 │
│ is_vip          │ boolean  │ 2024-03-01 09:00:00 │
│ purchase_count  │ number   │ 2024-03-10 16:45:00 │
└─────────────────┴──────────┴─────────────────────┘
```

**List attributes for specific list:**

```bash
$ cakemail attributes list 123
```

**Export attributes as JSON:**

```bash
$ cakemail attributes list -f json > attributes.json
```

**Output:**
```json
{
  "data": [
    {
      "name": "plan",
      "type": "text",
      "created_at": "2024-01-15T10:30:00Z"
    },
    {
      "name": "signup_date",
      "type": "date",
      "created_at": "2024-02-01T14:20:00Z"
    },
    {
      "name": "is_vip",
      "type": "boolean",
      "created_at": "2024-03-01T09:00:00Z"
    },
    {
      "name": "purchase_count",
      "type": "number",
      "created_at": "2024-03-10T16:45:00Z"
    }
  ],
  "count": 4
}
```

**Find attributes by type:**

```bash
$ cakemail attributes list -f json | jq '.data[] | select(.type == "text")'
```

### Notes

- Attributes are list-specific (not shared across lists)
- Auto-detection works when you have exactly one list
- Standard fields (email, first_name, last_name) are not shown
- Use descriptive names for clarity

### Related Commands

- [attributes get](#attributes-get) - View attribute details
- [attributes create](#attributes-create) - Add new attribute
- [contacts add](/en/cli/command-reference/contacts#contacts-add) - Use attributes with contacts

---

## attributes get

Get detailed information about a specific custom attribute.

### Usage

```bash
cakemail attributes get [list-id] <name>
```

### Arguments

- `list-id` - List ID (optional - auto-detected if only one list exists)
- `name` - Attribute name (required)

### Examples

**Get attribute details with auto-detection:**

```bash
$ cakemail attributes get plan
```

**Output:**
```
✓ Auto-detected list: 123 (Newsletter Subscribers)
{
  "name": "plan",
  "type": "text",
  "list_id": 123,
  "created_at": "2024-01-15T10:30:00Z"
}
```

**Get attribute with list ID:**

```bash
$ cakemail attributes get 123 plan
```

**Extract attribute type:**

```bash
$ cakemail attributes get plan -f json | jq -r '.type'
```

**Output:**
```
text
```

### Notes

- Attribute names are case-sensitive
- Returns attribute metadata (not contact values)
- Auto-detection works when you have exactly one list

### Related Commands

- [attributes list](#attributes-list) - Find attribute names
- [contacts get](/en/cli/command-reference/contacts#contacts-get) - View attribute values

---

## attributes create

Create a new custom attribute for storing additional contact data.

### Usage

```bash
cakemail attributes create [list-id] [options]
```

### Arguments

- `list-id` - List ID (optional - auto-detected if only one list exists)

### Options

- `-n, --name <name>` - Attribute name (required)
- `-t, --type <type>` - Attribute data type (required)

### Available Types

- `text` - Text strings (e.g., "premium", "New York")
- `number` - Numeric values (e.g., 42, 99.99)
- `date` - Dates in ISO format (e.g., "2024-03-15")
- `boolean` - True/false values

### Examples

**Create text attribute with auto-detection:**

```bash
$ cakemail attributes create -n "plan" -t "text"
```

**Output:**
```
✓ Auto-detected list: 123 (Newsletter Subscribers)
✓ Custom attribute created: plan
{
  "name": "plan",
  "type": "text",
  "list_id": 123,
  "created_at": "2024-03-15T10:30:00Z"
}
```

**Create date attribute:**

```bash
$ cakemail attributes create -n "signup_date" -t "date"
```

**Output:**
```
✓ Auto-detected list: 123 (Newsletter Subscribers)
✓ Custom attribute created: signup_date
```

**Create number attribute:**

```bash
$ cakemail attributes create -n "purchase_count" -t "number"
```

**Create boolean attribute:**

```bash
$ cakemail attributes create -n "is_vip" -t "boolean"
```

**Create attribute for specific list:**

```bash
$ cakemail attributes create 123 -n "company" -t "text"
```

**Create multiple attributes:**

```bash
# Customer data attributes
$ cakemail attributes create -n "customer_id" -t "text"
$ cakemail attributes create -n "lifetime_value" -t "number"
$ cakemail attributes create -n "last_purchase_date" -t "date"
$ cakemail attributes create -n "is_active" -t "boolean"
```

### Naming Conventions

**Good attribute names:**
- `plan_type` - Clear, descriptive
- `signup_date` - Uses underscores
- `is_premium` - Boolean prefix
- `total_purchases` - Descriptive

**Avoid:**
- `pt` - Too short, unclear
- `Plan Type` - Spaces not recommended
- `PLAN` - All caps harder to read
- `planTypeForCustomer` - Too verbose

### Type Selection Guide

| Data | Type | Example Values |
|------|------|----------------|
| Categories/Labels | `text` | "premium", "basic", "trial" |
| Counts/Quantities | `number` | 5, 100, 1500 |
| Amounts/Prices | `number` | 29.99, 150.00 |
| Dates | `date` | "2024-03-15", "2024-12-31" |
| Yes/No Flags | `boolean` | true, false |

### Notes

- Attribute names must be unique within a list
- Names are case-sensitive
- Choose type carefully (cannot be changed later)
- Use lowercase with underscores for consistency
- Attribute appears immediately in contact records

### Related Commands

- [attributes list](#attributes-list) - View created attributes
- [contacts add](/en/cli/command-reference/contacts#contacts-add) - Add contacts with custom data
- [segments create](/en/cli/command-reference/segments#segments-create) - Segment by attribute

---

## attributes delete

Permanently delete a custom attribute and all its data from contacts.

### Usage

```bash
cakemail attributes delete [list-id] <name> [options]
```

### Arguments

- `list-id` - List ID (optional - auto-detected if only one list exists)
- `name` - Attribute name (required)

### Options

- `-f, --force` - Skip confirmation prompt (use in scripts)

### Examples

**Delete attribute with confirmation:**

```bash
$ cakemail attributes delete plan
```

**Output:**
```
✓ Auto-detected list: 123 (Newsletter Subscribers)
⚠ Delete custom attribute plan?

The following will happen:
  • Attribute and all its data will be deleted from all contacts

Type 'yes' to confirm: yes

✓ Attribute plan deleted
```

**Force delete without confirmation:**

```bash
$ cakemail attributes delete plan --force
```

**Output:**
```
✓ Auto-detected list: 123 (Newsletter Subscribers)
✓ Attribute plan deleted
```

**Delete with list ID:**

```bash
$ cakemail attributes delete 123 old_field --force
```

**Delete in script:**

```bash
$ cakemail attributes delete deprecated_field --force --batch
```

### Notes

- Deletion is **permanent** and **irreversible**
- All attribute values deleted from all contacts
- Data cannot be recovered
- Segments using this attribute may break
- Confirmation required unless `--force` is used

### Related Commands

- [attributes list](#attributes-list) - View attributes before deletion
- [attributes get](#attributes-get) - Review attribute details

---

## Common Workflows

### Workflow 1: Setup Customer Attributes

```bash
# Create customer tracking attributes
$ cakemail attributes create -n "customer_id" -t "text"
$ cakemail attributes create -n "plan_type" -t "text"
$ cakemail attributes create -n "signup_date" -t "date"
$ cakemail attributes create -n "is_paid" -t "boolean"
$ cakemail attributes create -n "lifetime_value" -t "number"

# List all attributes
$ cakemail attributes list

# Add contact with custom data
$ cakemail contacts add \
  -e "john@example.com" \
  -f "John" \
  -l "Doe" \
  -d '{"customer_id":"CUST-001","plan_type":"premium","signup_date":"2024-03-15","is_paid":true,"lifetime_value":299.99}'
```

### Workflow 2: E-commerce Attributes

```bash
# Create e-commerce tracking attributes
$ cakemail attributes create -n "total_orders" -t "number"
$ cakemail attributes create -n "last_order_date" -t "date"
$ cakemail attributes create -n "favorite_category" -t "text"
$ cakemail attributes create -n "vip_member" -t "boolean"
$ cakemail attributes create -n "cart_abandoned" -t "boolean"

# Create segment for cart abandonment
$ cakemail segments create -n "Cart Abandoned" \
  -c '{
    "match": "all",
    "rules": [
      {"field": "custom_attributes.cart_abandoned", "operator": "equals", "value": "true"},
      {"field": "last_open_date", "operator": "greater_than", "value": "2024-01-01"}
    ]
  }'
```

### Workflow 3: Subscription Management

```bash
# Create subscription attributes
$ cakemail attributes create -n "subscription_tier" -t "text"
$ cakemail attributes create -n "renewal_date" -t "date"
$ cakemail attributes create -n "auto_renew" -t "boolean"
$ cakemail attributes create -n "months_subscribed" -t "number"

# Segment by subscription tier
$ cakemail segments create -n "Premium Subscribers" \
  -c '{
    "match": "all",
    "rules": [
      {"field": "custom_attributes.subscription_tier", "operator": "equals", "value": "premium"}
    ]
  }'
```

### Workflow 4: Attribute Audit and Cleanup

```bash
# List all attributes
$ cakemail attributes list

# Check each attribute usage
for attr in plan signup_date is_vip; do
  echo "Attribute: $attr"
  cakemail attributes get $attr
done

# Delete unused attributes
$ cakemail attributes delete old_field --force
$ cakemail attributes delete deprecated_attr --force

# Verify cleanup
$ cakemail attributes list
```

### Workflow 5: Data Migration

```bash
# Export current attributes
$ cakemail attributes list -f json > attributes-backup.json

# Backup contact data
$ cakemail contacts export

# Recreate attributes in new list
for attr in $(jq -r '.data[] | "\(.name):\(.type)"' attributes-backup.json); do
  name=$(echo $attr | cut -d: -f1)
  type=$(echo $attr | cut -d: -f2)
  cakemail attributes create 124 -n "$name" -t "$type"
done
```

## Best Practices

1. **Plan Ahead**: Define all needed attributes before importing contacts
2. **Descriptive Names**: Use clear, self-explanatory attribute names
3. **Consistent Naming**: Use lowercase with underscores (snake_case)
4. **Choose Type Carefully**: Type cannot be changed after creation
5. **Boolean Prefix**: Name boolean attributes with "is_" or "has_" prefix
6. **Document Attributes**: Keep list of attributes and their purposes
7. **Avoid Over-Engineering**: Only create attributes you'll actually use
8. **Regular Cleanup**: Delete deprecated attributes periodically

## Troubleshooting

### Error: "Attribute name already exists"

Attribute with that name already defined.

**Solution:**
```bash
# List existing attributes
$ cakemail attributes list

# Use different name or delete existing
$ cakemail attributes delete old_name --force
$ cakemail attributes create -n "old_name" -t "text"
```

### Error: "List ID not found"

Auto-detection failed or invalid list ID.

**Solution:**
```bash
# List your lists
$ cakemail lists list

# Use specific list ID
$ cakemail attributes list 123
```

### Error: "Invalid attribute type"

Type must be one of: text, number, date, boolean.

**Solution:**
```bash
# Use valid type
$ cakemail attributes create -n "plan" -t "text"

# Not valid: "string", "integer", "bool"
# Valid: "text", "number", "date", "boolean"
```

### Attribute Not Appearing in Contacts

Contact may not have value for attribute.

**Solution:**
```bash
# Check contact data
$ cakemail contacts get 123 501 -f json | jq '.custom_attributes'

# Add attribute value to contact
$ cakemail contacts update 123 501 -d '{"plan":"premium"}'

# Verify update
$ cakemail contacts get 123 501 -f json | jq '.custom_attributes.plan'
```

### Cannot Delete Attribute

Attribute may be in use by segments.

**Solution:**
```bash
# Find segments using attribute
$ cakemail segments list -f json | jq '.data[] | select(.conditions.rules[]?.field | contains("plan"))'

# Update or delete segments first
$ cakemail segments delete 456 --force

# Then delete attribute
$ cakemail attributes delete plan --force
```

### Wrong Data Type Used

Type cannot be changed once created.

**Solution:**
```bash
# Create new attribute with correct type
$ cakemail attributes create -n "plan_id_new" -t "number"

# Migrate data (manual process or script)
# Update contacts to use new attribute

# Delete old attribute
$ cakemail attributes delete plan_id --force

# Optionally rename new attribute
# (requires recreate, no rename command)
```

### Date Format Issues

Dates must be ISO format (YYYY-MM-DD).

**Solution:**
```bash
# Correct date format
$ cakemail contacts add \
  -e "user@example.com" \
  -d '{"signup_date":"2024-03-15"}'

# Not valid: "03/15/2024", "March 15, 2024", "15-03-2024"
# Valid: "2024-03-15"
```

---

**Related Documentation:**
- [Contacts Commands](/en/cli/command-reference/contacts/) - Manage contact data
- [Segments Commands](/en/cli/command-reference/segments/) - Segment by custom attributes
- [Lists Commands](/en/cli/command-reference/lists/) - Manage contact lists
