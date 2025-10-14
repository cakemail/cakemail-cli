# Webhooks Integration

Receive real-time notifications about email events via webhooks for seamless integration with your applications.

## Overview

Webhooks allow you to:
- Receive real-time event notifications
- Integrate with external systems
- Automate workflows based on email events
- Track deliverability in your application
- Sync contact status changes

## Quick Start

### Create Webhook

```bash
$ cakemail webhooks create \
  -u "https://api.yourapp.com/webhooks/cakemail" \
  -e "email.sent,email.opened,email.clicked" \
  -n "Production Webhook"
```

**Output:**
```
✓ Webhook created successfully

ID: 123
URL: https://api.yourapp.com/webhooks/cakemail
Events: email.sent, email.opened, email.clicked
Status: active
```

## Available Events

### Email Events

- `email.sent` - Email successfully delivered
- `email.opened` - Recipient opened email
- `email.clicked` - Recipient clicked link
- `email.bounced` - Email bounced
- `email.unsubscribed` - Recipient unsubscribed
- `email.spam_complaint` - Marked as spam

### Campaign Events

- `campaign.sent` - Campaign completed sending
- `campaign.scheduled` - Campaign scheduled
- `campaign.cancelled` - Campaign cancelled

## Webhook Payload Examples

### Email Sent Event

```json
{
  "event": "email.sent",
  "timestamp": "2024-03-15T10:30:00Z",
  "data": {
    "campaign_id": 790,
    "contact_id": 501,
    "email": "user@example.com",
    "message_id": "msg_abc123"
  }
}
```

### Email Opened Event

```json
{
  "event": "email.opened",
  "timestamp": "2024-03-15T11:45:00Z",
  "data": {
    "campaign_id": 790,
    "contact_id": 501,
    "email": "user@example.com",
    "user_agent": "Mozilla/5.0...",
    "ip_address": "192.168.1.1"
  }
}
```

## Integration Examples

### Node.js/Express

```javascript
const express = require('express');
const app = express();

app.post('/webhooks/cakemail', express.json(), (req, res) => {
  const { event, timestamp, data } = req.body;

  switch(event) {
    case 'email.opened':
      console.log(`Email opened: ${data.email}`);
      // Update your database
      break;

    case 'email.clicked':
      console.log(`Link clicked: ${data.email}`);
      // Track engagement
      break;

    case 'email.bounced':
      console.log(`Email bounced: ${data.email}`);
      // Remove from list
      break;
  }

  res.status(200).send('OK');
});

app.listen(3000);
```

### Python/Flask

```python
from flask import Flask, request
import json

app = Flask(__name__)

@app.route('/webhooks/cakemail', methods=['POST'])
def cakemail_webhook():
    data = request.json
    event = data.get('event')

    if event == 'email.opened':
        email = data['data']['email']
        # Update database
        print(f"Email opened: {email}")

    elif event == 'email.clicked':
        email = data['data']['email']
        # Track engagement
        print(f"Link clicked: {email}")

    return '', 200

if __name__ == '__main__':
    app.run(port=5000)
```

### PHP

```php
<?php
$payload = file_get_contents('php://input');
$data = json_decode($payload, true);

$event = $data['event'];
$eventData = $data['data'];

switch($event) {
    case 'email.opened':
        $email = $eventData['email'];
        // Update database
        error_log("Email opened: $email");
        break;

    case 'email.clicked':
        $email = $eventData['email'];
        // Track engagement
        error_log("Link clicked: $email");
        break;
}

http_response_code(200);
?>
```

## Webhook Management

### List Webhooks

```bash
$ cakemail webhooks list
```

### Update Webhook

```bash
$ cakemail webhooks update 123 \
  -e "email.sent,email.opened,email.clicked,email.bounced"
```

### Test Webhook

```bash
$ cakemail webhooks test 123
```

### Delete Webhook

```bash
$ cakemail webhooks delete 123 --force
```

## Security

### Verify Webhook Signature

Cakemail signs webhook payloads with HMAC-SHA256:

```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const hmac = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(hmac)
  );
}

app.post('/webhooks/cakemail', (req, res) => {
  const signature = req.headers['x-cakemail-signature'];
  const payload = JSON.stringify(req.body);

  if (!verifyWebhook(payload, signature, process.env.WEBHOOK_SECRET)) {
    return res.status(401).send('Invalid signature');
  }

  // Process webhook
  res.status(200).send('OK');
});
```

## Best Practices

1. **Return 200 Quickly** - Process async
2. **Verify Signatures** - Security
3. **Handle Retries** - Idempotent processing
4. **Log Events** - Debugging
5. **Monitor Failures** - Alert on errors

## Troubleshooting

### Webhook Not Receiving Events

- Verify URL is publicly accessible
- Check firewall/security rules
- Test with `cakemail webhooks test`
- Check application logs

### Missing Events

- Verify events subscribed
- Check application response time
- Monitor webhook status

