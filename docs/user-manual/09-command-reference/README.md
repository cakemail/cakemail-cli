# Command Reference

Complete reference documentation for all Cakemail CLI commands.

## Command Categories

### [Account Commands](./account.md)
Manage Cakemail accounts and switch between them.

### [Campaign Commands](./campaigns.md)
Create, schedule, and manage email campaigns.

### [Contact Commands](./contacts.md)
Manage individual contacts within lists.

### [List Commands](./lists.md)
Create and manage contact lists.

### [Email Commands](./emails.md)
Send transactional emails via the Email API v2.

### [Template Commands](./templates.md)
Create and manage email templates.

### [Sender Commands](./senders.md)
Manage sender identities and verify email addresses.

### [Report Commands](./reports.md)
Access analytics and generate reports.

### [Segment Commands](./segments.md)
Create and manage dynamic contact segments.

### [Attribute Commands](./attributes.md)
Define custom contact attributes.

### [Suppressed Commands](./suppressed.md)
Manage the global suppression list.

### [Webhook Commands](./webhooks.md)
Configure webhooks for event notifications.

## Command Structure

All commands follow this general structure:

```bash
cakemail [global-options] <command> <subcommand> [arguments] [options]
```

### Global Options
- `-f, --format <format>` - Output format (json|table|compact)
- `--access-token <token>` - Override access token
- `--email <email>` - Override email
- `--password <password>` - Override password
- `--account <id>` - Use specific account ID

### Common Patterns

#### List Operations
```bash
cakemail <resource> list [options]
  -l, --limit <number>      Limit results
  -p, --page <number>       Page number
  --sort <sort>             Sort order
  --filter <filter>         Filter expression
```

#### Get Operations
```bash
cakemail <resource> get <id>
```

#### Create Operations
```bash
cakemail <resource> create [required-options] [optional-options]
```

#### Update Operations
```bash
cakemail <resource> update <id> [options]
```

#### Delete Operations
```bash
cakemail <resource> delete <id> --force
```

## Quick Reference

| Resource | Commands | Description |
|----------|----------|-------------|
| account | list, switch, current | Manage accounts |
| campaigns | list, get, create, update, schedule, test, delete | Campaign management |
| contacts | list, get, add, update, delete, unsubscribe | Contact management |
| lists | list, get, create, update, archive, delete | List management |
| emails | send, get, render, logs, tags | Transactional emails |
| templates | list, get, create, update, render, delete | Template management |
| senders | list, get, create, update, confirm, delete | Sender management |
| reports | campaign, list, account, emails, export | Analytics & reporting |
| segments | list, get, create, update, delete, contacts | Segment management |
| attributes | list, get, create, delete | Custom attributes |
| suppressed | list, add, delete, export | Suppression list |
| webhooks | list, get, create, update, archive, unarchive | Webhook management |

## Next Steps

Select a command category from the list above to view detailed documentation.
