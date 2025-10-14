# Senders

Manage and verify sender email addresses for transactional emails and campaigns.

## Overview

Senders are verified email addresses you can send from. Before sending emails, you must:
1. **Create a sender** with email and name
2. **Verify the email** by clicking confirmation link
3. **Use verified sender** in emails/campaigns

**Why verification is required:**
- Prevents email spoofing
- Improves deliverability
- Reduces spam complaints
- Required by email providers

## Sender Commands

### List Senders

```bash
cakemail senders list [options]
```

**Options:**
- `-l, --limit <number>` - Results per page
- `-p, --page <number>` - Page number
- `--sort <sort>` - Sort order
- `--filter <filter>` - Filter results

**Examples:**
```bash
# All senders
cakemail senders list

# Confirmed senders only
cakemail senders list --filter "confirmed==true"

# Sort by email
cakemail senders list --sort "+email"

# Unconfirmed senders
cakemail senders list --filter "confirmed==false"
```

### Get Sender Details

```bash
cakemail senders get <sender-id>
```

**Example:**
```bash
cakemail senders get abc123
```

**Output:**
```json
{
  "id": "abc123",
  "name": "John Doe",
  "email": "john@example.com",
  "confirmed": true,
  "confirmed_on": "2024-06-15T10:00:00Z",
  "created_on": "2024-06-15T09:50:00Z"
}
```

### Create Sender

```bash
cakemail senders create \
  -n "Sender Name" \
  -e "sender@example.com"
```

**Required Options:**
- `-n, --name <name>` - Display name for sender
- `-e, --email <email>` - Email address (must be valid)

**Examples:**
```bash
# Personal sender
cakemail senders create \
  -n "John Doe" \
  -e "john@example.com"

# Business sender
cakemail senders create \
  -n "Acme Support" \
  -e "support@acme.com"

# No-reply sender
cakemail senders create \
  -n "Acme Notifications" \
  -e "noreply@acme.com"
```

**After creation:**
1. Confirmation email sent to the address
2. Click confirmation link in email
3. Sender becomes verified

### Update Sender

```bash
cakemail senders update <sender-id> [options]
```

**Options:**
- `-n, --name <name>` - Update display name
- `-e, --email <email>` - Update email (requires re-verification)

**Examples:**
```bash
# Update name
cakemail senders update abc123 -n "John Smith"

# Update email (triggers new confirmation)
cakemail senders update abc123 -e "john.smith@example.com"

# Update both
cakemail senders update abc123 \
  -n "John Smith" \
  -e "john.smith@example.com"
```

**Note:** Changing email requires re-verification.

### Confirm Sender

Verify sender using confirmation ID from email:

```bash
cakemail senders confirm <confirmation-id>
```

**How to get confirmation ID:**
1. Create sender
2. Check email inbox
3. Click confirmation link or copy ID from link
4. Use ID with confirm command

**Example:**
```bash
cakemail senders confirm conf_abc123xyz456
```

### Resend Confirmation

If you didn't receive the confirmation email:

```bash
cakemail senders resend-confirmation <sender-id>
```

**Example:**
```bash
cakemail senders resend-confirmation abc123
```

### Delete Sender

```bash
cakemail senders delete <sender-id> [--force]
```

**Examples:**
```bash
# Interactive confirmation
cakemail senders delete abc123

# Skip confirmation
cakemail senders delete abc123 --force
```

**Warning:** Cannot delete senders used in active campaigns.

---

## Verification Process

### Step-by-Step

**1. Create sender:**
```bash
cakemail senders create \
  -n "John Doe" \
  -e "john@example.com"
```

**2. Check email:**
- Email sent to `john@example.com`
- Subject: "Confirm your sender email"
- Contains confirmation link

**3. Confirm (Option A - Click link):**
- Click link in email
- Redirects to confirmation page
- Sender automatically verified

**3. Confirm (Option B - Use CLI):**
```bash
# Get confirmation ID from email
cakemail senders confirm conf_abc123xyz456
```

**4. Verify confirmation:**
```bash
cakemail senders get abc123
# Check: "confirmed": true
```

### Troubleshooting Verification

**Didn't receive email:**
```bash
# Resend confirmation
cakemail senders resend-confirmation abc123

# Check spam folder
# Check email address is correct
# Wait a few minutes
```

**Confirmation link expired:**
```bash
# Resend confirmation (generates new link)
cakemail senders resend-confirmation abc123
```

**Wrong email address:**
```bash
# Update to correct email
cakemail senders update abc123 -e "correct@example.com"

# New confirmation sent to correct address
```

---

## Using Senders

### In Transactional Emails

```bash
cakemail emails send \
  -t recipient@example.com \
  -s "Subject" \
  --html "<p>Content</p>" \
  --from-email john@example.com \
  --from-name "John Doe"
```

### In Campaigns

```bash
cakemail campaigns create \
  -n "Campaign" \
  -l <list-id> \
  -s <sender-id> \
  -t <template-id>
```

### Default Sender

