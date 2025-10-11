# Integrations

This section covers webhooks and suppression list management for integrating Cakemail with external systems.

## In This Section

### [Webhooks](./webhooks.md)
Set up webhooks to receive real-time notifications about email events.

### [Suppression List](./suppression-list.md)
Manage the global suppression list to prevent emails to specific addresses.

## Overview

Integrations allow you to connect Cakemail with your existing systems and workflows:

- **Webhooks** provide real-time event notifications
- **Suppression lists** ensure compliance and deliverability

## Webhook Events

Receive notifications for:
- `email.sent` - Email successfully sent
- `email.delivered` - Email delivered to recipient
- `email.opened` - Recipient opened email
- `email.clicked` - Recipient clicked link
- `email.bounced` - Email bounced
- `email.complained` - Recipient marked as spam
- `contact.subscribed` - New contact subscribed
- `contact.unsubscribed` - Contact unsubscribed

## Suppression List

The suppression list prevents sending to:
- Hard bounced addresses
- Spam complainers
- Manually suppressed addresses
- Unsubscribed contacts

## Use Cases

- **CRM Integration**: Update contact records when emails are opened/clicked
- **Analytics Platform**: Send event data to analytics tools
- **Customer Support**: Notify support team of bounces or complaints
- **Compliance**: Automatically suppress bounced addresses

## Next Steps

Start with [Webhooks](./webhooks.md) to set up your first webhook endpoint.
