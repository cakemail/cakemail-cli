# Performance Optimization

Optimize Cakemail CLI operations for speed, efficiency, and resource usage.

## Overview

Learn to:
- Reduce API call overhead
- Implement intelligent caching
- Optimize data processing
- Minimize network requests
- Use parallel processing effectively
- Profile and benchmark operations
- Handle large datasets efficiently

## API Call Optimization

### Request Batching

```bash
#!/bin/bash

# Bad: Multiple individual API calls
for id in {1..100}; do
    cakemail contacts get 123 "$id"  # 100 API calls
done

# Good: Single list call with pagination
cakemail contacts list 123 --per-page 100 -f json | \
    jq -r '.data[]'  # 1 API call
```

### Filter Server-Side

```bash
#!/bin/bash

# Bad: Fetch all, filter locally
cakemail contacts list 123 -f json | \
    jq '.data[] | select(.status == "subscribed")'  # Transfers all data

# Good: Filter on server
cakemail contacts list 123 \
    --filter "status==subscribed" \
    -f json  # Only transfers matching data
```

### Use Appropriate Output Formats

```bash
#!/bin/bash

# For parsing: Use JSON (most efficient)
campaign_ids=$(cakemail campaigns list -f json | jq -r '.data[].id')

# For display: Use table (formatted)
cakemail campaigns list  # Default table format

# For export: Use CSV (smallest)
cakemail contacts list 123 -f csv > contacts.csv
```

## Caching Strategies

### Time-Based Cache

```bash
#!/bin/bash

# Cache with TTL (Time To Live)
CACHE_DIR=".cache"
CACHE_TTL=3600  # 1 hour

mkdir -p "$CACHE_DIR"

cached_call() {
    local cache_key="$1"
    shift
    local command="$*"
    local cache_file="$CACHE_DIR/${cache_key}.cache"
    local cache_time_file="$CACHE_DIR/${cache_key}.time"

    # Check cache exists and is fresh
    if [ -f "$cache_file" ] && [ -f "$cache_time_file" ]; then
        local cached_time=$(cat "$cache_time_file")
        local current_time=$(date +%s)
        local age=$((current_time - cached_time))

        if [ $age -lt $CACHE_TTL ]; then
            echo "Cache hit: $cache_key (age: ${age}s)" >&2
            cat "$cache_file"
            return 0
        fi
    fi

    # Cache miss - fetch and store
    echo "Cache miss: $cache_key" >&2
    local result=$(eval "$command")
    echo "$result" | tee "$cache_file"
    date +%s > "$cache_time_file"
}

# Usage
lists=$(cached_call "lists" cakemail lists list -f json)
echo "$lists" | jq '.data[].name'

# Second call uses cache
lists=$(cached_call "lists" cakemail lists list -f json)  # Instant!
```

### Content-Based Cache Invalidation

```bash
#!/bin/bash

# Cache with content hash for invalidation
cache_with_hash() {
    local cache_key="$1"
    shift
    local command="$*"
    local cache_file=".cache/${cache_key}.cache"
    local hash_file=".cache/${cache_key}.hash"

    # Calculate content hash
    local current_hash=$(echo "$command" | md5sum | cut -d' ' -f1)

    # Check if hash matches
    if [ -f "$hash_file" ] && [ "$(cat "$hash_file")" = "$current_hash" ]; then
        if [ -f "$cache_file" ]; then
            cat "$cache_file"
            return 0
        fi
    fi

    # Fetch and cache
    eval "$command" | tee "$cache_file"
    echo "$current_hash" > "$hash_file"
}

# Usage - cache automatically invalidates when command changes
cache_with_hash "campaigns-recent" \
    cakemail campaigns list --filter "sent_at>=2024-01-01" -f json
```

### Multi-Level Cache

