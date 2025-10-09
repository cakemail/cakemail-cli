# Cakemail CLI

Official command-line interface for the Cakemail API.

## Installation

```bash
npm install -g @cakemail-org/cli
```

Or run directly with npx:

```bash
npx @cakemail-org/cli --help
```

## Configuration

Set your Cakemail credentials using environment variables:

```bash
# Option 1: Use access token
export CAKEMAIL_ACCESS_TOKEN=your_access_token

# Option 2: Use email/password
export CAKEMAIL_EMAIL=your@email.com
export CAKEMAIL_PASSWORD=your_password

# Optional: Set default output format
export CAKEMAIL_OUTPUT_FORMAT=compact  # json, table, or compact
```

Or create a `.env` file in your project directory:

```bash
# Authentication (choose one method)
CAKEMAIL_EMAIL=your@email.com
CAKEMAIL_PASSWORD=your_password
# OR
# CAKEMAIL_ACCESS_TOKEN=your_access_token

# Optional: Default output format (json, table, compact)
CAKEMAIL_OUTPUT_FORMAT=compact

# Optional: API base URL (defaults to https://api.cakemail.dev)
# CAKEMAIL_API_BASE=https://api.cakemail.dev
```

## Usage

```bash
cakemail [options] <command>
```

### Global Options

- `-f, --format <format>` - Output format: `json`, `table`, or `compact` (default: `json`)
- `--access-token <token>` - Override access token from environment
- `--email <email>` - Override email from environment
- `--password <password>` - Override password from environment

### Output Formats

The CLI supports three output formats. You can set a default in your `.env` file with `CAKEMAIL_OUTPUT_FORMAT` or override it per-command with the `-f` flag.

**Priority:** CLI flag (`-f`) > Environment variable (`CAKEMAIL_OUTPUT_FORMAT`) > Default (`json`)

**JSON** (default) - Full structured data output:
```bash
cakemail campaigns list
cakemail -f json campaigns list
```

**Table** - Formatted table view with key fields:
```bash
cakemail -f table campaigns list
cakemail -f table templates list
```

**Compact** - One-line summary per item:
```bash
cakemail -f compact lists list
cakemail -f compact contacts list 123
```

**Set a default format:**
```bash
# In your .env file
CAKEMAIL_OUTPUT_FORMAT=compact

# Now all commands use compact by default
cakemail campaigns list         # Uses compact
cakemail -f json campaigns list # Override to JSON
```

### Commands

#### Email API v2

```bash
# Send an email with HTML content
cakemail emails send -t recipient@example.com -s "Subject" --html "<h1>Hello</h1>"

# Send an email with HTML file
cakemail emails send -t recipient@example.com -s "Subject" --html-file email.html

# Send an email using a template
cakemail emails send -t recipient@example.com -s "Subject" --template-id 123 --params '{"name":"John"}'

# Send with custom sender
cakemail emails send \
  -t recipient@example.com \
  -s "Subject" \
  --html "<p>Content</p>" \
  --from-email sender@example.com \
  --from-name "John Doe" \
  --reply-to reply@example.com

# Send with tracking and tags
cakemail emails send \
  -t recipient@example.com \
  -s "Subject" \
  --html "<p>Content</p>" \
  --tracking \
  --tags "newsletter,promo"

# Get email details
cakemail emails get <email-id>

# Render email HTML
cakemail emails render <email-id>
cakemail emails render <email-id> --as-submitted --tracking
```

#### Templates

```bash
# List all templates
cakemail templates list [options]
  -l, --limit <number>    Limit results
  -p, --page <number>     Page number
  -f, --filter <filter>   Filter (e.g., "name==Newsletter")
  -s, --sort <sort>       Sort (e.g., "+name", "-created_on")

# Get template details
cakemail templates get <id>

# Create a template
cakemail templates create -n "My Template" --html-file template.html
  -n, --name <name>         Template name (required)
  --html <html>             HTML content
  --html-file <path>        Path to HTML file
  --text <text>             Plain text content
  --text-file <path>        Path to text file
  --subject <subject>       Default email subject
  --tags <tags>             Comma-separated tags

# Update a template
cakemail templates update <id> [options]
  -n, --name <name>         Template name
  --html <html>             HTML content
  --html-file <path>        Path to HTML file
  --text <text>             Plain text content
  --text-file <path>        Path to text file
  --subject <subject>       Default email subject
  --tags <tags>             Comma-separated tags

# Render a template
cakemail templates render <id>

# Delete template
cakemail templates delete <id> --force
```

#### Campaigns

