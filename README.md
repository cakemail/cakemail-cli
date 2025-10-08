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
# Option 1: Use API token
export CAKEMAIL_API_KEY=your_api_token

# Option 2: Use email/password
export CAKEMAIL_EMAIL=your@email.com
export CAKEMAIL_PASSWORD=your_password
```

Or create a `.env` file:

```bash
cp .env.example .env
# Edit .env with your credentials
```

## Usage

```bash
cakemail [options] <command>
```

### Global Options

- `--access-token <token>` - Override access token from environment
- `--email <email>` - Override email from environment
- `--password <password>` - Override password from environment

> **Note:** Output is currently JSON only. Table and compact formats are planned for a future release.

### Commands

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

# Schedule a campaign
cakemail campaigns schedule <id> -d <datetime>
  -d, --date <datetime>   Schedule datetime (ISO 8601)

# Send test email
cakemail campaigns test <id> -e <email>
  -e, --email <email>     Recipient email

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
# List campaigns
cakemail campaigns list

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