```bash
#!/bin/bash

# Memory + Disk cache for maximum performance
declare -A MEMORY_CACHE

multi_level_cache() {
    local key="$1"
    shift
    local command="$*"

    # L1: Memory cache
    if [ -n "${MEMORY_CACHE[$key]}" ]; then
        echo "L1 cache hit" >&2
        echo "${MEMORY_CACHE[$key]}"
        return 0
    fi

    # L2: Disk cache
    local disk_cache=".cache/${key}.cache"
    if [ -f "$disk_cache" ]; then
        local age=$(($(date +%s) - $(stat -f%m "$disk_cache" 2>/dev/null || stat -c%Y "$disk_cache")))
        if [ $age -lt 3600 ]; then
            echo "L2 cache hit" >&2
            local result=$(cat "$disk_cache")
            MEMORY_CACHE[$key]="$result"
            echo "$result"
            return 0
        fi
    fi

    # L3: API call
    echo "API call" >&2
    local result=$(eval "$command")

    # Store in both caches
    MEMORY_CACHE[$key]="$result"
    echo "$result" > "$disk_cache"
    echo "$result"
}

# Usage
for i in {1..10}; do
    multi_level_cache "list-123" cakemail lists get 123 -f json
    # First call: API call
    # Subsequent calls: L1 cache hit (instant)
done
```

## Parallel Processing

### Optimal Concurrency

```bash
#!/bin/bash

# Find optimal concurrency level
find_optimal_concurrency() {
    local task="$1"
    local test_items=(1 2 3 4 5 6 7 8 9 10)

    for concurrency in 1 2 3 5 10; do
        echo "Testing concurrency: $concurrency"

        local start_time=$(date +%s)

        # Run tasks in parallel
        local count=0
        for item in "${test_items[@]}"; do
            # Wait if at max concurrency
            while [ $(jobs -r | wc -l) -ge $concurrency ]; do
                sleep 0.1
            done

            eval "$task $item" &
            ((count++))
        done

        wait

        local end_time=$(date +%s)
        local duration=$((end_time - start_time))

        echo "Concurrency $concurrency: ${duration}s"
    done
}

# Test function
test_task() {
    sleep 1  # Simulate API call
}

find_optimal_concurrency "test_task"
```

### Parallel with Progress Tracking

```bash
#!/bin/bash

# Parallel processing with real-time progress
parallel_with_progress() {
    local items=("$@")
    local total=${#items[@]}
    local completed=0
    local max_jobs=5

    # Progress file
    local progress_file=$(mktemp)
    echo "0" > "$progress_file"

    for item in "${items[@]}"; do
        # Wait if at max concurrency
        while [ $(jobs -r | wc -l) -ge $max_jobs ]; do
            # Update progress display
            completed=$(cat "$progress_file")
            local percent=$((completed * 100 / total))
            printf "\rProgress: %d/%d (%d%%) " "$completed" "$total" "$percent"
            sleep 0.1
        done

        # Process in background
        (
            process_item "$item"

            # Update progress counter
            flock "$progress_file" bash -c "echo \$((\$(cat '$progress_file') + 1)) > '$progress_file'"
        ) &
    done

    # Wait for completion
    wait

    completed=$(cat "$progress_file")
    printf "\rProgress: %d/%d (100%%) \n" "$completed" "$total"

    rm "$progress_file"
}

process_item() {
    local campaign_id="$1"
    cakemail reports campaign "$campaign_id" -f json > "report-${campaign_id}.json"
}

# Usage
campaigns=(790 791 792 793 794 795 796 797 798 799)
parallel_with_progress "${campaigns[@]}"
```

## Data Processing Optimization

### Stream Processing

```bash
#!/bin/bash

# Memory-efficient streaming
stream_process_large_list() {
    local list_id="$1"

    echo "Streaming contacts..."

    # Process without loading into memory
    cakemail contacts list "$list_id" -f json | \
        jq -c '.data[]' | \
        while read -r contact; do
            # Process each contact individually
            local email=$(echo "$contact" | jq -r '.email')
            local status=$(echo "$contact" | jq -r '.status')

            if [ "$status" = "bounced" ]; then
                echo "$email" >> bounced.txt
            fi
        done

    echo "Processing complete"
}

stream_process_large_list 123
```

### Batch Processing with Chunking

```bash
#!/bin/bash

# Process in optimal-sized chunks
chunk_process() {
    local input_file="$1"
    local chunk_size=1000
    local temp_dir=$(mktemp -d)

    # Split into chunks
    split -l $chunk_size "$input_file" "$temp_dir/chunk-"

    # Process chunks in parallel
    for chunk in "$temp_dir"/chunk-*; do
        (
            process_chunk "$chunk"
        ) &

        # Limit concurrent chunks
        while [ $(jobs -r | wc -l) -ge 3 ]; do
            sleep 1
        done
    done

    wait
    rm -rf "$temp_dir"
}

process_chunk() {
    local chunk="$1"
    while read -r line; do
        # Process line
        echo "Processing: $line"
    done < "$chunk"
}
```

