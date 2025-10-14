# Connection Problems

Diagnose and resolve network connectivity and API communication issues.

## Overview

Common connection problems:
- Network timeouts
- DNS resolution failures
- SSL/TLS certificate errors
- Proxy configuration issues
- Firewall blocking
- API service disruptions

## Network Timeouts

### Error: "Connection timeout" or "Request timeout"

**Cause:** Request takes too long to complete.

**Solutions:**

```bash
# Check internet connectivity
$ ping -c 3 google.com
PING google.com: 64 bytes from...

# Test Cakemail API specifically
$ ping -c 3 api.cakemail.com

# Test with curl
$ curl -I https://api.cakemail.com
HTTP/2 200

# Increase timeout (if supported)
$ export CAKEMAIL_TIMEOUT=60000  # 60 seconds

# Check if slow network
$ time curl https://api.cakemail.com
real    0m5.234s  # If > 10s, network is slow

# Try from different network
# - Switch from WiFi to ethernet
# - Try mobile hotspot
# - Use VPN if corporate network
```

### Slow API Responses

**Problem:** Commands take very long to complete.

**Solutions:**

```bash
# Measure response time
$ time cakemail lists list

# Compare to direct API call
$ time curl -s https://api.cakemail.com/v1/lists

# If API is slow:
# - Check API status: status.cakemail.com
# - Use filters to reduce data transfer
$ cakemail lists list --limit 10

# If network is slow:
# - Use caching (see Performance guide)
# - Reduce API calls
# - Use compact output format
$ cakemail lists list -f compact
```

## DNS Resolution Issues

### Error: "Could not resolve host" or "Name resolution failed"

**Cause:** Cannot resolve domain name to IP address.

**Solutions:**

```bash
# Test DNS resolution
$ nslookup api.cakemail.com
Server: 8.8.8.8
Address: 8.8.8.8#53

Name: api.cakemail.com
Address: 104.18.x.x

# If fails, try different DNS server
$ nslookup api.cakemail.com 8.8.8.8  # Google DNS
$ nslookup api.cakemail.com 1.1.1.1  # Cloudflare DNS

# Change system DNS (macOS)
$ networksetup -setdnsservers Wi-Fi 8.8.8.8 1.1.1.1

# Change system DNS (Linux)
$ echo "nameserver 8.8.8.8" | sudo tee /etc/resolv.conf

# Flush DNS cache (macOS)
$ sudo dscacheutil -flushcache

# Flush DNS cache (Linux)
$ sudo systemd-resolve --flush-caches

# Test again
$ cakemail lists list
```

### DNS Cache Issues

**Problem:** Cached DNS pointing to old IP.

**Solutions:**

```bash
# Clear DNS cache

# macOS
$ sudo dscacheutil -flushcache
$ sudo killall -HUP mDNSResponder

# Linux (systemd)
$ sudo systemd-resolve --flush-caches

# Windows
$ ipconfig /flushdns

# Verify new resolution
$ nslookup api.cakemail.com

# Force CLI to use specific IP (temporary)
$ echo "104.18.x.x api.cakemail.com" | sudo tee -a /etc/hosts
```

## SSL/TLS Certificate Errors

### Error: "SSL certificate problem" or "Certificate verification failed"

**Cause:** SSL certificate validation issues.

**Solutions:**

```bash
# Check certificate
$ openssl s_client -connect api.cakemail.com:443 -showcerts

# Verify certificate validity
$ curl -vI https://api.cakemail.com 2>&1 | grep -i certificate

# Update CA certificates (Linux)
$ sudo apt-get update
$ sudo apt-get install ca-certificates

# Update CA certificates (macOS)
$ brew install ca-certificates

# Temporarily skip verification (NOT RECOMMENDED FOR PRODUCTION)
$ export NODE_TLS_REJECT_UNAUTHORIZED=0
$ cakemail lists list
$ unset NODE_TLS_REJECT_UNAUTHORIZED

# Check system time (cert validation requires accurate time)
$ date
```

### Certificate Expiration

**Problem:** Cakemail's certificate expired (rare).

**Solutions:**

```bash
# Check certificate expiration
$ echo | openssl s_client -connect api.cakemail.com:443 2>/dev/null | \
  openssl x509 -noout -dates

notBefore=Jan 1 00:00:00 2024 GMT
notAfter=Jan 1 23:59:59 2025 GMT

# If expired:
# - Check status.cakemail.com
# - Wait for Cakemail to renew
# - Contact support

# Check your system time is correct
$ date
# Incorrect time causes cert validation to fail

# Sync system time (Linux)
$ sudo ntpdate -s time.nist.gov

# Sync system time (macOS)
$ sudo sntp -sS time.apple.com
```

## Proxy Configuration

### Behind Corporate Proxy

**Problem:** CLI cannot reach API through corporate proxy.

**Solutions:**

