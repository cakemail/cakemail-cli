# Scripting Patterns & Best Practices

Advanced patterns and techniques for building robust automation scripts with the Cakemail CLI.

## Overview

Learn to:
- Build reliable automation scripts
- Handle errors gracefully
- Implement retry logic
- Process data efficiently
- Create reusable functions
- Follow best practices

## Basic Script Structure

### Complete Script Template

```bash
#!/bin/bash

# Script: campaign-automation.sh
# Description: Automated campaign workflow
# Usage: ./campaign-automation.sh <list-id>

set -euo pipefail  # Exit on error, undefined vars, pipe failures

# Configuration
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly LOG_FILE="${SCRIPT_DIR}/automation.log"
readonly ERROR_EMAIL="admin@company.com"

# Functions
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOG_FILE"
}

error_exit() {
    log "ERROR: $1"
    echo "Script failed: $1" | mail -s "Automation Error" "$ERROR_EMAIL"
    exit 1
}

# Main script
main() {
    local list_id="$1"

    log "Starting automation for list $list_id"

    # Your logic here
    if ! cakemail lists get "$list_id" &>/dev/null; then
        error_exit "List $list_id not found"
    fi

    log "Automation completed successfully"
}

# Validate arguments
if [ $# -ne 1 ]; then
    echo "Usage: $0 <list-id>"
    exit 1
fi

main "$@"
```

## Error Handling Patterns

### Retry Logic

```bash
#!/bin/bash

# Retry function with exponential backoff
retry() {
    local max_attempts=3
    local attempt=1
    local delay=2

    while [ $attempt -le $max_attempts ]; do
        if "$@"; then
            return 0
        else
            if [ $attempt -lt $max_attempts ]; then
                log "Attempt $attempt failed. Retrying in ${delay}s..."
                sleep $delay
                delay=$((delay * 2))  # Exponential backoff
                ((attempt++))
            else
                log "All $max_attempts attempts failed"
                return 1
            fi
        fi
    done
}

# Usage
if retry cakemail campaigns create -n "Test" -l 123 -s 101; then
    log "Campaign created successfully"
else
    error_exit "Failed to create campaign after retries"
fi
```

### Graceful Degradation

```bash
#!/bin/bash

# Try operation, fallback if it fails
create_campaign_with_fallback() {
    local list_id="$1"
    local template_id="$2"
    local fallback_template="$3"

    # Try with preferred template
    if campaign_id=$(cakemail campaigns create \
        -n "Newsletter" \
        -l "$list_id" \
        -s 101 \
        --template "$template_id" \
        -f json 2>/dev/null | jq -r '.id'); then
        echo "$campaign_id"
        return 0
    fi

    # Fallback to basic template
    log "Primary template failed, using fallback"
    campaign_id=$(cakemail campaigns create \
        -n "Newsletter" \
        -l "$list_id" \
        -s 101 \
        --template "$fallback_template" \
        -f json | jq -r '.id')
    echo "$campaign_id"
}
```

### Cleanup on Exit

```bash
#!/bin/bash

# Temporary files
temp_files=()

cleanup() {
    log "Cleaning up temporary files..."
    for file in "${temp_files[@]}"; do
        [ -f "$file" ] && rm -f "$file"
    done
}

# Register cleanup
trap cleanup EXIT

# Create temp file
temp_file=$(mktemp)
temp_files+=("$temp_file")

# Use temp file
cakemail contacts export 123 > "$temp_file"

# Cleanup happens automatically on exit
```

## Data Processing Patterns

### Batch Processing

```bash
#!/bin/bash

# Process items in batches
batch_process() {
    local items=("$@")
    local batch_size=10
    local total=${#items[@]}
    local processed=0

    for ((i=0; i<total; i+=batch_size)); do
        local batch=("${items[@]:i:batch_size}")

        log "Processing batch $((i/batch_size + 1)) (${#batch[@]} items)"

        for item in "${batch[@]}"; do
            process_item "$item"
            ((processed++))
        done

        # Progress update
        local percent=$((processed * 100 / total))
        log "Progress: $processed/$total ($percent%)"

        # Rate limiting
        sleep 1
    done
}

process_item() {
    local email="$1"
    cakemail contacts add 123 -e "$email"
}

# Read emails from file
mapfile -t emails < emails.txt
batch_process "${emails[@]}"
```

### Parallel Processing

```bash
#!/bin/bash

# Process items in parallel (with limit)
parallel_process() {
    local max_jobs=5
    local items=("$@")

    for item in "${items[@]}"; do
        # Wait if too many jobs running
        while [ $(jobs -r | wc -l) -ge $max_jobs ]; do
            sleep 0.1
        done

        # Process in background
        process_item "$item" &
    done

    # Wait for all jobs to complete
    wait
}

process_item() {
    local campaign_id="$1"
    cakemail reports campaign "$campaign_id" -f json > "report-${campaign_id}.json"
}

# Process all campaigns in parallel
campaigns=(790 791 792 793 794)
parallel_process "${campaigns[@]}"
```

### Streaming Large Datasets

