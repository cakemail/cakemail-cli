# Custom Attributes

Extend contact records with custom fields to store business-specific data beyond standard email and name fields.

## Overview

Custom attributes allow you to:
- Store unlimited additional contact data
- Track customer preferences and behavior
- Enable advanced segmentation
- Personalize campaigns with custom data
- Integrate with your business systems
- Build comprehensive customer profiles

Custom attributes are the key to making Cakemail work for your specific business needs.

## Quick Start

### Create Your First Attribute

```bash
$ cakemail attributes create 123 -n "plan_type" -t "text"
```

**Output:**
```
✓ Custom attribute created: plan_type

Name: plan_type
Type: text
List: 123
```

### Add Contact with Custom Data

```bash
$ cakemail contacts add 123 \
  -e "customer@example.com" \
  -f "Jane" \
  -l "Doe" \
  -d '{"plan_type":"premium"}'
```

### View Attributes

```bash
$ cakemail attributes list 123
```

**Output:**
```
┌──────────────────┬──────────┬─────────────────────┐
│ Name             │ Type     │ Created             │
├──────────────────┼──────────┼─────────────────────┤
│ plan_type        │ text     │ 2024-01-15 10:30:00 │
│ signup_date      │ date     │ 2024-02-01 14:20:00 │
│ lifetime_value   │ number   │ 2024-02-15 09:00:00 │
│ is_vip           │ boolean  │ 2024-03-01 11:45:00 │
└──────────────────┴──────────┴─────────────────────┘
```

## Attribute Types

### Text Attributes

Store string values like names, categories, or IDs.

**Create:**
```bash
$ cakemail attributes create 123 -n "plan_type" -t "text"
$ cakemail attributes create 123 -n "customer_id" -t "text"
$ cakemail attributes create 123 -n "company_name" -t "text"
```

**Use cases:**
- Plan tiers (free, basic, premium, enterprise)
- Customer segments (new, active, lapsed)
- Industry categories (technology, retail, finance)
- Product preferences (red, blue, green)
- External system IDs

**Example values:**
```json
{
  "plan_type": "premium",
  "customer_id": "CUST-12345",
  "company_name": "Acme Corporation",
  "industry": "Technology",
  "preferred_color": "blue"
}
```

### Number Attributes

Store numeric values like counts, amounts, or scores.

**Create:**
```bash
$ cakemail attributes create 123 -n "purchase_count" -t "number"
$ cakemail attributes create 123 -n "lifetime_value" -t "number"
$ cakemail attributes create 123 -n "engagement_score" -t "number"
```

**Use cases:**
- Purchase counts
- Lifetime value (dollars)
- Engagement scores
- Account age (days)
- Product quantities

**Example values:**
```json
{
  "purchase_count": 15,
  "lifetime_value": 2499.99,
  "engagement_score": 87,
  "account_age_days": 365,
  "cart_items": 3
}
```

### Date Attributes

Store dates in ISO format (YYYY-MM-DD).

**Create:**
```bash
$ cakemail attributes create 123 -n "signup_date" -t "date"
$ cakemail attributes create 123 -n "last_purchase" -t "date"
$ cakemail attributes create 123 -n "trial_ends" -t "date"
```

**Use cases:**
- Signup/registration dates
- Last purchase dates
- Trial expiration dates
- Birthday/anniversary dates
- Renewal dates

**Example values:**
```json
{
  "signup_date": "2024-01-15",
  "last_purchase": "2024-03-10",
  "trial_ends": "2024-04-15",
  "birthday": "1990-06-15",
  "renewal_date": "2024-12-31"
}
```

### Boolean Attributes

Store true/false flags.

**Create:**
```bash
$ cakemail attributes create 123 -n "is_vip" -t "boolean"
$ cakemail attributes create 123 -n "opted_in_sms" -t "boolean"
$ cakemail attributes create 123 -n "email_verified" -t "boolean"
```

**Use cases:**
- VIP status
- Feature flags
- Opt-in preferences
- Verification status
- Active/inactive indicators

**Example values:**
```json
{
  "is_vip": true,
  "opted_in_sms": false,
  "email_verified": true,
  "marketing_consent": true,
  "account_locked": false
}
```

## Attribute Naming

### Best Naming Practices

**Good names:**
```bash
$ cakemail attributes create 123 -n "plan_type" -t "text"          # Clear purpose
$ cakemail attributes create 123 -n "last_login_date" -t "date"    # Descriptive
$ cakemail attributes create 123 -n "is_premium" -t "boolean"      # Clear boolean
$ cakemail attributes create 123 -n "total_spent" -t "number"      # Clear metric
```

