# Debugging Guide

Advanced debugging techniques for diagnosing and resolving CLI issues.

## Overview

Learn to:
- Enable verbose logging
- Use debug mode
- Inspect API requests/responses
- Trace command execution
- Analyze error messages
- Report bugs effectively

## Debug Mode

### Enable CLI Debug Logging

```bash
# Enable all debug output
$ export DEBUG=cakemail:*

# Run command with debug output
$ cakemail campaigns list
cakemail:api GET /v1/campaigns +0ms
cakemail:auth Authenticating... +5ms
cakemail:api Response: 200 OK +245ms

# Disable debug mode
$ unset DEBUG
```

### Selective Debug Logging

```bash
# Authentication only
$ export DEBUG=cakemail:auth
$ cakemail account show

# API requests only
$ export DEBUG=cakemail:api
$ cakemail lists list

# Multiple modules
$ export DEBUG=cakemail:auth,cakemail:api
$ cakemail campaigns create -n "Test"

# Everything except cache
$ export DEBUG=cakemail:* -cakemail:cache
```

### Debug Log Levels

```bash
# Verbose output (all levels)
$ export DEBUG=cakemail:*
$ export DEBUG_LEVEL=trace

# Specific levels
$ export DEBUG_LEVEL=error   # Errors only
$ export DEBUG_LEVEL=warn    # Warnings and errors
$ export DEBUG_LEVEL=info    # Info, warnings, errors
$ export DEBUG_LEVEL=debug   # All messages (default)
```

## Verbose Mode

### Command-Specific Verbosity

```bash
# Most commands support --verbose
$ cakemail campaigns list --verbose

# Shows:
# - API endpoint called
# - Request parameters
# - Response status
# - Timing information

# Example output:
# → GET /v1/campaigns
# ← 200 OK (245ms)
# Found 15 campaigns
```

### JSON Output for Debugging

```bash
# Get raw API response
$ cakemail campaigns get 790 -f json

# Pretty print with jq
$ cakemail campaigns get 790 -f json | jq .

# Inspect specific fields
$ cakemail campaigns get 790 -f json | jq '.status, .name'

# Save for analysis
$ cakemail campaigns get 790 -f json > debug-campaign.json
```

## Logging

### Enable File Logging

```bash
# Log to file
$ cakemail campaigns list 2>&1 | tee debug.log

# Separate stdout and stderr
$ cakemail campaigns list > output.log 2> error.log

# Append mode
$ cakemail campaigns list 2>&1 | tee -a debug.log

# With timestamps
$ cakemail campaigns list 2>&1 | while read line; do
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $line"
  done | tee debug.log
```

### Structured Logging

```bash
#!/bin/bash

# Logging function
log() {
    local level="$1"
    shift
    local message="$*"
    local timestamp=$(date +'%Y-%m-%d %H:%M:%S')

    echo "[$timestamp] [$level] $message" | tee -a debug.log
}

# Usage
log INFO "Starting campaign deployment"
log DEBUG "Campaign ID: 790"

if ! cakemail campaigns schedule 790 2>>debug.log; then
    log ERROR "Failed to schedule campaign"
    exit 1
fi

log INFO "Deployment complete"
```

## Network Debugging

### Inspect HTTP Requests

```bash
# Use curl with verbose output
$ curl -v https://api.cakemail.com/v1/campaigns 2>&1 | less

# Shows:
# - DNS resolution
# - TCP connection
# - SSL handshake
# - HTTP headers
# - Response data

# Save headers
$ curl -D headers.txt https://api.cakemail.com/v1/campaigns

# View response headers
$ cat headers.txt
HTTP/2 200
content-type: application/json
x-ratelimit-limit: 100
x-ratelimit-remaining: 95
```

### Capture Network Traffic

```bash
# Using tcpdump (requires root)
$ sudo tcpdump -i any -w capture.pcap host api.cakemail.com

# Run CLI command in another terminal
$ cakemail campaigns list

# Stop tcpdump (Ctrl+C)

# Analyze with Wireshark
$ wireshark capture.pcap

# Or use tshark (command-line)
$ tshark -r capture.pcap -Y "http or tls" -V
```

### HTTP Proxy for Debugging

