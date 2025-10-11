# Troubleshooting

This section helps you diagnose and resolve common issues with the Cakemail CLI.

## In This Section

### [Common Errors](./common-errors.md)
Solutions for frequently encountered error messages.

### [Authentication Issues](./authentication-issues.md)
Troubleshoot login and credential problems.

### [Connection Problems](./connection-problems.md)
Resolve network and API connectivity issues.

### [Debugging](./debugging.md)
Enable debug mode and verbose logging for troubleshooting.

## Quick Diagnostics

### Check CLI Version
```bash
cakemail --version
```

### Check Authentication
```bash
cakemail account current
```

### Test API Connectivity
```bash
cakemail lists list --limit 1
```

## Common Issues

### Authentication Errors
- Missing or invalid credentials
- Expired access tokens
- Account not found

### Network Errors
- API connectivity issues
- Timeout errors
- SSL/TLS certificate problems

### Command Errors
- Invalid command syntax
- Missing required arguments
- Resource not found (404)

### Data Errors
- Invalid JSON format
- Missing required fields
- Validation failures

## Getting Help

If you can't resolve your issue:

1. **Check this troubleshooting guide**
2. **Search existing GitHub issues**: [cakemail-cli/issues](https://github.com/cakemail-org/cakemail-cli/issues)
3. **Create a new issue** with:
   - CLI version (`cakemail --version`)
   - Full command you ran
   - Error message (redact sensitive info)
   - Operating system and Node.js version

## Debug Mode

Enable verbose logging for troubleshooting:

```bash
# Set environment variable
export DEBUG=cakemail:*

# Run your command
cakemail campaigns list
```

## Next Steps

Start with [Common Errors](./common-errors.md) to find solutions to frequently encountered issues.