**Avoid:**
```bash
$ cakemail attributes create 123 -n "pt" -t "text"                 # Too short
$ cakemail attributes create 123 -n "Plan Type" -t "text"          # Spaces
$ cakemail attributes create 123 -n "PLAN" -t "text"               # All caps
$ cakemail attributes create 123 -n "thePlanTypeForCustomer" -t "text"  # Too verbose
```

### Naming Conventions

**Use snake_case:**
```bash
plan_type          # ✓
lifetime_value     # ✓
last_purchase_date # ✓
is_vip            # ✓
```

**Not camelCase or spaces:**
```bash
planType          # ✗
lifetimeValue     # ✗
"last purchase"   # ✗
"Is VIP"          # ✗
```

**Boolean prefix:**
```bash
is_vip            # ✓ Clear it's boolean
has_subscription  # ✓ Clear it's boolean
email_verified    # ✓ Clear it's boolean

vip               # ✗ Not obvious it's boolean
subscription      # ✗ Not obvious it's boolean
```

## Attribute Workflows

### Workflow 1: Customer Data Setup

```bash
#!/bin/bash
# setup-customer-attributes.sh

LIST_ID=123

echo "=== Setting Up Customer Attributes ==="
echo ""

# Basic info
echo "Creating basic customer attributes..."
cakemail attributes create $LIST_ID -n "customer_id" -t "text"
cakemail attributes create $LIST_ID -n "company_name" -t "text"
cakemail attributes create $LIST_ID -n "industry" -t "text"
cakemail attributes create $LIST_ID -n "company_size" -t "text"

# Subscription
echo "Creating subscription attributes..."
cakemail attributes create $LIST_ID -n "plan_type" -t "text"
cakemail attributes create $LIST_ID -n "signup_date" -t "date"
cakemail attributes create $LIST_ID -n "trial_ends" -t "date"
cakemail attributes create $LIST_ID -n "is_paying" -t "boolean"

# Engagement
echo "Creating engagement attributes..."
cakemail attributes create $LIST_ID -n "last_login_date" -t "date"
cakemail attributes create $LIST_ID -n "login_count" -t "number"
cakemail attributes create $LIST_ID -n "feature_usage_score" -t "number"

# Financial
echo "Creating financial attributes..."
cakemail attributes create $LIST_ID -n "lifetime_value" -t "number"
cakemail attributes create $LIST_ID -n "purchase_count" -t "number"
cakemail attributes create $LIST_ID -n "last_purchase_date" -t "date"
cakemail attributes create $LIST_ID -n "average_order_value" -t "number"

echo ""
echo "✓ Attribute setup complete"
echo ""

# Show all attributes
cakemail attributes list $LIST_ID
```

### Workflow 2: E-commerce Attributes

```bash
#!/bin/bash
# setup-ecommerce-attributes.sh

LIST_ID=123

echo "=== E-commerce Attribute Setup ==="
echo ""

# Purchase behavior
cakemail attributes create $LIST_ID -n "total_orders" -t "number"
cakemail attributes create $LIST_ID -n "total_spent" -t "number"
cakemail attributes create $LIST_ID -n "average_order_value" -t "number"
cakemail attributes create $LIST_ID -n "last_order_date" -t "date"
cakemail attributes create $LIST_ID -n "first_order_date" -t "date"

# Preferences
cakemail attributes create $LIST_ID -n "favorite_category" -t "text"
cakemail attributes create $LIST_ID -n "preferred_brand" -t "text"
cakemail attributes create $LIST_ID -n "size_preference" -t "text"

# Loyalty
cakemail attributes create $LIST_ID -n "loyalty_points" -t "number"
cakemail attributes create $LIST_ID -n "loyalty_tier" -t "text"
cakemail attributes create $LIST_ID -n "is_vip" -t "boolean"

# Cart behavior
cakemail attributes create $LIST_ID -n "cart_abandoned_date" -t "date"
cakemail attributes create $LIST_ID -n "cart_value" -t "number"
cakemail attributes create $LIST_ID -n "has_active_cart" -t "boolean"

echo "✓ E-commerce attributes created"
```

### Workflow 3: SaaS Attributes