```bash
# Use mitmproxy to inspect requests
$ mitmproxy -p 8080

# In another terminal, configure proxy
$ export HTTP_PROXY=http://localhost:8080
$ export HTTPS_PROXY=http://localhost:8080

# Run CLI command
$ cakemail campaigns list

# View in mitmproxy:
# - Request headers
# - Request body
# - Response headers
# - Response body
# - Timing
```

## Error Analysis

### Parse Error Messages

```bash
# Capture full error
$ cakemail campaigns schedule 790 2>&1 | tee error.log

# Extract error type
$ grep -i "error" error.log

# Extract status code
$ grep -oP "HTTP \K\d+" error.log

# Get stack trace (if available)
$ grep -A 20 "Error:" error.log
```

### Common Error Patterns

```bash
#!/bin/bash

analyze_error() {
    local error_output="$1"

    if echo "$error_output" | grep -q "ECONNREFUSED"; then
        echo "Connection refused - API unreachable"
        echo "Check: Network, firewall, API status"

    elif echo "$error_output" | grep -q "ETIMEDOUT"; then
        echo "Connection timeout - network latency"
        echo "Check: Internet speed, API latency"

    elif echo "$error_output" | grep -q "ENOTFOUND"; then
        echo "DNS resolution failed"
        echo "Check: DNS servers, /etc/hosts"

    elif echo "$error_output" | grep -q "401"; then
        echo "Authentication failed"
        echo "Check: Credentials, token expiration"

    elif echo "$error_output" | grep -q "404"; then
        echo "Resource not found"
        echo "Check: Resource ID, account access"

    elif echo "$error_output" | grep -q "429"; then
        echo "Rate limit exceeded"
        echo "Check: Request frequency, implement delays"

    else
        echo "Unknown error"
        echo "Enable debug mode: DEBUG=cakemail:*"
    fi
}

# Usage
ERROR_OUTPUT=$(cakemail campaigns get 999 2>&1)
analyze_error "$ERROR_OUTPUT"
```

## Command Tracing

### Bash Script Debugging

```bash
#!/bin/bash

# Enable tracing
set -x

# Your commands here
cakemail campaigns create -n "Test" -l 123 -s 101

# Disable tracing
set +x

# Output shows:
# + cakemail campaigns create -n Test -l 123 -s 101
# Campaign created: 790
```

### Advanced Tracing

```bash
#!/bin/bash

# Trace with timestamps
PS4='+ $(date +%Y-%m-%dT%H:%M:%S) ${BASH_SOURCE}:${LINENO}: '
set -x

cakemail campaigns list
cakemail campaigns get 790

set +x

# Output:
# + 2024-03-13T14:30:15 script.sh:5: cakemail campaigns list
# + 2024-03-13T14:30:16 script.sh:6: cakemail campaigns get 790
```

### Function Call Stack

```bash
#!/bin/bash

# Print call stack on error
trap 'echo "Error on line $LINENO"; exit 1' ERR

create_campaign() {
    local name="$1"
    echo "Creating campaign: $name"

    cakemail campaigns create -n "$name" -l 123 -s 101
}

deploy_campaign() {
    local id="$1"
    echo "Deploying campaign: $id"

    cakemail campaigns schedule "$id"
}

# Usage
CAMPAIGN_ID=$(create_campaign "Test" | grep -oP "Campaign created: \K\d+")
deploy_campaign "$CAMPAIGN_ID"
```

## Performance Profiling

### Measure Execution Time

```bash
# Simple timing
$ time cakemail campaigns list

real    0m1.234s
user    0m0.456s
sys     0m0.078s

# Detailed timing
$ time -v cakemail campaigns list 2>&1 | grep -E "Elapsed|Maximum"
Elapsed (wall clock) time: 0:01.23
Maximum resident set size: 45678

# Custom timing
start=$(date +%s%N)
cakemail campaigns list
end=$(date +%s%N)
duration=$(( (end - start) / 1000000 ))
echo "Duration: ${duration}ms"
```

### Profile Script Performance

```bash
#!/bin/bash

profile() {
    local description="$1"
    shift
    local command="$*"

    local start=$(date +%s%N)
    eval "$command"
    local end=$(date +%s%N)

    local duration=$(( (end - start) / 1000000 ))
    echo "[$description] ${duration}ms" >&2
}

# Usage
profile "List campaigns" cakemail campaigns list
profile "Get campaign" cakemail campaigns get 790
profile "List contacts" cakemail contacts list 123
```