```bash
# Configure HTTP proxy
$ export HTTP_PROXY=http://proxy.company.com:8080
$ export HTTPS_PROXY=http://proxy.company.com:8080

# With authentication
$ export HTTP_PROXY=http://user:password@proxy.company.com:8080
$ export HTTPS_PROXY=http://user:password@proxy.company.com:8080

# Exclude localhost (if needed)
$ export NO_PROXY=localhost,127.0.0.1

# Test with curl
$ curl -I https://api.cakemail.com

# Test CLI
$ cakemail lists list

# Make permanent (add to ~/.bashrc or ~/.zshrc)
$ cat >> ~/.bashrc << 'EOF'
export HTTP_PROXY=http://proxy.company.com:8080
export HTTPS_PROXY=http://proxy.company.com:8080
EOF
```

### Proxy Authentication Issues

**Problem:** Proxy requires authentication.

**Solutions:**

```bash
# URL-encode special characters in password
# If password is: p@ssw0rd!
# Encoded: p%40ssw0rd%21

# Use encoded password
$ export HTTP_PROXY=http://user:p%40ssw0rd%21@proxy.company.com:8080

# Or use .netrc file (more secure)
$ cat > ~/.netrc << EOF
machine proxy.company.com
login user
password p@ssw0rd!
EOF
$ chmod 600 ~/.netrc

# Configure proxy in npm (for CLI installation)
$ npm config set proxy http://proxy.company.com:8080
$ npm config set https-proxy http://proxy.company.com:8080
```

## Firewall Issues

### Error: "Connection refused" or "Network unreachable"

**Cause:** Firewall blocking outbound HTTPS.

**Solutions:**

```bash
# Check if port 443 is reachable
$ nc -zv api.cakemail.com 443
Connection to api.cakemail.com 443 port [tcp/https] succeeded!

# If fails:
# - Firewall blocking outbound HTTPS
# - Network restrictions

# Test with telnet
$ telnet api.cakemail.com 443
Trying 104.18.x.x...
Connected to api.cakemail.com.

# Check firewall rules (Linux)
$ sudo iptables -L | grep -i drop

# Allow HTTPS outbound (Linux - requires admin)
$ sudo iptables -A OUTPUT -p tcp --dport 443 -j ACCEPT

# macOS firewall
# System Preferences → Security & Privacy → Firewall
# Allow Node.js or terminal application

# Corporate firewall
# Contact IT to whitelist:
# - api.cakemail.com
# - *.cakemail.com
# Port: 443 (HTTPS)
```

### VPN Interference

**Problem:** VPN blocking or routing issues.

**Solutions:**

```bash
# Test without VPN
$ # Disconnect VPN
$ cakemail lists list

# If works without VPN:
# - VPN routing all traffic through restrictive gateway
# - VPN blocking certain domains

# Split tunnel configuration
# Route only corporate traffic through VPN
# Contact IT for split tunnel setup

# Or add exception for Cakemail
# VPN settings → Exceptions
# Add: api.cakemail.com

# Test with VPN server's DNS
$ nslookup api.cakemail.com <VPN_DNS_SERVER>
```

## API Service Issues

### Check API Status

```bash
# Check if API is down
$ curl -I https://api.cakemail.com
HTTP/2 503  # Service unavailable

# Check status page
$ curl -s https://status.cakemail.com | grep -i status

# Check from external service
$ curl -I https://api.cakemail.com \
  --resolve api.cakemail.com:443:8.8.8.8

# If API is down:
# - Check status.cakemail.com
# - Check @cakemail on Twitter
# - Wait for service restoration
# - Contact support for estimated resolution time
```

### Rate Limiting

**Error:** "Too many requests" or "Rate limit exceeded"

**Solutions:**

```bash
# You're making too many requests
# API limits: ~100 requests/minute (example)

# Check rate limit headers
$ curl -I https://api.cakemail.com/v1/lists
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1710345600

# Wait until reset time
$ date -d @1710345600
Wed Mar 13 14:00:00 EDT 2024

# Add delays between requests
$ for id in {1..10}; do
    cakemail campaigns get $id
    sleep 1  # Wait 1 second
  done

# Use bulk operations instead
$ cakemail campaigns list  # Single request

# Implement exponential backoff (see Scripting Patterns)
```

## Connection Debugging

### Verbose Network Diagnostics

```bash
# Enable verbose curl output
$ curl -v https://api.cakemail.com 2>&1 | less

# Check headers
* Trying 104.18.x.x:443...
* Connected to api.cakemail.com (104.18.x.x) port 443
* ALPN, offering h2
* ALPN, offering http/1.1
* successfully set certificate verify locations
* TLSv1.3 (OUT), TLS handshake, Client hello (1):
* TLSv1.3 (IN), TLS handshake, Server hello (2):
...

# Trace network path
$ traceroute api.cakemail.com
traceroute to api.cakemail.com (104.18.x.x), 30 hops max
 1  router.local (192.168.1.1)  2.123 ms
 2  10.x.x.x  5.456 ms
 ...

# Check packet loss
$ ping -c 100 api.cakemail.com | grep loss
100 packets transmitted, 98 received, 2% packet loss
```

### Test with Different Tools