Set a default sender in your account settings (via dashboard), or always specify with `--from-email`.

---

## Sender Management

### Organizing Senders

**By purpose:**
- Marketing: `marketing@example.com`
- Transactional: `orders@example.com`, `support@example.com`
- Notifications: `noreply@example.com`

**By brand:**
- Main brand: `hello@acme.com`
- Sub-brands: `hello@acmewidgets.com`

### Best Practices

#### 1. Verify All Senders Immediately

```bash
# Create sender
ID=$(cakemail senders create -n "Support" -e "support@example.com" | jq -r '.id')

# Check email and confirm right away
cakemail senders confirm <confirmation-id>
```

#### 2. Use Descriptive Names

```bash
# ✅ Good
cakemail senders create -n "Acme Support Team" -e "support@acme.com"
cakemail senders create -n "Acme Orders" -e "orders@acme.com"

# ❌ Avoid
cakemail senders create -n "Sender 1" -e "support@acme.com"
```

#### 3. Separate Transactional and Marketing

```bash
# Transactional
cakemail senders create -n "Orders" -e "orders@example.com"
cakemail senders create -n "Support" -e "support@example.com"

# Marketing
cakemail senders create -n "Newsletter" -e "news@example.com"
```

#### 4. Don't Delete Active Senders

```bash
# Check usage first
cakemail campaigns list --filter "sender_id==abc123"

# If campaigns exist, don't delete
```

#### 5. Keep Senders List Clean

```bash
# List unconfirmed senders
cakemail senders list --filter "confirmed==false"

# Delete or resend confirmation
```

---

## Practical Examples

### Example 1: Setup New Domain

```bash
#!/bin/bash
# setup-senders.sh - Setup senders for new domain

DOMAIN="example.com"

# Create senders
cakemail senders create -n "No Reply" -e "noreply@$DOMAIN"
cakemail senders create -n "Support" -e "support@$DOMAIN"
cakemail senders create -n "Orders" -e "orders@$DOMAIN"
cakemail senders create -n "Marketing" -e "marketing@$DOMAIN"

echo "Senders created. Check email to verify."
```

### Example 2: Verify All Pending

```bash
#!/bin/bash
# verify-pending.sh - List unverified senders

echo "Unverified senders:"
cakemail -f table senders list --filter "confirmed==false"

echo ""
echo "Resend confirmations? (y/n)"
read -r response

if [ "$response" = "y" ]; then
  # Get IDs of unconfirmed senders
  IDS=$(cakemail -f json senders list --filter "confirmed==false" | jq -r '.data[].id')

  for ID in $IDS; do
    echo "Resending confirmation for $ID..."
    cakemail senders resend-confirmation "$ID"
  done

  echo "Confirmation emails sent!"
fi
```

### Example 3: Audit Senders

```bash
#!/bin/bash
# audit-senders.sh - Check sender status

echo "=== Sender Audit ==="
echo ""

TOTAL=$(cakemail -f json senders list --limit 1 | jq '.total')
CONFIRMED=$(cakemail -f json senders list --filter "confirmed==true" --limit 1 | jq '.total')
UNCONFIRMED=$(cakemail -f json senders list --filter "confirmed==false" --limit 1 | jq '.total')

echo "Total senders: $TOTAL"
echo "Confirmed: $CONFIRMED"
echo "Unconfirmed: $UNCONFIRMED"
echo ""

if [ "$UNCONFIRMED" -gt 0 ]; then
  echo "Unconfirmed senders:"
  cakemail -f compact senders list --filter "confirmed==false"
fi
```

---

## Domain Configuration

### DNS Setup

For best deliverability, configure these DNS records:

**SPF Record:**
```
v=spf1 include:_spf.cakemail.com ~all
```

**DKIM Record:**
Configure via Cakemail dashboard

**DMARC Record:**
```
v=DMARC1; p=none; rua=mailto:dmarc@example.com
```

**Check DNS:**
```bash
# Check SPF
dig +short TXT example.com | grep spf

# Check DKIM
dig +short TXT default._domainkey.example.com
```

---

## Troubleshooting

### Cannot Send Emails

**Check sender verification:**
```bash
cakemail senders list --filter "email==sender@example.com"
# Verify: "confirmed": true
```

**If unconfirmed:**
```bash
cakemail senders resend-confirmation <id>
```

### "Sender not found" Error

**Verify sender exists:**
```bash
cakemail senders list
```

**Check sender ID:**
```bash
# Get correct ID
ID=$(cakemail senders list --filter "email==sender@example.com" | jq -r '.data[0].id')
echo $ID
```

### Confirmation Email Not Arriving

**Possible causes:**
1. Spam folder - Check spam/junk
2. Email typo - Verify address is correct
3. Email server delay - Wait 5-10 minutes
4. Blocked email - Check email server logs

**Solutions:**
```bash
# Verify email address
cakemail senders get <id>

# Update if wrong
cakemail senders update <id> -e "correct@example.com"

# Resend
cakemail senders resend-confirmation <id>
```

---