### Indexed Lookup

```bash
#!/bin/bash

# Build index for fast lookups
build_contact_index() {
    local list_id="$1"
    local index_file=".index-${list_id}.db"

    echo "Building index..."

    # Create simple key-value index
    cakemail contacts list "$list_id" -f json | \
        jq -r '.data[] | "\(.email)|\(.id)"' > "$index_file"

    echo "Index built: $index_file"
}

lookup_contact_id() {
    local email="$1"
    local index_file="$2"

    # O(1) lookup with grep
    grep "^${email}|" "$index_file" | cut -d'|' -f2
}

# Usage
build_contact_index 123

# Fast lookups
contact_id=$(lookup_contact_id "user@example.com" ".index-123.db")
echo "Contact ID: $contact_id"
```

## Network Optimization

### Connection Reuse

```bash
#!/bin/bash

# Reuse HTTP connections (via curl)
CURL_OPTS="--keepalive-time 60 --max-time 30"

optimized_api_call() {
    local endpoint="$1"
    curl $CURL_OPTS "https://api.cakemail.com/$endpoint"
}

# Multiple calls reuse connection
for i in {1..10}; do
    optimized_api_call "campaigns"
done
```

### Request Compression

```bash
#!/bin/bash

# Enable gzip compression
export CAKEMAIL_COMPRESSION=true

# Or via curl
curl --compressed https://api.cakemail.com/campaigns
```

### DNS Caching

```bash
#!/bin/bash

# Cache DNS lookups
export HOSTALIASES=/tmp/hosts
echo "api.cakemail.com $(dig +short api.cakemail.com | head -1)" > /tmp/hosts

# DNS lookup now cached
```

## Profiling and Benchmarking

### Command Timing

```bash
#!/bin/bash

# Measure execution time
time_command() {
    local description="$1"
    shift
    local command="$*"

    echo "Benchmarking: $description"

    local start=$(date +%s%N)
    eval "$command" > /dev/null
    local end=$(date +%s%N)

    local duration=$(( (end - start) / 1000000 ))  # Convert to ms
    echo "Duration: ${duration}ms"
}

# Usage
time_command "List campaigns" cakemail campaigns list
time_command "List with filter" cakemail campaigns list --filter "status==sent"
```

### Performance Profiling

```bash
#!/bin/bash

# Profile script performance
profile_script() {
    PS4='+ $(date +%s.%N) ${BASH_SOURCE}:${LINENO}: ${FUNCNAME[0]:+${FUNCNAME[0]}(): }'
    set -x

    # Your script here
    cakemail lists list
    cakemail campaigns list
    cakemail senders list

    set +x
}

# Run and analyze output
profile_script 2>&1 | awk '{print $2, $NF}' | sort -n
```

### Load Testing

```bash
#!/bin/bash

# Test CLI under load
load_test() {
    local concurrency="$1"
    local requests="$2"
    local completed=0

    echo "Load test: $requests requests, $concurrency concurrent"

    local start_time=$(date +%s)

    for i in $(seq 1 "$requests"); do
        # Wait if at max concurrency
        while [ $(jobs -r | wc -l) -ge $concurrency ]; do
            sleep 0.1
        done

        # Execute request
        (
            cakemail campaigns list -f json > /dev/null
            echo "1"
        ) &
    done

    wait

    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    local rps=$(( requests / duration ))

    echo "Completed: $requests requests in ${duration}s"
    echo "Throughput: ${rps} requests/second"
}

# Run load tests
load_test 5 100
load_test 10 100
```

## Resource Management

### Memory Optimization

```bash
#!/bin/bash

# Monitor memory usage
monitor_memory() {
    local pid=$1

    while kill -0 $pid 2>/dev/null; do
        local mem=$(ps -o rss= -p $pid)
        local mem_mb=$((mem / 1024))
        echo "Memory: ${mem_mb}MB"
        sleep 1
    done
}

# Start process
./large-export.sh &
PID=$!

monitor_memory $PID
```

### Disk Space Management

```bash
#!/bin/bash

# Clean old cache files
clean_cache() {
    local cache_dir=".cache"
    local max_age_days=7

    echo "Cleaning cache older than $max_age_days days..."

    find "$cache_dir" -type f -mtime +$max_age_days -delete

    local freed=$(du -sh "$cache_dir" | cut -f1)
    echo "Cache size: $freed"
}

clean_cache
```

