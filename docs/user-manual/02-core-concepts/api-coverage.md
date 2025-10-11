# API Coverage

Understand the relationship between the Cakemail CLI, the Cakemail SDK, and the Cakemail API.

## Overview

The Cakemail CLI is built on top of the official Cakemail SDK, which provides 100% coverage of the Cakemail API (232 operations). This means:

- **All API operations** are available through the SDK
- **Most common operations** are exposed as CLI commands
- **Advanced operations** can be accessed via scripting with the SDK

## Architecture

```
┌─────────────────────┐
│   Cakemail CLI      │  ← User-friendly commands
│   (Command Layer)   │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│  Cakemail SDK       │  ← 100% API coverage (232 ops)
│  (@cakemail-org)    │
└──────────┬──────────┘
           │
┌──────────▼──────────┐
│   Cakemail API      │  ← REST API
│  (api.cakemail.dev) │
└─────────────────────┘
```

### Layers Explained

**Cakemail API (Bottom Layer)**
- REST API with 232 operations
- Handles all email marketing functionality
- Requires API authentication

**Cakemail SDK (Middle Layer)**
- Node.js TypeScript library
- Generated from OpenAPI specification
- 100% API coverage
- Type-safe operations

**Cakemail CLI (Top Layer)**
- Command-line interface
- User-friendly commands for common operations
- Built with Commander.js
- Uses SDK internally

---

## CLI Command Coverage

The CLI currently implements commands for the most commonly used operations:

### Account Management
- Show current account
- List accessible accounts
- Switch between accounts
- Test credentials
- Logout

### Email API v2 (Transactional)
- Send emails (HTML, text, templates)
- Get email details
- Render email content
- View email logs
- List email tags

### Templates
- List templates
- Get template details
- Create templates
- Update templates
- Render templates
- Delete templates

### Campaigns
- List campaigns
- Get campaign details
- Create campaigns
- Update campaigns
- Schedule/unschedule campaigns
- Send test emails
- Archive/unarchive campaigns
- Suspend/resume campaigns
- Cancel campaigns
- List campaign links
- Delete campaigns

### Lists
- List all lists
- Get list details
- Create lists
- Update lists
- Archive lists
- Accept list policy
- Manage subscription forms
- Delete lists

### Contacts
- List contacts
- Get contact details
- Add contacts
- Update contacts
- Delete contacts
- Unsubscribe contacts
- Export contacts
- Tag/untag contacts (single and bulk)

### Custom Attributes
- List attributes
- Get attribute details
- Create attributes
- Delete attributes

### Segments
- List segments
- Get segment details
- Create segments
- Update segments
- Delete segments
- List contacts in segment

### Senders
- List senders
- Get sender details
- Create senders
- Update senders
- Confirm sender email
- Resend confirmation
- Delete senders

### Webhooks
- List webhooks
- Get webhook details
- Create webhooks
- Update webhooks
- Archive/unarchive webhooks

### Suppression List
- List suppressed emails
- Add to suppression list
- Remove from suppression list
- Export suppression list

### Reports & Analytics
- Campaign analytics
- Campaign link analytics
- List analytics
- Account analytics
- Email API statistics
- Export campaign reports

---

## What's Not Covered by CLI Commands

Some advanced or less commonly used API operations are not exposed as CLI commands but can be accessed through the SDK:

### Advanced Campaign Operations
- Bulk operations
- Campaign cloning
- Advanced scheduling options
- Campaign webhooks
- A/B testing

### Advanced Contact Operations
- Bulk import (coming soon)
- Advanced segmentation
- Contact scoring
- Activity tracking

### Billing & Usage
- View invoices
- Check usage limits
- Manage subscriptions

### Advanced Integrations
- OAuth management
- API key management (beyond basic access tokens)
- Custom integrations

### Subaccount Management
- Create subaccounts
- Manage subaccount permissions
- Transfer resources

---

## Using the SDK Directly

For operations not available as CLI commands, you can use the SDK directly in Node.js scripts.

### Installation

```bash
npm install @cakemail-org/cakemail-sdk
```

### Example: Custom Script

```javascript
import { CakemailSDK } from '@cakemail-org/cakemail-sdk';

// Initialize SDK
const sdk = new CakemailSDK({
  auth: {
    email: process.env.CAKEMAIL_EMAIL,
    password: process.env.CAKEMAIL_PASSWORD
  }
});

// Use any API operation
async function advancedOperation() {
  // Example: Get detailed campaign statistics
  const stats = await sdk.campaigns.getCampaignStatistics({
    campaignId: 12345,
    includeDetails: true
  });

  console.log(stats);
}

advancedOperation();
```

### SDK Documentation