```bash
#!/bin/bash

# Stream process large CSV without loading into memory
stream_process_csv() {
    local input_file="$1"
    local line_count=0

    # Skip header
    tail -n +2 "$input_file" | while IFS=, read -r email first_name last_name; do
        # Process each line
        cakemail contacts add 123 -e "$email" -f "$first_name" -l "$last_name"

        ((line_count++))
        if [ $((line_count % 100)) -eq 0 ]; then
            log "Processed $line_count contacts"
        fi
    done

    log "Total processed: $line_count contacts"
}

stream_process_csv large-contact-list.csv
```

## Reusable Functions

### Configuration Loading

```bash
#!/bin/bash

# Load configuration from file
load_config() {
    local config_file="${1:-.cakemail.conf}"

    if [ ! -f "$config_file" ]; then
        error_exit "Config file not found: $config_file"
    fi

    # Source config file
    # shellcheck source=/dev/null
    source "$config_file"

    # Validate required variables
    : "${LIST_ID:?LIST_ID not set in config}"
    : "${SENDER_ID:?SENDER_ID not set in config}"
}

# Config file: .cakemail.conf
# LIST_ID=123
# SENDER_ID=101
# TEMPLATE_ID=201

load_config
```

### JSON Parsing

```bash
#!/bin/bash

# Extract values from JSON responses
get_json_value() {
    local json="$1"
    local key="$2"
    echo "$json" | jq -r ".$key"
}

# Get multiple values
parse_campaign_response() {
    local response="$1"

    campaign_id=$(get_json_value "$response" "id")
    campaign_name=$(get_json_value "$response" "name")
    campaign_status=$(get_json_value "$response" "status")

    echo "ID: $campaign_id, Name: $campaign_name, Status: $campaign_status"
}

# Usage
response=$(cakemail campaigns get 790 -f json)
parse_campaign_response "$response"
```

### Date Handling

```bash
#!/bin/bash

# Calculate dates for filtering
get_date_range() {
    local days_ago="$1"

    # Start date (N days ago)
    start_date=$(date -d "$days_ago days ago" +%Y-%m-%d)

    # End date (today)
    end_date=$(date +%Y-%m-%d)

    echo "$start_date $end_date"
}

# Get campaigns from last 30 days
read -r start end <<< "$(get_date_range 30)"
cakemail campaigns list --filter "delivered_at>=$start;delivered_at<=$end"
```

### Progress Indicators

```bash
#!/bin/bash

# Show progress bar
show_progress() {
    local current="$1"
    local total="$2"
    local width=50

    local percent=$((current * 100 / total))
    local filled=$((width * current / total))
    local empty=$((width - filled))

    printf "\rProgress: [%${filled}s%${empty}s] %d%%" | tr ' ' '='
    printf "%${empty}s %d/%d" "" "$current" "$total"

    if [ "$current" -eq "$total" ]; then
        echo ""
    fi
}

# Usage
total=100
for i in $(seq 1 $total); do
    # Process item
    sleep 0.1
    show_progress $i $total
done
```

## Validation Patterns

### Input Validation

```bash
#!/bin/bash

# Validate email format
validate_email() {
    local email="$1"
    local regex='^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'

    if [[ ! $email =~ $regex ]]; then
        return 1
    fi
    return 0
}

# Validate required parameters
validate_params() {
    local list_id="$1"
    local sender_id="$2"

    if [ -z "$list_id" ]; then
        error_exit "List ID is required"
    fi

    if ! [[ $list_id =~ ^[0-9]+$ ]]; then
        error_exit "List ID must be numeric"
    fi

    # Verify list exists
    if ! cakemail lists get "$list_id" &>/dev/null; then
        error_exit "List $list_id not found"
    fi
}
```

### Pre-flight Checks

```bash
#!/bin/bash

# Run pre-flight checks before main operations
preflight_checks() {
    log "Running pre-flight checks..."

    # Check CLI is installed
    if ! command -v cakemail &>/dev/null; then
        error_exit "Cakemail CLI not found. Install with: npm install -g @cakemail-org/cakemail-cli"
    fi

    # Check authentication
    if ! cakemail account test &>/dev/null; then
        error_exit "Authentication failed. Run: cakemail config init"
    fi

    # Check dependencies
    for cmd in jq curl; do
        if ! command -v $cmd &>/dev/null; then
            error_exit "Required command not found: $cmd"
        fi
    done

    # Check disk space
    local available=$(df -BG . | tail -1 | awk '{print $4}' | tr -d 'G')
    if [ "$available" -lt 1 ]; then
        error_exit "Insufficient disk space (need at least 1GB)"
    fi

    log "All pre-flight checks passed"
}
```

## Logging Patterns

### Structured Logging