### Rate Limit Optimization

```bash
#!/bin/bash

# Adaptive rate limiting
adaptive_rate_limit() {
    local success_count=0
    local failure_count=0
    local delay=0.5

    for item in "$@"; do
        if process_item "$item"; then
            ((success_count++))

            # Speed up if successful
            if [ $((success_count % 10)) -eq 0 ]; then
                delay=$(echo "$delay * 0.9" | bc)
                [ $(echo "$delay < 0.1" | bc) -eq 1 ] && delay=0.1
            fi
        else
            ((failure_count++))

            # Slow down on failure
            delay=$(echo "$delay * 1.5" | bc)
            echo "Rate limit hit, slowing to ${delay}s"
        fi

        sleep "$delay"
    done

    echo "Completed: $success_count success, $failure_count failures"
}
```

## Query Optimization

### Minimize Data Transfer

```bash
#!/bin/bash

# Bad: Fetch all fields
cakemail campaigns list -f json | jq '.data[].id'

# Good: Request only needed fields (if API supports)
cakemail campaigns list -f json | jq '.data[] | {id, name}'
```

### Smart Pagination

```bash
#!/bin/bash

# Fetch only what you need
fetch_recent_campaigns() {
    local needed=50
    local per_page=50

    # Single request
    cakemail campaigns list \
        --per-page "$per_page" \
        --page 1 \
        -f json
}

# vs. fetching all pages
fetch_all_campaigns() {
    # Potentially hundreds of requests
    local page=1
    while true; do
        local data=$(cakemail campaigns list --page $page -f json)
        [ $(echo "$data" | jq '.data | length') -eq 0 ] && break
        ((page++))
    done
}
```

### Conditional Fetching

```bash
#!/bin/bash

# Only fetch if data changed
conditional_fetch() {
    local resource="$1"
    local etag_file=".etag-${resource}"

    # Get stored ETag
    local stored_etag=""
    [ -f "$etag_file" ] && stored_etag=$(cat "$etag_file")

    # Fetch with If-None-Match
    local response=$(curl -s -D - \
        -H "If-None-Match: $stored_etag" \
        "https://api.cakemail.com/$resource")

    local status=$(echo "$response" | grep HTTP | awk '{print $2}')

    if [ "$status" = "304" ]; then
        echo "Not modified - using cache"
        return 0
    fi

    # Extract and store new ETag
    local new_etag=$(echo "$response" | grep -i etag | cut -d' ' -f2)
    echo "$new_etag" > "$etag_file"

    echo "Data updated"
}
```

## Best Practices

1. **Cache Aggressively**
   - Cache list data (rarely changes)
   - Don't cache real-time metrics
   - Set appropriate TTLs

2. **Batch Operations**
   - Combine related API calls
   - Use bulk endpoints when available
   - Process in chunks

3. **Optimize Parallelism**
   - Test different concurrency levels
   - Don't exceed 5-10 concurrent requests
   - Monitor for rate limiting

4. **Filter Server-Side**
   - Use API filters, not local filtering
   - Request only needed fields
   - Paginate intelligently

5. **Monitor Performance**
   - Profile slow operations
   - Track API response times
   - Log cache hit rates

6. **Manage Resources**
   - Clean old cache files
   - Monitor memory usage
   - Stream large datasets

7. **Handle Rate Limits**
   - Implement exponential backoff
   - Use adaptive delays
   - Respect API limits

8. **Optimize Scripts**
   - Avoid redundant API calls
   - Reuse data where possible
   - Use efficient data structures

## Performance Checklist

- [ ] Implemented caching for frequently accessed data
- [ ] Using server-side filtering instead of local filtering
- [ ] Processing data in streams for large datasets
- [ ] Limited concurrent requests to 3-5
- [ ] Using JSON format for data processing
- [ ] Implemented retry logic with backoff
- [ ] Monitoring resource usage (memory, disk)
- [ ] Cleaning up temporary files and cache
- [ ] Using pagination appropriately
- [ ] Profiled slow operations

## Benchmarking Results

Example performance improvements:

| Operation | Before | After | Improvement |
|-----------|--------|-------|-------------|
| List 10k contacts | 45s | 5s | 9x faster |
| Generate 100 reports | 180s | 25s | 7x faster |
| Import 50k contacts | 300s | 60s | 5x faster |
| Cache hit rate | 0% | 85% | N/A |

*Results vary based on network, system resources, and API conditions.*