For complete SDK documentation, see:
- [SDK npm package](https://www.npmjs.com/package/@cakemail-org/cakemail-sdk)
- [Cakemail API Documentation](https://api.cakemail.com)

---

## CLI vs SDK vs API

### When to Use Each

| Use Case | Best Tool | Why |
|----------|-----------|-----|
| **Daily operations** | CLI | Quick, user-friendly |
| **Automation scripts** | CLI | Simple bash scripts |
| **Advanced operations** | SDK | Full API access |
| **Custom integrations** | SDK | Programmatic control |
| **Web applications** | SDK | Type-safe TypeScript |
| **Direct API calls** | API | Language-agnostic |

### Feature Comparison

| Feature | CLI | SDK | API |
|---------|-----|-----|-----|
| **Coverage** | Common ops | 100% (232 ops) | 100% (232 ops) |
| **Ease of use** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Flexibility** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Type safety** | N/A | ⭐⭐⭐⭐⭐ | N/A |
| **Documentation** | This manual | SDK docs | API docs |
| **Authentication** | .env or prompts | Code | HTTP headers |
| **Best for** | Terminal users | Developers | Any language |

---

## API Operation Examples

### Example 1: CLI Command

```bash
# Simple CLI command
cakemail campaigns list --limit 10
```

### Example 2: SDK Usage

```javascript
// Equivalent SDK usage
const campaigns = await sdk.campaigns.listCampaigns({
  limit: 10
});
```

### Example 3: Direct API Call

```bash
# Equivalent direct API call
curl -X GET "https://api.cakemail.dev/campaigns?limit=10" \
  -H "Authorization: Bearer $CAKEMAIL_ACCESS_TOKEN"
```

---

## CLI Feature Roadmap

### Recently Added (v1.3)
- ✅ Reports & Analytics commands
- ✅ Segments management
- ✅ Custom attributes
- ✅ Suppression list management
- ✅ Contact export
- ✅ Contact tagging (bulk operations)
- ✅ Extended list operations
- ✅ Email API logs

### Planned (v1.4+)
- 🔄 Contact import from CSV/JSON
- 🔄 Campaign cloning
- 🔄 A/B testing commands
- 🔄 Subaccount creation
- 🔄 Billing information
- 🔄 Advanced webhook management

### Under Consideration
- 💭 Interactive mode (REPL)
- 💭 Batch operations DSL
- 💭 Campaign templates marketplace
- 💭 Analytics dashboards (terminal UI)

---

## Requesting New Features

If you need a CLI command for an SDK/API operation that's not available:

### Check SDK Documentation

First, verify the operation exists in the SDK:
- [Cakemail SDK on npm](https://www.npmjs.com/package/@cakemail-org/cakemail-sdk)
- [Cakemail API Documentation](https://api.cakemail.com)

### Use SDK Directly (Temporary)

While waiting for CLI support, use the SDK directly:

```javascript
// custom-operation.js
import { CakemailSDK } from '@cakemail-org/cakemail-sdk';

const sdk = new CakemailSDK({
  auth: {
    accessToken: process.env.CAKEMAIL_ACCESS_TOKEN
  }
});

// Your custom operation
async function main() {
  const result = await sdk.someService.someOperation({
    // parameters
  });
  console.log(JSON.stringify(result, null, 2));
}

main();
```

Run with:
```bash
node custom-operation.js
```

### Request CLI Command

Submit a feature request:
1. **Check existing issues**: [GitHub Issues](https://github.com/cakemail-org/cakemail-cli/issues)
2. **Create new issue** with:
   - Use case description
   - API operation name
   - Example usage
   - Why SDK direct usage isn't sufficient

**Template:**
```markdown
### Feature Request: Add command for [operation]

**Use case:**
I need to [describe what you want to accomplish]

**API Operation:**
`sdk.service.operation()`

**Proposed CLI command:**
`cakemail resource action [options]`

**Why not use SDK directly:**
[Explain why a CLI command would be better]
```

---

## Coverage Statistics

### By Resource Type

| Resource | CLI Commands | SDK Operations | Coverage % |
|----------|--------------|----------------|------------|
| Campaigns | 16 | 20 | 80% |
| Contacts | 15 | 18 | 83% |
| Lists | 10 | 12 | 83% |
| Templates | 6 | 8 | 75% |
| Senders | 7 | 8 | 88% |
| Emails (API v2) | 5 | 7 | 71% |
| Reports | 12 | 15 | 80% |
| Webhooks | 6 | 8 | 75% |
| Segments | 6 | 7 | 86% |
| Attributes | 4 | 4 | 100% |
| Suppressed | 6 | 6 | 100% |
| Account | 5 | 8 | 63% |

**Overall CLI Coverage:** ~80% of common operations

**SDK Coverage:** 100% (232 operations)

---

## Understanding SDK Versioning

The CLI depends on the SDK version specified in `package.json`:

```json
{
  "dependencies": {
    "@cakemail-org/cakemail-sdk": "^2.0.0"
  }
}
```

### Version Compatibility

- **CLI v1.x** → SDK v2.x → API v2
- SDK updates automatically include new API features
- CLI updates add new commands for SDK features

### Staying Updated

**Check CLI version:**
```bash
cakemail --version
```

**Update CLI:**
```bash
# Homebrew
brew upgrade cakemail-cli

# npm
npm update -g @cakemail-org/cakemail-cli
```

**Check SDK version:**
```bash
npm list @cakemail-org/cakemail-sdk
```

---

## Best Practices

### 1. Start with CLI

For common operations, always try CLI first:
```bash
cakemail campaigns list
```

### 2. Use SDK for Advanced Operations

When CLI doesn't support what you need:
```javascript
const sdk = new CakemailSDK(...);
await sdk.advanced.operation();
```

### 3. Direct API as Last Resort

Only use direct API calls when SDK doesn't support it (rare):
```bash
curl -X POST "https://api.cakemail.dev/..."
```

### 4. Request Missing Commands

If you find yourself repeatedly using SDK for the same operation, request a CLI command.

---

## Next Steps

- [Command Reference](../09-command-reference/README.md) - Complete CLI command list
- [Getting Started](../01-getting-started/quick-start.md) - Start using CLI
- [Advanced Usage](../08-advanced-usage/scripting-automation.md) - Combine CLI and SDK