```bash
# List all campaigns
cakemail campaigns list [options]
  -s, --status <status>   Filter by status
  -l, --limit <number>    Limit results
  -p, --page <number>     Page number

# Get campaign details
cakemail campaigns get <id>

# Create a campaign
cakemail campaigns create -n "My Campaign" -l <list-id> [options]
  -n, --name <name>         Campaign name (required)
  -l, --list-id <id>        List ID (required)
  -s, --sender-id <id>      Sender ID
  -t, --template-id <id>    Template ID
  --subject <subject>       Email subject

# Update a campaign
cakemail campaigns update <id> [options]
  -n, --name <name>         Campaign name
  -l, --list-id <id>        List ID
  -s, --sender-id <id>      Sender ID
  -t, --template-id <id>    Template ID
  --subject <subject>       Email subject

# Schedule a campaign
cakemail campaigns schedule <id> -d <datetime>
  -d, --date <datetime>   Schedule datetime (ISO 8601)

# Reschedule a campaign
cakemail campaigns reschedule <id> -d <datetime>
  -d, --date <datetime>   New schedule datetime (ISO 8601)

# Unschedule a campaign
cakemail campaigns unschedule <id>

# Send test email
cakemail campaigns test <id> -e <email>
  -e, --email <email>     Recipient email

# Archive/Unarchive campaign
cakemail campaigns archive <id>
cakemail campaigns unarchive <id>

# Cancel a scheduled campaign
cakemail campaigns cancel <id>

# Suspend/Resume campaign
cakemail campaigns suspend <id>
cakemail campaigns resume <id>

# List campaign links
cakemail campaigns links <id> [options]
  -l, --limit <number>    Limit results
  -p, --page <number>     Page number

# Delete campaign
cakemail campaigns delete <id> --force
```

#### Lists

```bash
# List all contact lists
cakemail lists list [options]
  -l, --limit <number>    Limit results
  -p, --page <number>     Page number

# Get list details
cakemail lists get <id>

# Create a list
cakemail lists create -n "My List" [options]
  -n, --name <name>       List name (required)
  -l, --language <lang>   Language code (e.g., en, fr)

# Delete list
cakemail lists delete <id> --force
```

#### Contacts

```bash
# List contacts in a list
cakemail contacts list <list-id> [options]
  -l, --limit <number>    Limit results
  -p, --page <number>     Page number
  -q, --query <query>     Search query

# Get contact details
cakemail contacts get <list-id> <contact-id>

# Add a contact
cakemail contacts add <list-id> -e <email> [options]
  -e, --email <email>         Contact email (required)
  -f, --first-name <name>     First name
  -l, --last-name <name>      Last name
  -d, --data <json>           Custom attributes as JSON

# Update contact
cakemail contacts update <list-id> <contact-id> [options]
  -e, --email <email>         Contact email
  -f, --first-name <name>     First name
  -l, --last-name <name>      Last name
  -d, --data <json>           Custom attributes as JSON

# Delete contact
cakemail contacts delete <list-id> <contact-id> --force

# Unsubscribe contact
cakemail contacts unsubscribe <list-id> <contact-id>
```

#### Senders

```bash
# List all senders
cakemail senders list

# Get sender details
cakemail senders get <id>

# Create a sender
cakemail senders create -n "John Doe" -e "john@example.com"
  -n, --name <name>     Sender name (required)
  -e, --email <email>   Sender email (required)

# Delete sender
cakemail senders delete <id> --force
```

#### Webhooks

```bash
# List all webhooks
cakemail webhooks list [options]
  -l, --limit <number>    Limit results
  -p, --page <number>     Page number

# Get webhook details
cakemail webhooks get <id>

# Create a webhook
cakemail webhooks create -u <url> -e <events> [options]
  -u, --url <url>         Webhook URL (required)
  -e, --events <events>   Comma-separated events (required)
  -n, --name <name>       Webhook name
  -s, --secret <secret>   Webhook secret for verification

# Update a webhook
cakemail webhooks update <id> [options]
  -u, --url <url>         Webhook URL
  -e, --events <events>   Comma-separated events
  -n, --name <name>       Webhook name
  -s, --secret <secret>   Webhook secret

# Archive a webhook
cakemail webhooks archive <id>

# Unarchive a webhook
cakemail webhooks unarchive <id>
```

## Examples

```bash
# Create a template
cakemail templates create \
  -n "Newsletter Template" \
  --html-file templates/newsletter.html \
  --subject "Weekly Newsletter" \
  --tags "newsletter,weekly"

# Send a transactional email
cakemail emails send \
  -t customer@example.com \
  -s "Order Confirmation" \
  --html-file templates/order-confirmation.html \
  --from-email orders@myshop.com \
  --from-name "My Shop" \
  --tracking \
  --tags "transactional,order"

# Manage campaign lifecycle
cakemail campaigns schedule 123 -d "2025-10-15T10:00:00Z"
cakemail campaigns suspend 123
cakemail campaigns resume 123
cakemail campaigns cancel 123

# List campaigns in table format
cakemail -f table campaigns list

# List campaigns in compact format
cakemail -f compact campaigns list

# Create a new list
cakemail lists create -n "Newsletter Subscribers" -l en

# Add a contact with custom attributes
cakemail contacts add 123 -e "user@example.com" -f "John" -l "Doe" -d '{"company":"Acme"}'

# Schedule a campaign
cakemail campaigns schedule 456 -d "2025-10-15T10:00:00Z"

# Send a test campaign
cakemail campaigns test 456 -e "test@example.com"

# Create a webhook for email events
cakemail webhooks create \
  -u "https://example.com/webhook" \
  -e "email.sent,email.opened,email.clicked" \
  -n "My Webhook" \
  -s "my_secret_key"
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run locally
npm start -- campaigns list

# or use node directly
node dist/cli.js campaigns list
```

## License

MIT

## Support

For issues and questions, please visit: https://github.com/cakemail/cli/issues