```bash
#!/bin/bash
# setup-saas-attributes.sh

LIST_ID=123

echo "=== SaaS Attribute Setup ==="
echo ""

# Account
cakemail attributes create $LIST_ID -n "account_id" -t "text"
cakemail attributes create $LIST_ID -n "plan_name" -t "text"
cakemail attributes create $LIST_ID -n "mrr" -t "number"
cakemail attributes create $LIST_ID -n "arr" -t "number"

# Subscription lifecycle
cakemail attributes create $LIST_ID -n "trial_start_date" -t "date"
cakemail attributes create $LIST_ID -n "trial_end_date" -t "date"
cakemail attributes create $LIST_ID -n "subscription_start" -t "date"
cakemail attributes create $LIST_ID -n "next_billing_date" -t "date"
cakemail attributes create $LIST_ID -n "is_trial" -t "boolean"
cakemail attributes create $LIST_ID -n "is_paying" -t "boolean"

# Usage
cakemail attributes create $LIST_ID -n "last_login" -t "date"
cakemail attributes create $LIST_ID -n "login_count_30d" -t "number"
cakemail attributes create $LIST_ID -n "feature_adoption_score" -t "number"
cakemail attributes create $LIST_ID -n "active_users" -t "number"

# Health
cakemail attributes create $LIST_ID -n "health_score" -t "number"
cakemail attributes create $LIST_ID -n "churn_risk" -t "text"
cakemail attributes create $LIST_ID -n "support_tickets_30d" -t "number"

echo "✓ SaaS attributes created"
```

### Workflow 4: Attribute Audit

```bash
#!/bin/bash
# audit-attributes.sh

LIST_ID=123

echo "=== Attribute Audit ==="
echo ""

# Get all attributes
ATTRIBUTES=$(cakemail attributes list $LIST_ID -f json | jq -r '.data[] | "\(.name):\(.type)"')

echo "Attribute | Type | Usage (%)"
echo "----------|------|----------"

# Check usage for each attribute
for ATTR in $ATTRIBUTES; do
  NAME=$(echo "$ATTR" | cut -d: -f1)
  TYPE=$(echo "$ATTR" | cut -d: -f2)

  # Get contacts with this attribute set
  TOTAL=$(cakemail contacts list $LIST_ID -f json | jq '.count')

  # Note: This is simplified - actual implementation would need to check each contact
  # For demonstration purposes
  USAGE="~%"

  printf "%-20s | %-8s | %s\n" "$NAME" "$TYPE" "$USAGE"
done

echo ""
echo "Review attributes with low usage for potential removal"
```

### Workflow 5: Attribute Migration

```bash
#!/bin/bash
# migrate-attributes.sh

SOURCE_LIST=123
TARGET_LIST=124

echo "=== Migrating Attributes ==="
echo "From: List $SOURCE_LIST"
echo "To: List $TARGET_LIST"
echo ""

# Get source attributes
ATTRIBUTES=$(cakemail attributes list $SOURCE_LIST -f json)

echo "$ATTRIBUTES" | jq -r '.data[] | "\(.name):\(.type)"' | while IFS=: read NAME TYPE; do
  echo "Creating: $NAME ($TYPE)"

  # Create in target list
  cakemail attributes create $TARGET_LIST -n "$NAME" -t "$TYPE" 2>/dev/null

  if [ $? -eq 0 ]; then
    echo "  ✓ Created"
  else
    echo "  ⚠️  Already exists or error"
  fi
done

echo ""
echo "✓ Attribute migration complete"
```

## Using Attributes with Contacts

### Add Contact with Attributes

```bash
$ cakemail contacts add 123 \
  -e "customer@example.com" \
  -f "Jane" \
  -l "Doe" \
  -d '{
    "plan_type": "premium",
    "signup_date": "2024-03-15",
    "is_vip": true,
    "lifetime_value": 599.99,
    "purchase_count": 8
  }'
```

### Update Contact Attributes

```bash
# Update single attribute
$ cakemail contacts update 123 501 -d '{"plan_type":"enterprise"}'

# Update multiple attributes
$ cakemail contacts update 123 501 -d '{
  "plan_type": "enterprise",
  "is_vip": true,
  "lifetime_value": 1299.99
}'
```

### Query by Attributes

```bash
# Find premium users
$ cakemail contacts list 123 --filter "custom_attributes.plan_type==premium"

# Find VIP customers
$ cakemail contacts list 123 --filter "custom_attributes.is_vip==true"

# Find high-value customers
$ cakemail contacts list 123 --filter "custom_attributes.lifetime_value>=1000"

# Find recent signups
$ cakemail contacts list 123 --filter "custom_attributes.signup_date>=2024-03-01"
```

## Segmentation with Attributes

### Create Segments Based on Attributes

