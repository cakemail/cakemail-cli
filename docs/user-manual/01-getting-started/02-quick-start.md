# Quick Start

Get up and running with the Cakemail CLI in 15 minutes. This tutorial walks you through sending your first transactional email and creating your first campaign.

## Prerequisites

Before starting, ensure you have:

1. **Installed the CLI** - See [Installation](/en/cli/getting-started/installation/)
2. **Configured authentication** - See [Authentication](/en/cli/getting-started/authentication/)
3. **Valid Cakemail credentials**

## Verify Installation

First, verify the CLI is installed and working:

```bash
# Check version
cakemail --version

# View help
cakemail --help

# Test authentication
cakemail account current
```

If these commands work, you're ready to go!

---

## Part 1: Send Your First Transactional Email

Let's send a simple transactional email using the Email API v2.

### Step 1: Verify Sender Email

Before sending emails, you need a verified sender email address.

**List existing senders:**
```bash
cakemail senders list
```

**If you don't have a sender, create one:**
```bash
cakemail senders create \
  -n "Your Name" \
  -e "your-email@example.com"
```

**Important**: Check your email inbox and click the confirmation link to verify the sender address.

**Check confirmation status:**
```bash
cakemail senders list
```

Look for `confirmed: true` in the output.

### Step 2: Send a Simple Email

Send your first transactional email with HTML content:

```bash
cakemail emails send \
  -t recipient@example.com \
  -s "My First Cakemail Email" \
  --html "<h1>Hello from Cakemail!</h1><p>This is my first email sent via the CLI.</p>" \
  --from-email your-email@example.com \
  --from-name "Your Name"
```

**Expected Output:**
```json
{
  "id": "abc123def456",
  "status": "queued",
  "to": "recipient@example.com",
  "subject": "My First Cakemail Email",
  "created_on": "2024-06-15T10:00:00Z"
}
```

### Step 3: Check Email Status

Get the status of your sent email:

```bash
cakemail emails get abc123def456
```

**Tip**: Replace `abc123def456` with the actual email ID from the previous step.

### Step 4: Send Email with Tracking

Send an email with open and click tracking enabled:

```bash
cakemail emails send \
  -t recipient@example.com \
  -s "Tracked Email" \
  --html '<h1>Hello!</h1><p>Click <a href="https://example.com">here</a>.</p>' \
  --from-email your-email@example.com \
  --from-name "Your Name" \
  --tracking \
  --tags "tutorial,test"
```

**Tracking features:**
- `--tracking`: Enables open and click tracking
- `--tags`: Categorize emails for filtering in reports

---

## Part 2: Create Your First Campaign

Now let's create and schedule a campaign to multiple contacts.

### Step 1: Create a Contact List

Create a list to hold your contacts:

```bash
cakemail lists create \
  -n "Newsletter Subscribers" \
  -l en
```

**Expected Output:**
```json
{
  "id": 12345,
  "name": "Newsletter Subscribers",
  "language": "en",
  "status": "active",
  "created_on": "2024-06-15T10:05:00Z"
}
```

**Note the list ID** - you'll need it for the next steps.

### Step 2: Add Contacts to the List

Add some contacts to your list:

```bash
# Add first contact
cakemail contacts add 12345 \
  -e "contact1@example.com" \
  -f "John" \
  -l "Doe"

# Add second contact
cakemail contacts add 12345 \
  -e "contact2@example.com" \
  -f "Jane" \
  -l "Smith"

# Add third contact with custom data
cakemail contacts add 12345 \
  -e "contact3@example.com" \
  -f "Bob" \
  -l "Johnson" \
  -d '{"company":"Acme Inc"}'
```

**Verify contacts were added:**
```bash
cakemail -f table contacts list 12345
```

### Step 3: Create an Email Template

Create a template for your campaign:

```bash
cakemail templates create \
  -n "Newsletter Template" \
  --html '<html><body><h1>Monthly Newsletter</h1><p>Welcome {{first_name}}!</p><p>Here are this month's updates...</p></body></html>' \
  --subject "Monthly Newsletter - June 2024"
```

**Expected Output:**
```json
{
  "id": 789,
  "name": "Newsletter Template",
  "subject": "Monthly Newsletter - June 2024",
  "created_on": "2024-06-15T10:10:00Z"
}
```

**Note the template ID** for the next step.

### Step 4: Create a Campaign

Now create a campaign linking your list, sender, and template:

```bash
cakemail campaigns create \
  -n "June Newsletter" \
  -l 12345 \
  -s <sender-id> \
  -t 789 \
  --subject "Monthly Newsletter - June 2024"
```

