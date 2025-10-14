# Authentication Methods

A deep dive into the two authentication methods supported by the Cakemail CLI: Access Tokens and Email/Password.

## Overview

The Cakemail CLI supports two authentication methods:

1. **Access Token** - API-only authentication using a long-lived token
2. **Email & Password** - Interactive authentication using account credentials

Each method has different use cases, security characteristics, and workflows.

---

## Access Token Authentication

### What is an Access Token?

An access token is a secure, long-lived credential that grants API access without requiring your email and password. Think of it as an API key specific to your account.

### How It Works

1. You generate a token in the Cakemail dashboard
2. The token is stored in your environment or `.env` file
3. The CLI uses the token to authenticate API requests
4. No password is ever transmitted or stored locally

### Generating an Access Token

**Step 1: Log in to Cakemail Dashboard**
- Visit [app.cakemail.com](https://app.cakemail.com)
- Log in with your email and password

**Step 2: Navigate to API Settings**
- Go to **Settings** → **API Access**
- Click **Generate New Token**

**Step 3: Copy and Store the Token**
- Copy the token immediately (you won't see it again)
- Store it securely in your `.env` file or password manager

**Step 4: Configure the CLI**

Add to your `.env` file:
```bash
CAKEMAIL_ACCESS_TOKEN=your_token_here
```

Or set as environment variable:
```bash
export CAKEMAIL_ACCESS_TOKEN=your_token_here
```

### Using Access Tokens

**Verify Token Works:**
```bash
cakemail account test
```

**Make API Calls:**
```bash
# Token is automatically used for all commands
cakemail campaigns list
cakemail contacts list 123
```

### Token Characteristics

| Property | Details |
|----------|---------|
| **Lifetime** | Long-lived (until revoked) |
| **Scope** | Full API access to your account |
| **Revocable** | Yes, via dashboard |
| **Visible** | Only once (at generation) |
| **Renewable** | No, must generate new token |

### When to Use Access Tokens

**✅ Use for:**
- **CI/CD pipelines** - Automated deployments and testing
- **Production scripts** - Scheduled jobs and automation
- **Server environments** - Background processes
- **Shared team access** - Team members with API-only needs
- **Long-running processes** - Scripts that run for extended periods

**❌ Don't use for:**
- **Personal laptops** (if shared) - Use email/password for better security
- **Multiple environments** - Use separate tokens per environment
- **Temporary access** - Email/password is better for short-term use

---

## Email & Password Authentication

### What is Email/Password Auth?

Traditional authentication using your Cakemail account email and password. The CLI exchanges your credentials for a session token that expires after some time.

### How It Works

1. You provide your email and password
2. The CLI authenticates with the Cakemail API
3. A session token is generated (invisible to you)
4. The session token is used for subsequent requests
5. Session expires after a period of inactivity

### Setting Up Email/Password

**Option 1: Environment Variables**

```bash
export CAKEMAIL_EMAIL=your@email.com
export CAKEMAIL_PASSWORD=your_password
```

**Option 2: `.env` File**

```bash
# .env
CAKEMAIL_EMAIL=your@email.com
CAKEMAIL_PASSWORD=your_password
```

**Option 3: Interactive Prompts**

Simply run a command without credentials:
```bash
cakemail campaigns list
```

You'll be prompted:
```
? Email: your@email.com
? Password: ********
```

### Using Email/Password

**Test Credentials:**
```bash
cakemail account test
```

**Make API Calls:**
```bash
# Credentials are automatically used
cakemail campaigns list
cakemail contacts list 123
```

### Session Characteristics

| Property | Details |
|----------|---------|
| **Lifetime** | Session-based (hours) |
| **Scope** | Full account access |
| **Revocable** | Only by changing password |
| **Visible** | Password stored in `.env` or environment |
| **Renewable** | Automatic (re-authenticates as needed) |

### When to Use Email/Password

**✅ Use for:**
- **Interactive CLI use** - Daily terminal work
- **Personal machines** - Your own laptop/desktop
- **Development** - Local development and testing
- **Short-term use** - Temporary access or one-off tasks
- **Multiple accounts** - Easier to switch between accounts

**❌ Don't use for:**
- **CI/CD pipelines** - Use access tokens instead
- **Shared servers** - Password in plaintext is risky
- **Team sharing** - Use access tokens with proper scoping
- **Public repositories** - Never commit passwords

---

## Comparison

### Side-by-Side Comparison

| Feature | Access Token | Email/Password |
|---------|--------------|----------------|
| **Setup complexity** | Medium (requires dashboard) | Low (just credentials) |
| **Security** | High (revocable, API-only) | Medium (requires password) |
| **Best for automation** | ✅ Yes | ❌ No |
| **Best for interactive** | ✅ Yes | ✅ Yes |
| **Rotation** | Must regenerate | Change password |
| **Granular permissions** | ❌ No (future feature) | ❌ No |
| **Multi-factor auth** | ✅ Supported | ✅ Supported |
| **Session expiry** | Never | Hours |
| **Credential visibility** | Token only | Email + password |

### Security Comparison

| Aspect | Access Token | Email/Password |
|--------|--------------|----------------|
| **Compromise impact** | API access only | Full account access |
| **Revocation** | Instant (via dashboard) | Change password |
| **Credential exposure** | Token only | Email + password |
| **Audit trail** | Token-specific logs | General account logs |
| **Recommended for production** | ✅ Yes | ⚠️ With caution |

---

## Switching Authentication Methods

### From Email/Password to Access Token

**Step 1: Generate Token** (see above)

**Step 2: Update `.env` File**

Replace:
```bash
CAKEMAIL_EMAIL=your@email.com
CAKEMAIL_PASSWORD=your_password
```

With:
```bash
CAKEMAIL_ACCESS_TOKEN=your_token_here
```

**Step 3: Test**
```bash
cakemail account test
```

### From Access Token to Email/Password

**Step 1: Update `.env` File**

Replace:
```bash
CAKEMAIL_ACCESS_TOKEN=your_token_here
```

With:
```bash
CAKEMAIL_EMAIL=your@email.com
CAKEMAIL_PASSWORD=your_password
```

**Step 2: Test**
```bash
cakemail account test
```

---

## Best Practices

### 1. Use Access Tokens for Automation

**✅ Do:**
```bash
# CI/CD .env file
CAKEMAIL_ACCESS_TOKEN=prod_token_here
```

**❌ Don't:**
```bash
# CI/CD .env file
CAKEMAIL_EMAIL=admin@example.com
CAKEMAIL_PASSWORD=secret123
```

### 2. Rotate Tokens Regularly

Generate new tokens periodically:
- Every 90 days for production
- Every 30 days for development
- Immediately if compromised

**Rotation Process:**
1. Generate new token in dashboard
2. Update `.env` file with new token
3. Test that new token works
4. Revoke old token in dashboard

### 3. Use Different Tokens per Environment

**Development:**
```bash
# .env.development
CAKEMAIL_ACCESS_TOKEN=dev_token_here
```

**Production:**
```bash
# .env.production
CAKEMAIL_ACCESS_TOKEN=prod_token_here
```

### 4. Never Commit Credentials

**Always add to `.gitignore`:**
```bash
echo '.env' >> .gitignore
echo '.env.local' >> .gitignore
echo '.env.*.local' >> .gitignore
```

**Provide a template instead:**
```bash
# .env.example
# Choose one authentication method:

# Method 1: Access Token (recommended for automation)
# CAKEMAIL_ACCESS_TOKEN=your_token_here

# Method 2: Email/Password (recommended for interactive use)
# CAKEMAIL_EMAIL=your@email.com
# CAKEMAIL_PASSWORD=your_password
```

### 5. Use Secrets Managers in CI/CD

Store credentials in your CI/CD platform's secrets manager:

**GitHub Actions:**
```yaml
env:
  CAKEMAIL_ACCESS_TOKEN: ${{ secrets.CAKEMAIL_TOKEN }}
```

**GitLab CI:**
```yaml
variables:
  CAKEMAIL_ACCESS_TOKEN: $CI_CAKEMAIL_TOKEN
```

**CircleCI:**
```yaml
environment:
  CAKEMAIL_ACCESS_TOKEN: ${CAKEMAIL_TOKEN}
```

---

## Authentication Priority

When multiple authentication methods are configured, the CLI uses this priority:

1. **Access Token** (highest priority)
2. **Email/Password**
3. **Interactive Prompts** (lowest priority)

**Example:**
```bash
# .env file
CAKEMAIL_ACCESS_TOKEN=token_here
CAKEMAIL_EMAIL=user@example.com
CAKEMAIL_PASSWORD=password_here
```

The CLI will use the **access token** and ignore email/password.

**Override with CLI Flags:**
```bash
# Use specific token for this command
cakemail --access-token different_token campaigns list

# Use specific email/password for this command
cakemail --email user@example.com --password pass123 campaigns list
```

---

## Troubleshooting

### "Invalid credentials" with Access Token

**Possible Causes:**
1. Token was revoked in dashboard
2. Token is malformed or incomplete
3. Account was disabled

**Solutions:**
1. Generate new token in dashboard
2. Verify token is complete (no spaces or newlines)
3. Check account status in dashboard

### "Invalid credentials" with Email/Password

**Possible Causes:**
1. Password is incorrect
2. Account was suspended
3. Email typo in `.env` file

**Solutions:**
1. Reset password in Cakemail dashboard
2. Check for typos in email address
3. Verify account is active

### Authentication Works but Commands Fail

**Possible Cause:** Account-level permissions issue

**Solution:**
1. Verify account has necessary permissions
2. Check if account is in trial/limited mode
3. Contact Cakemail support

### Token Expired Suddenly

**Cause:** Tokens generally don't expire, but can be revoked

**Solutions:**
1. Check if token was revoked in dashboard
2. Generate new token
3. Update `.env` file

---

## Security Checklist

Use this checklist to ensure your authentication is secure:

- [ ] Credentials stored in `.env` file (not in code)
- [ ] `.env` file added to `.gitignore`
- [ ] Access tokens used for automation/CI/CD
- [ ] Different tokens for dev/staging/production
- [ ] Tokens rotated every 90 days (production)
- [ ] Old tokens revoked after rotation
- [ ] No credentials in shell history
- [ ] `.env` file has restricted permissions (`chmod 600 .env`)
- [ ] Team members have individual tokens (not shared)
- [ ] Secrets manager used in CI/CD

---