```bash
# wget
$ wget -q -O- https://api.cakemail.com
$ echo $?  # 0 = success

# curl
$ curl -f https://api.cakemail.com
$ echo $?  # 0 = success

# nc (netcat)
$ nc -zv api.cakemail.com 443
Connection to api.cakemail.com 443 succeeded!

# openssl
$ openssl s_client -connect api.cakemail.com:443
CONNECTED(00000005)
...

# If one works but CLI doesn't:
# - Node.js network issues
# - CLI bug
# - Reinstall CLI
```

## Environment-Specific Issues

### Docker Containers

**Problem:** CLI fails inside Docker container.

**Solutions:**

```bash
# Check container DNS
$ docker run --rm alpine nslookup api.cakemail.com

# Use host network (Linux only)
$ docker run --network host cakemail-cli

# Configure DNS in container
$ docker run --dns 8.8.8.8 --dns 1.1.1.1 cakemail-cli

# Check if behind corporate proxy
$ docker run -e HTTP_PROXY=http://proxy:8080 cakemail-cli

# Dockerfile with proxy
FROM node:18
ENV HTTP_PROXY=http://proxy:8080
ENV HTTPS_PROXY=http://proxy:8080
```

### CI/CD Environments

**Problem:** Works locally but fails in CI.

**Solutions:**

```bash
# GitHub Actions - check network
- name: Test connectivity
  run: |
    curl -I https://api.cakemail.com
    nslookup api.cakemail.com

# GitLab CI - use different runner
# Some runners have restricted network access

# Check if CI server IP is blocked
# Contact Cakemail support to whitelist

# Use retry logic in CI
- name: Deploy campaign
  run: |
    for i in {1..3}; do
      cakemail campaigns schedule $ID && break
      sleep 5
    done
```

### Mobile Hotspot / Tethering

**Problem:** Different behavior on mobile network.

**Solutions:**

```bash
# Mobile carriers may block/throttle HTTPS
# - Try different carrier
# - Use VPN to bypass throttling
# - Disable mobile optimization in carrier settings

# Check if carrier DNS causing issues
$ nslookup api.cakemail.com

# Use public DNS
# iOS: Settings → Wi-Fi → Configure DNS → Manual
# Android: Settings → Network → Private DNS → dns.google
```

## Network Testing Scripts

### Comprehensive Connectivity Test

```bash
#!/bin/bash

echo "=== Cakemail Connectivity Test ==="
echo ""

# 1. Internet connectivity
echo "1. Testing internet connectivity..."
if ping -c 3 google.com &>/dev/null; then
    echo "✓ Internet: OK"
else
    echo "✗ Internet: FAIL"
    exit 1
fi

# 2. DNS resolution
echo ""
echo "2. Testing DNS resolution..."
if nslookup api.cakemail.com &>/dev/null; then
    echo "✓ DNS resolution: OK"
    IP=$(nslookup api.cakemail.com | grep -A1 "Name:" | grep "Address:" | awk '{print $2}' | head -1)
    echo "  Resolved to: $IP"
else
    echo "✗ DNS resolution: FAIL"
    exit 1
fi

# 3. Port connectivity
echo ""
echo "3. Testing port 443 connectivity..."
if nc -zv api.cakemail.com 443 2>&1 | grep -q "succeeded"; then
    echo "✓ Port 443: OK"
else
    echo "✗ Port 443: FAIL"
    exit 1
fi

# 4. SSL certificate
echo ""
echo "4. Testing SSL certificate..."
if openssl s_client -connect api.cakemail.com:443 </dev/null 2>/dev/null | \
   grep -q "Verify return code: 0"; then
    echo "✓ SSL certificate: OK"
else
    echo "⚠ SSL certificate: WARNING"
fi

# 5. API availability
echo ""
echo "5. Testing API availability..."
if curl -f -s -I https://api.cakemail.com | grep -q "HTTP/2 200"; then
    echo "✓ API: OK"
else
    echo "✗ API: FAIL"
    exit 1
fi

# 6. API latency
echo ""
echo "6. Measuring API latency..."
LATENCY=$(curl -o /dev/null -s -w '%{time_total}' https://api.cakemail.com)
echo "  Latency: ${LATENCY}s"

if (( $(echo "$LATENCY > 5.0" | bc -l) )); then
    echo "⚠ High latency (slow network)"
fi

echo ""
echo "=== All tests passed ==="
```

## Quick Fixes

### Reset Network Stack

```bash
# macOS
$ sudo ifconfig en0 down
$ sudo ifconfig en0 up

# Linux
$ sudo systemctl restart NetworkManager

# Flush DNS
$ sudo dscacheutil -flushcache  # macOS
$ sudo systemd-resolve --flush-caches  # Linux

# Reset routing table
$ sudo route flush  # macOS
$ sudo ip route flush cache  # Linux
```

### Check System Configuration

```bash
# View network settings
$ ifconfig  # or ip addr

# Check gateway
$ netstat -rn | grep default

# View DNS servers
$ cat /etc/resolv.conf

# Check proxy settings
$ env | grep -i proxy

# Verify time sync (important for SSL)
$ date
```

## Getting Help

If connection issues persist:

1. Run connectivity test script
2. Test with `curl` to isolate issue
3. Check firewall/proxy settings
4. Verify API status: status.cakemail.com
5. Contact IT (if corporate network)
6. Create GitHub issue with diagnostics