### Memory Usage Monitoring

```bash
#!/bin/bash

monitor_memory() {
    local pid=$1
    local max_mem=0

    while kill -0 $pid 2>/dev/null; do
        local mem=$(ps -o rss= -p $pid 2>/dev/null || echo 0)
        [ $mem -gt $max_mem ] && max_mem=$mem
        sleep 0.1
    done

    local max_mem_mb=$((max_mem / 1024))
    echo "Peak memory: ${max_mem_mb}MB" >&2
}

# Usage
cakemail contacts export 123 &
PID=$!
monitor_memory $PID
wait $PID
```

## API Debugging

### Inspect Request/Response

```bash
# Create debug wrapper
cakemail_debug() {
    echo "=== Request ===" >&2
    echo "Command: cakemail $*" >&2

    local output=$(cakemail "$@" -f json 2>&1)
    local exit_code=$?

    echo "=== Response ===" >&2
    echo "$output" | jq . >&2 2>/dev/null || echo "$output" >&2

    echo "=== Exit Code: $exit_code ===" >&2

    return $exit_code
}

# Usage
cakemail_debug campaigns get 790
```

### Mock API Responses

```bash
#!/bin/bash

# Mock mode for testing
MOCK_MODE=${MOCK_MODE:-false}

cakemail() {
    if [ "$MOCK_MODE" = "true" ]; then
        echo "MOCK: cakemail $*" >&2

        case "$1" in
            campaigns)
                echo '{"id": 999, "name": "Mock Campaign", "status": "draft"}'
                ;;
            lists)
                echo '{"id": 123, "name": "Mock List", "contacts_count": 100}'
                ;;
            *)
                echo '{"success": true}'
                ;;
        esac
    else
        command cakemail "$@"
    fi
}

# Test without API calls
MOCK_MODE=true
cakemail campaigns get 790
```

## Diagnostic Scripts

### Comprehensive Diagnostics

```bash
#!/bin/bash
# diagnostic.sh - Collect debugging information

OUTPUT_FILE="cakemail-diagnostic-$(date +%Y%m%d-%H%M%S).txt"

{
    echo "=== Cakemail CLI Diagnostic Report ==="
    echo "Generated: $(date)"
    echo ""

    echo "=== System Information ==="
    echo "OS: $(uname -s)"
    echo "Version: $(uname -r)"
    echo "Architecture: $(uname -m)"
    echo ""

    echo "=== CLI Information ==="
    echo "CLI Version: $(cakemail --version 2>&1)"
    echo "CLI Location: $(which cakemail)"
    echo "Node Version: $(node --version)"
    echo "NPM Version: $(npm --version)"
    echo ""

    echo "=== Environment Variables ==="
    env | grep -i cakemail | sed 's/PASSWORD=.*/PASSWORD=***redacted***/'
    echo ""

    echo "=== Configuration Files ==="
    echo "Current directory .env:"
    [ -f .env ] && echo "  Exists" || echo "  Not found"

    echo "Home directory .env:"
    [ -f ~/.cakemail/.env ] && echo "  Exists" || echo "  Not found"
    echo ""

    echo "=== Network Connectivity ==="
    echo "Ping api.cakemail.com:"
    ping -c 3 api.cakemail.com 2>&1 | tail -2

    echo ""
    echo "DNS Resolution:"
    nslookup api.cakemail.com | grep -A1 "Name:"

    echo ""
    echo "Port 443 connectivity:"
    nc -zv api.cakemail.com 443 2>&1

    echo ""
    echo "=== API Test ==="
    echo "Testing API availability:"
    curl -I -s https://api.cakemail.com | head -1

    echo ""
    echo "=== Authentication Test ==="
    echo "Testing authentication:"
    cakemail account test 2>&1

    echo ""
    echo "=== Recent Errors (if any) ==="
    if [ -f debug.log ]; then
        echo "From debug.log (last 20 lines):"
        tail -20 debug.log
    else
        echo "No debug.log found"
    fi

    echo ""
    echo "=== End of Diagnostic Report ==="

} | tee "$OUTPUT_FILE"

echo ""
echo "Diagnostic report saved to: $OUTPUT_FILE"
echo "Please include this file when reporting issues."
```