```bash
#!/bin/bash

# Log levels
readonly LOG_LEVEL_DEBUG=0
readonly LOG_LEVEL_INFO=1
readonly LOG_LEVEL_WARN=2
readonly LOG_LEVEL_ERROR=3

# Current log level
LOG_LEVEL=${LOG_LEVEL:-$LOG_LEVEL_INFO}

log_debug() { [ $LOG_LEVEL -le $LOG_LEVEL_DEBUG ] && log "DEBUG: $*"; }
log_info()  { [ $LOG_LEVEL -le $LOG_LEVEL_INFO ]  && log "INFO:  $*"; }
log_warn()  { [ $LOG_LEVEL -le $LOG_LEVEL_WARN ]  && log "WARN:  $*"; }
log_error() { [ $LOG_LEVEL -le $LOG_LEVEL_ERROR ] && log "ERROR: $*"; }

# Usage
LOG_LEVEL=$LOG_LEVEL_DEBUG  # Show all logs
log_debug "Debug message"
log_info "Info message"
log_warn "Warning message"
log_error "Error message"
```

### Log Rotation

```bash
#!/bin/bash

# Rotate log file if too large
rotate_log() {
    local log_file="$1"
    local max_size=$((10 * 1024 * 1024))  # 10MB

    if [ -f "$log_file" ]; then
        local size=$(stat -f%z "$log_file" 2>/dev/null || stat -c%s "$log_file" 2>/dev/null)

        if [ "$size" -gt "$max_size" ]; then
            local timestamp=$(date +%Y%m%d-%H%M%S)
            mv "$log_file" "${log_file}.${timestamp}"
            log "Log rotated: ${log_file}.${timestamp}"
        fi
    fi
}

# Rotate before starting
rotate_log "$LOG_FILE"
```

## Testing Patterns

### Dry Run Mode

```bash
#!/bin/bash

# Support dry-run mode
DRY_RUN=${DRY_RUN:-false}

execute() {
    local command="$*"

    if [ "$DRY_RUN" = true ]; then
        log "[DRY RUN] Would execute: $command"
        return 0
    else
        log "Executing: $command"
        eval "$command"
    fi
}

# Usage
execute cakemail campaigns create -n "Test" -l 123 -s 101

# Run in dry-run mode
DRY_RUN=true ./script.sh
```

### Mock Responses

```bash
#!/bin/bash

# Mock mode for testing
MOCK_MODE=${MOCK_MODE:-false}

cakemail_wrapper() {
    if [ "$MOCK_MODE" = true ]; then
        # Return mock data
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
        # Execute real command
        cakemail "$@"
    fi
}

# Use wrapper instead of direct calls
response=$(cakemail_wrapper campaigns get 790 -f json)
```

## Performance Patterns

### Caching Results

```bash
#!/bin/bash

# Cache results to avoid redundant API calls
CACHE_DIR=".cache"
mkdir -p "$CACHE_DIR"

cached_call() {
    local cache_key="$1"
    shift
    local command="$*"
    local cache_file="$CACHE_DIR/$cache_key"
    local cache_ttl=3600  # 1 hour

    # Check if cached and not expired
    if [ -f "$cache_file" ]; then
        local age=$(($(date +%s) - $(stat -f%m "$cache_file" 2>/dev/null || stat -c%Y "$cache_file")))
        if [ "$age" -lt "$cache_ttl" ]; then
            cat "$cache_file"
            return 0
        fi
    fi

    # Execute and cache
    eval "$command" | tee "$cache_file"
}

# Usage - list will be cached for 1 hour
lists=$(cached_call "lists" cakemail lists list -f json)
```

### Rate Limiting

```bash
#!/bin/bash

# Rate limiter using token bucket algorithm
declare -A rate_limit_tokens
declare -A rate_limit_last_refill

rate_limit() {
    local key="${1:-default}"
    local max_tokens=10
    local refill_rate=1  # tokens per second
    local current_time=$(date +%s)

    # Initialize if needed
    if [ -z "${rate_limit_tokens[$key]}" ]; then
        rate_limit_tokens[$key]=$max_tokens
        rate_limit_last_refill[$key]=$current_time
    fi

    # Refill tokens
    local elapsed=$((current_time - rate_limit_last_refill[$key]))
    local new_tokens=$((elapsed * refill_rate))
    if [ $new_tokens -gt 0 ]; then
        rate_limit_tokens[$key]=$((rate_limit_tokens[$key] + new_tokens))
        if [ ${rate_limit_tokens[$key]} -gt $max_tokens ]; then
            rate_limit_tokens[$key]=$max_tokens
        fi
        rate_limit_last_refill[$key]=$current_time
    fi

    # Check if token available
    if [ ${rate_limit_tokens[$key]} -gt 0 ]; then
        rate_limit_tokens[$key]=$((rate_limit_tokens[$key] - 1))
        return 0
    else
        # Wait for token
        sleep 1
        rate_limit "$key"
    fi
}

# Usage
for i in {1..20}; do
    rate_limit "api_calls"
    cakemail campaigns list
done
```

## Best Practices

1. **Use strict mode**: `set -euo pipefail`
2. **Validate all inputs**: Check before processing
3. **Handle errors gracefully**: Don't fail silently
4. **Log everything**: Comprehensive logging
5. **Use functions**: Modular, reusable code
6. **Quote variables**: Prevent word splitting
7. **Check exit codes**: Test command success
8. **Clean up resources**: Temp files, background jobs
9. **Document scripts**: Clear comments
10. **Test thoroughly**: Dry-run and mock modes

