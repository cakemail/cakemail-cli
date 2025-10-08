# Authentication Guide

## How Cakemail API Authentication Works

Cakemail uses **OAuth 2.0 Password Grant** for authentication, not traditional API keys.

### Authentication Flow

```
1. User provides email + password
2. CLI sends POST /token with credentials (application/x-www-form-urlencoded)
3. API returns: { access_token, refresh_token, expires_in }
4. CLI uses access_token for subsequent requests (Bearer token)
5. When access_token expires (401), CLI uses refresh_token to get new access_token
6. If refresh fails, CLI re-authenticates with email/password
```

### Two Ways to Authenticate

#### Option 1: Email + Password (Recommended for CLI)

The CLI automatically handles token management:

```bash
export CAKEMAIL_EMAIL=your@email.com
export CAKEMAIL_PASSWORD=your_password
cakemail campaigns list
```

**What happens:**
1. CLI calls `POST /token` with email/password
2. Receives `access_token` and `refresh_token`
3. Stores tokens in memory (not persisted)
4. Uses `access_token` for all API requests
5. Auto-refreshes when token expires

#### Option 2: Pre-existing Access Token

If you already have an access token (from another OAuth2 flow):

```bash
export CAKEMAIL_ACCESS_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
cakemail campaigns list
```

**Note:** This won't auto-refresh since there's no refresh token.

## OAuth2 Token Request Format

The `/token` endpoint requires `application/x-www-form-urlencoded` format:

### Get Initial Token (Password Grant)
```http
POST /token
Content-Type: application/x-www-form-urlencoded

grant_type=password&username=user@example.com&password=secret123
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "def50200a1b2c3d4...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

### Refresh Token
```http
POST /token
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token&refresh_token=def50200a1b2c3d4...
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "def50200e5f6g7h8...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

## Token Storage

**Currently:** Tokens are stored in memory only (not persisted to disk)

**Pros:**
- More secure (tokens don't persist after CLI exits)
- No file permission issues

**Cons:**
- Must re-authenticate on every CLI invocation
- Slightly slower first request

### Future: Token Persistence

Could store tokens in `~/.cakemail/credentials.json`:

```json
{
  "access_token": "...",
  "refresh_token": "...",
  "expires_at": "2025-10-08T20:00:00Z"
}
```

This would:
- Speed up CLI (no re-authentication)
- Reduce API calls
- Require secure file permissions (0600)

## Multi-Factor Authentication (MFA)

If account has MFA enabled, the `/token` endpoint returns:

```json
{
  "challenge": "mfa-challenge-id-123"
}
```

The CLI would need to:
1. Detect the challenge response
2. Prompt user for MFA code
3. Call `POST /token/challenge` with code

**Current Status:** MFA not yet implemented in CLI

## Security Considerations

### ✅ Current Implementation
- Tokens stored in memory only
- HTTPS enforced for all requests
- Automatic token refresh
- No plaintext tokens in logs

### 🚧 Future Improvements
- Token persistence with encryption
- Token expiration checking before requests
- MFA support
- Token revocation on logout
- Secure credential storage (OS keychain)

## Environment Variables

```bash
# Primary authentication (auto OAuth2)
CAKEMAIL_EMAIL=your@email.com
CAKEMAIL_PASSWORD=your_password

# Alternative: Use existing token
CAKEMAIL_ACCESS_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional: Override API base URL
CAKEMAIL_API_BASE=https://api.cakemail.dev
```

## CLI Flags

```bash
# Override credentials via CLI
cakemail --email user@example.com --password secret123 campaigns list

# Use access token
cakemail --access-token eyJhbGci... campaigns list

# Flags take precedence over environment variables
```

## Debugging Authentication

Enable verbose logging to see auth flow:

```bash
# Check if credentials are loaded
cakemail --email test@example.com --password wrong_password campaigns list
# Error: Authentication failed: ...

# Success
cakemail --email user@example.com --password correct_password campaigns list
# (Makes POST /token, then GET /campaigns)
```

## Comparison: API Keys vs OAuth2 Tokens

| Feature | Traditional API Keys | Cakemail OAuth2 Tokens |
|---------|---------------------|------------------------|
| **Format** | Long-lived static key | Short-lived JWT |
| **Expiration** | Never (or very long) | 1 hour (configurable) |
| **Refresh** | N/A | Yes, via refresh token |
| **Scopes** | Often global | user/admin/internal |
| **Revocation** | Manual | Automatic on refresh |
| **Security** | Lower (if leaked) | Higher (expires quickly) |

## Summary

**There are NO traditional API keys in Cakemail.** The `CAKEMAIL_ACCESS_TOKEN` env var refers to an OAuth2 access token obtained from the `/token` endpoint.

For CLI usage, **email + password** is the simplest approach - the CLI handles all token management automatically.