### Quick Health Check

```bash
#!/bin/bash

health_check() {
    local tests_passed=0
    local tests_failed=0

    # Test 1: CLI installed
    if command -v cakemail &>/dev/null; then
        echo "✓ CLI installed"
        ((tests_passed++))
    else
        echo "✗ CLI not found"
        ((tests_failed++))
    fi

    # Test 2: Credentials configured
    if [ -f .env ] || [ -f ~/.cakemail/.env ] || [ -n "$CAKEMAIL_EMAIL" ]; then
        echo "✓ Credentials configured"
        ((tests_passed++))
    else
        echo "✗ Credentials missing"
        ((tests_failed++))
    fi

    # Test 3: API reachable
    if curl -f -s -I https://api.cakemail.com &>/dev/null; then
        echo "✓ API reachable"
        ((tests_passed++))
    else
        echo "✗ API unreachable"
        ((tests_failed++))
    fi

    # Test 4: Authentication works
    if cakemail account test &>/dev/null; then
        echo "✓ Authentication successful"
        ((tests_passed++))
    else
        echo "✗ Authentication failed"
        ((tests_failed++))
    fi

    echo ""
    echo "Results: $tests_passed passed, $tests_failed failed"

    [ $tests_failed -eq 0 ] && return 0 || return 1
}

health_check
```

## Bug Reporting

### Collect Debug Information

```bash
#!/bin/bash

# Collect info for bug report
echo "Please provide this information when reporting bugs:"
echo ""

echo "1. CLI Version:"
cakemail --version

echo ""
echo "2. Command that failed:"
echo "   $ cakemail campaigns schedule 790"

echo ""
echo "3. Error output:"
DEBUG=cakemail:* cakemail campaigns schedule 790 2>&1 | \
    sed 's/password=.*/password=***redacted***/'

echo ""
echo "4. System information:"
uname -a

echo ""
echo "5. Network test:"
curl -I https://api.cakemail.com 2>&1 | head -5
```

### Minimal Reproducible Example

```bash
#!/bin/bash

# Create minimal reproduction
echo "=== Minimal Reproducible Example ==="

# Clean state
rm -f .env debug.log

# Configure (with dummy creds for example)
cat > .env << 'EOF'
CAKEMAIL_EMAIL=test@example.com
CAKEMAIL_PASSWORD=test_password
EOF

# Enable debug
export DEBUG=cakemail:*

# Reproduce issue
echo "Running: cakemail campaigns list"
cakemail campaigns list 2>&1

# Output shows exactly what happens
# Include this in bug report
```

## Best Practices

1. **Always enable debug mode** when troubleshooting
   ```bash
   export DEBUG=cakemail:*
   ```

2. **Save logs** for analysis
   ```bash
   cakemail commands 2>&1 | tee debug.log
   ```

3. **Test in isolation** to identify root cause
   ```bash
   # Remove variables that might interfere
   env -i HOME=$HOME cakemail campaigns list
   ```

4. **Use verbose output** for detailed information
   ```bash
   cakemail campaigns list --verbose
   ```

5. **Check exit codes** in scripts
   ```bash
   if ! cakemail campaigns schedule 790; then
       echo "Failed with exit code: $?"
   fi
   ```

6. **Redact sensitive information** before sharing
   ```bash
   sed 's/password=.*/password=***redacted***/' debug.log
   ```

## Debugging Checklist

When troubleshooting:

- [ ] Enabled debug mode (`DEBUG=cakemail:*`)
- [ ] Checked CLI version (`cakemail --version`)
- [ ] Verified credentials exist and are valid
- [ ] Tested network connectivity
- [ ] Checked API status (status.cakemail.com)
- [ ] Saved error logs
- [ ] Tried command with verbose flag
- [ ] Isolated issue to specific command/operation
- [ ] Checked for known issues on GitHub
- [ ] Collected diagnostic information

## Support Resources

- **GitHub Issues**: https://github.com/cakemail-org/cakemail-cli/issues
- **Documentation**: https://docs.cakemail.com
- **Support Email**: support@cakemail.com
- **Status Page**: https://status.cakemail.com