```bash
# Premium plan segment
$ cakemail segments create 123 -n "Premium Users" -c '{
  "match": "all",
  "rules": [
    {"field": "custom_attributes.plan_type", "operator": "equals", "value": "premium"}
  ]
}'

# High-value customers
$ cakemail segments create 123 -n "High Value" -c '{
  "match": "all",
  "rules": [
    {"field": "custom_attributes.lifetime_value", "operator": "greater_than", "value": "1000"}
  ]
}'

# At-risk trial users
$ cakemail segments create 123 -n "Trial Ending Soon" -c '{
  "match": "all",
  "rules": [
    {"field": "custom_attributes.is_trial", "operator": "equals", "value": "true"},
    {"field": "custom_attributes.trial_ends", "operator": "less_than", "value": "2024-04-01"}
  ]
}'

# Engaged VIPs
$ cakemail segments create 123 -n "Engaged VIPs" -c '{
  "match": "all",
  "rules": [
    {"field": "custom_attributes.is_vip", "operator": "equals", "value": "true"},
    {"field": "last_open_date", "operator": "greater_than", "value": "2024-03-01"}
  ]
}'
```

## Campaign Personalization

### Use Attributes in Campaigns

Campaign HTML with merge tags:

```html
<p>Hi {{first_name}},</p>

<p>As a {{custom_attributes.plan_type}} member, you have access to:</p>

{{#if custom_attributes.is_vip}}
  <p><strong>VIP Benefits:</strong></p>
  <ul>
    <li>Priority Support</li>
    <li>Exclusive Features</li>
    <li>Early Access</li>
  </ul>
{{/if}}

<p>You've been with us since {{custom_attributes.signup_date}}.</p>

<p>Your lifetime savings: ${{custom_attributes.lifetime_value}}</p>

<p>Thanks for {{custom_attributes.purchase_count}} purchases!</p>
```

### Conditional Content

```html
{{#if custom_attributes.plan_type == "free"}}
  <div class="upgrade-prompt">
    <h2>Upgrade to Premium</h2>
    <p>Get more features for just $9.99/month</p>
    <a href="https://example.com/upgrade">Upgrade Now</a>
  </div>
{{/if}}

{{#if custom_attributes.cart_abandoned_date}}
  <div class="cart-reminder">
    <h2>You Left Items in Your Cart</h2>
    <p>Complete your purchase and save {{custom_attributes.cart_value}}!</p>
    <a href="https://example.com/cart">Return to Cart</a>
  </div>
{{/if}}
```

## Attribute Best Practices

### 1. Plan Schema First

```bash
# Document your attribute schema
cat > attribute-schema.md << 'EOF'
# Customer Attributes Schema

## Account
- customer_id (text): External CRM ID
- account_type (text): individual | business
- signup_date (date): Registration date

## Subscription
- plan_type (text): free | basic | premium | enterprise
- is_paying (boolean): Active paid subscription
- mrr (number): Monthly recurring revenue

## Engagement
- last_login (date): Last login date
- login_count_30d (number): Logins in last 30 days
- health_score (number): 0-100 engagement score

## Financial
- lifetime_value (number): Total revenue
- purchase_count (number): Total orders
- average_order_value (number): AOV
EOF
```

### 2. Use Consistent Types

```bash
# All dates as date type
$ cakemail attributes create 123 -n "signup_date" -t "date"
$ cakemail attributes create 123 -n "last_purchase" -t "date"
$ cakemail attributes create 123 -n "trial_ends" -t "date"

# All monetary values as number
$ cakemail attributes create 123 -n "lifetime_value" -t "number"
$ cakemail attributes create 123 -n "monthly_spend" -t "number"
$ cakemail attributes create 123 -n "cart_value" -t "number"

# All flags as boolean
$ cakemail attributes create 123 -n "is_vip" -t "boolean"
$ cakemail attributes create 123 -n "email_verified" -t "boolean"
$ cakemail attributes create 123 -n "marketing_consent" -t "boolean"
```

### 3. Validate Data Before Setting

```bash
#!/bin/bash
# validate-and-set.sh

LIST_ID=123
CONTACT_ID=501
PLAN="$1"

# Validate plan type
VALID_PLANS=("free" "basic" "premium" "enterprise")

if [[ ! " ${VALID_PLANS[@]} " =~ " ${PLAN} " ]]; then
  echo "❌ Invalid plan: $PLAN"
  echo "Valid plans: ${VALID_PLANS[@]}"
  exit 1
fi

# Set attribute
cakemail contacts update $LIST_ID $CONTACT_ID -d "{\"plan_type\":\"$PLAN\"}"
echo "✓ Plan set to: $PLAN"
```

### 4. Keep Attributes Synchronized