**Get your sender ID:**
```bash
cakemail senders list
```

**Expected Output:**
```json
{
  "id": 98765,
  "name": "June Newsletter",
  "status": "draft",
  "list_id": 12345,
  "sender_id": 456,
  "template_id": 789,
  "created_on": "2024-06-15T10:15:00Z"
}
```

### Step 5: Send a Test Email

Before scheduling, send a test to verify everything looks good:

```bash
cakemail campaigns test 98765 -e your-email@example.com
```

Check your inbox for the test email!

### Step 6: Schedule the Campaign

Schedule the campaign to send in the future:

```bash
# Schedule for tomorrow at 10 AM (adjust timezone as needed)
cakemail campaigns schedule 98765 -d "2024-06-16T10:00:00Z"
```

**Expected Output:**
```json
{
  "id": 98765,
  "name": "June Newsletter",
  "status": "scheduled",
  "scheduled_for": "2024-06-16T10:00:00Z"
}
```

### Step 7: Check Campaign Status

View your campaign details:

```bash
cakemail -f table campaigns get 98765
```

**List all campaigns:**
```bash
cakemail -f table campaigns list
```

---

## Part 3: View Analytics

After your email or campaign is sent, view analytics.

### Email API Analytics

View statistics for transactional emails:

```bash
# View summary
cakemail reports emails-summary

# View detailed stats for a date range
cakemail reports emails --from 2024-06-01 --to 2024-06-30
```

### Campaign Analytics

View analytics for your campaign:

```bash
# Campaign overview
cakemail reports campaign 98765

# Link-level analytics
cakemail reports campaign-links 98765
```

**Example Output:**
```json
{
  "campaign_id": 98765,
  "delivered": 3,
  "opened": 2,
  "clicked": 1,
  "bounced": 0,
  "unsubscribed": 0,
  "open_rate": 0.67,
  "click_rate": 0.33
}
```

---

## Part 4: Cleanup (Optional)

If this was just a test, clean up the resources:

```bash
# Unschedule campaign (if still scheduled)
cakemail campaigns unschedule 98765

# Delete campaign
cakemail campaigns delete 98765 --force

# Delete template
cakemail templates delete 789 --force

# Delete list (this also deletes contacts)
cakemail lists delete 12345 --force
```

**Warning**: `--force` flag skips confirmation prompts. Use carefully!

---

## Common Tasks Cheat Sheet

### Sending Emails

```bash
# Simple email
cakemail emails send -t user@example.com -s "Subject" --html "<p>Content</p>"

# With tracking
cakemail emails send -t user@example.com -s "Subject" --html "<p>Content</p>" --tracking

# Using template
cakemail emails send -t user@example.com -s "Subject" --template-id 123
```

### Managing Campaigns

```bash
# Create campaign
cakemail campaigns create -n "Campaign Name" -l <list-id> -s <sender-id> -t <template-id>

# Schedule campaign
cakemail campaigns schedule <id> -d "2024-12-25T10:00:00Z"

# Test campaign
cakemail campaigns test <id> -e test@example.com

# View campaign
cakemail campaigns get <id>
```

### Managing Contacts

```bash
# Create list
cakemail lists create -n "List Name" -l en

# Add contact
cakemail contacts add <list-id> -e "user@example.com" -f "First" -l "Last"

# List contacts
cakemail contacts list <list-id>

# Export contacts
cakemail contacts export <list-id> --format csv
```

### Viewing Analytics

```bash
# Campaign analytics
cakemail reports campaign <campaign-id>

# Email API stats
cakemail reports emails-summary

# Account overview
cakemail reports account
```

---

## Troubleshooting

### Email Not Sending

1. **Check sender verification**: `cakemail senders list`
2. **Verify authentication**: `cakemail account current`
3. **Check email status**: `cakemail emails get <email-id>`

### Campaign Not Scheduling

1. **Verify campaign exists**: `cakemail campaigns get <id>`
2. **Check campaign status**: Must be in `draft` status
3. **Validate datetime format**: Use ISO 8601 format (e.g., `2024-12-25T10:00:00Z`)

### Contacts Not Adding

1. **Verify list exists**: `cakemail lists get <list-id>`
2. **Check email format**: Must be valid email address
3. **Review error message**: CLI provides detailed error messages

For more troubleshooting, see [Troubleshooting](/en/cli/troubleshooting/).

---

## Get Help

- **Command help**: `cakemail <command> --help`
- **Full documentation**: Browse this user manual
- **Issues**: [GitHub Issues](https://github.com/cakemail-org/cakemail-cli/issues)

Happy emailing with Cakemail CLI!