```bash
#!/bin/bash
# sync-from-crm.sh

LIST_ID=123

echo "=== Syncing from CRM ==="
echo ""

# Fetch from your CRM (example)
CUSTOMERS=$(curl -s "https://api.yourcrm.com/customers")

echo "$CUSTOMERS" | jq -c '.[]' | while read CUSTOMER; do
  EMAIL=$(echo "$CUSTOMER" | jq -r '.email')
  PLAN=$(echo "$CUSTOMER" | jq -r '.plan')
  LTV=$(echo "$CUSTOMER" | jq -r '.lifetime_value')
  LAST_PURCHASE=$(echo "$CUSTOMER" | jq -r '.last_purchase_date')

  # Find contact
  CONTACTS=$(cakemail contacts list $LIST_ID --filter "email==$EMAIL" -f json)
  CONTACT_ID=$(echo "$CONTACTS" | jq -r '.data[0].id')

  if [ "$CONTACT_ID" != "null" ]; then
    # Update attributes
    cakemail contacts update $LIST_ID $CONTACT_ID -d "{
      \"plan_type\": \"$PLAN\",
      \"lifetime_value\": $LTV,
      \"last_purchase_date\": \"$LAST_PURCHASE\"
    }"
    echo "  Synced: $EMAIL"
  fi
done

echo ""
echo "✓ CRM sync complete"
```

### 5. Remove Unused Attributes

```bash
#!/bin/bash
# cleanup-unused.sh

LIST_ID=123

echo "=== Cleaning Up Unused Attributes ==="
echo ""

# List of deprecated attributes
DEPRECATED=(
  "old_field"
  "legacy_score"
  "temp_attribute"
)

for ATTR in "${DEPRECATED[@]}"; do
  echo "Removing: $ATTR"
  cakemail attributes delete $LIST_ID $ATTR --force
done

echo ""
echo "✓ Cleanup complete"
```

## Troubleshooting

### Attribute Not Appearing

**Problem:** Created attribute but it's not showing

**Solution:**
```bash
# Verify attribute was created
$ cakemail attributes list 123

# Check specific attribute
$ cakemail attributes get 123 plan_type

# If not found, recreate
$ cakemail attributes create 123 -n "plan_type" -t "text"
```

### Cannot Set Attribute Value

**Problem:** Attribute value not saving on contact

**Solutions:**
```bash
# 1. Ensure attribute exists
$ cakemail attributes list 123

# 2. Check data type matches
$ cakemail attributes get 123 lifetime_value
# If type is "number", use number not string:
$ cakemail contacts update 123 501 -d '{"lifetime_value":599.99}'  # ✓
$ cakemail contacts update 123 501 -d '{"lifetime_value":"599.99"}'  # ✗

# 3. Check JSON format
$ cakemail contacts update 123 501 -d '{"plan":"premium"}'  # ✓ Valid JSON
$ cakemail contacts update 123 501 -d '{plan:premium}'  # ✗ Invalid JSON
```

### Wrong Data Type

**Problem:** Created attribute with wrong type

**Solution:**
```bash
# Type cannot be changed
# Must delete and recreate

# 1. Export contacts with old attribute
$ cakemail contacts export 123

# 2. Delete old attribute
$ cakemail attributes delete 123 old_name --force

# 3. Create with correct type
$ cakemail attributes create 123 -n "new_name" -t "number"

# 4. Re-import contacts with new attribute
# (Update CSV with new column)
$ cakemail contacts import 123 --file updated.csv
```

### Date Format Issues

**Problem:** Dates not saving correctly

**Solution:**
```bash
# Use ISO format: YYYY-MM-DD
$ cakemail contacts update 123 501 -d '{"signup_date":"2024-03-15"}'  # ✓

# Wrong formats:
# "03/15/2024"  # ✗ US format
# "15/03/2024"  # ✗ European format
# "March 15, 2024"  # ✗ Text format

# Convert if needed
DATE="03/15/2024"
ISO_DATE=$(date -d "$DATE" +%Y-%m-%d)  # Converts to 2024-03-15
```

## Best Practices Summary

1. **Plan schema first** - Design attributes before creating
2. **Use descriptive names** - Clear, self-explanatory names
3. **Choose correct types** - Match data type to usage
4. **Validate input** - Check values before setting
5. **Document attributes** - Keep schema documentation
6. **Consistent naming** - Use snake_case
7. **Sync regularly** - Keep attributes updated from source systems
8. **Remove unused** - Delete deprecated attributes
9. **Test thoroughly** - Verify attributes work in campaigns
10. **Monitor usage** - Track which attributes are actually used

