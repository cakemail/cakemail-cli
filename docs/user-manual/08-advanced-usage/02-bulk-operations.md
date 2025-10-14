# Bulk Operations & Data Processing

Efficiently process large datasets and perform bulk operations with the Cakemail CLI.

## Overview

Learn to:
- Import/export large contact lists
- Process thousands of records efficiently
- Manage bulk campaign operations
- Handle memory constraints
- Track progress for long operations
- Recover from failures

## Bulk Contact Import

### Large CSV Import Strategy

```bash
#!/bin/bash

# Import 100,000+ contacts efficiently
import_large_list() {
    local list_id="$1"
    local csv_file="$2"
    local chunk_size=1000
    local temp_dir="import-chunks"

    mkdir -p "$temp_dir"

    # Count total contacts
    local total=$(tail -n +2 "$csv_file" | wc -l)
    echo "Importing $total contacts in chunks of $chunk_size..."

    # Split CSV into chunks
    tail -n +2 "$csv_file" | split -l $chunk_size - "$temp_dir/chunk-"

    # Add header to each chunk
    local header=$(head -1 "$csv_file")
    for chunk in "$temp_dir"/chunk-*; do
        sed -i.bak "1i\\
$header" "$chunk"
        rm "${chunk}.bak"
    done

    # Import each chunk
    local count=0
    for chunk in "$temp_dir"/chunk-*; do
        echo "Importing chunk $(basename "$chunk")..."

        if cakemail contacts import "$list_id" --file "$chunk"; then
            ((count += chunk_size))
            local percent=$((count * 100 / total))
            echo "Progress: $count/$total ($percent%)"
        else
            echo "ERROR: Failed to import $chunk"
            echo "Resume from: $chunk"
            exit 1
        fi

        # Rate limiting
        sleep 2
    done

    # Cleanup
    rm -rf "$temp_dir"

    echo "Import complete: $total contacts"
}

# Usage
import_large_list 123 "contacts-100k.csv"
```

### Parallel Import with Job Control

```bash
#!/bin/bash

# Import multiple lists in parallel
parallel_import() {
    local max_jobs=3
    local -a pids=()

    # List of imports to perform
    declare -A imports=(
        [123]="list-a-contacts.csv"
        [124]="list-b-contacts.csv"
        [125]="list-c-contacts.csv"
        [126]="list-d-contacts.csv"
    )

    for list_id in "${!imports[@]}"; do
        # Wait if max jobs reached
        while [ ${#pids[@]} -ge $max_jobs ]; do
            # Check for completed jobs
            for i in "${!pids[@]}"; do
                if ! kill -0 "${pids[$i]}" 2>/dev/null; then
                    unset 'pids[$i]'
                fi
            done
            pids=("${pids[@]}")  # Reindex array
            sleep 1
        done

        # Start import in background
        (
            csv_file="${imports[$list_id]}"
            echo "Starting import for list $list_id from $csv_file"

            if cakemail contacts import "$list_id" --file "$csv_file"; then
                echo "✓ List $list_id import complete"
            else
                echo "✗ List $list_id import failed"
            fi
        ) &

        pids+=($!)
        echo "Started job ${pids[-1]} for list $list_id"
    done

    # Wait for all jobs to complete
    echo "Waiting for ${#pids[@]} jobs to complete..."
    for pid in "${pids[@]}"; do
        wait "$pid"
    done

    echo "All imports complete"
}

parallel_import
```

### Resumable Import with Checkpoints

```bash
#!/bin/bash

# Resume import from checkpoint after failure
resumable_import() {
    local list_id="$1"
    local csv_file="$2"
    local checkpoint_file=".import-checkpoint-${list_id}"
    local start_line=1

    # Check for checkpoint
    if [ -f "$checkpoint_file" ]; then
        start_line=$(cat "$checkpoint_file")
        echo "Resuming from line $start_line"
    fi

    # Count total lines
    local total=$(wc -l < "$csv_file")

    # Process line by line
    local line_num=0
    local imported=0

    while IFS=, read -r email first_name last_name custom_data; do
        ((line_num++))

        # Skip until start_line
        [ $line_num -lt $start_line ] && continue

        # Skip header
        [ $line_num -eq 1 ] && continue

        # Import contact
        if cakemail contacts add "$list_id" \
            -e "$email" \
            -f "$first_name" \
            -l "$last_name" \
            ${custom_data:+-d "$custom_data"} 2>/dev/null; then
            ((imported++))
        else
            echo "Warning: Failed to import $email (line $line_num)"
        fi

        # Update checkpoint every 100 contacts
        if [ $((imported % 100)) -eq 0 ]; then
            echo "$line_num" > "$checkpoint_file"
            local percent=$((line_num * 100 / total))
            echo "Progress: $line_num/$total ($percent%) - $imported imported"
        fi

        # Rate limiting
        [ $((imported % 10)) -eq 0 ] && sleep 1
    done < "$csv_file"

    # Remove checkpoint on success
    rm -f "$checkpoint_file"

    echo "Import complete: $imported contacts from $total lines"
}

# Usage - will resume if interrupted
resumable_import 123 "contacts.csv"
```

## Bulk Contact Export

### Export All Lists

```bash
#!/bin/bash

# Export all lists with timestamped backups
export_all_lists() {
    local backup_dir="backups/$(date +%Y%m%d-%H%M%S)"
    mkdir -p "$backup_dir"

    echo "Exporting all lists to $backup_dir"

    # Get all lists
    local lists=$(cakemail lists list -f json | jq -r '.data[].id')
    local total=$(echo "$lists" | wc -w)
    local count=0

    for list_id in $lists; do
        ((count++))

        # Get list name for filename
        local list_name=$(cakemail lists get "$list_id" -f json | \
            jq -r '.name' | tr ' ' '-' | tr '[:upper:]' '[:lower:]')

        local filename="${backup_dir}/list-${list_id}-${list_name}.csv"

        echo "[$count/$total] Exporting list $list_id: $list_name"

        # Export contacts
        if cakemail contacts export "$list_id" -f json > "${filename}.meta"; then
            local export_id=$(jq -r '.export_id' "${filename}.meta")

            # Wait for export to complete
            while true; do
                local status=$(cakemail contacts export-status "$export_id" -f json | \
                    jq -r '.status')

                if [ "$status" = "completed" ]; then
                    break
                elif [ "$status" = "failed" ]; then
                    echo "ERROR: Export failed for list $list_id"
                    continue 2
                fi

                sleep 2
            done

            # Download export
            cakemail contacts export-download "$export_id" > "$filename"
            echo "✓ Exported $(wc -l < "$filename") contacts to $filename"

            rm "${filename}.meta"
        else
            echo "✗ Failed to start export for list $list_id"
        fi

        # Rate limiting
        sleep 1
    done

    # Create archive
    echo "Creating archive..."
    tar -czf "${backup_dir}.tar.gz" -C "$(dirname "$backup_dir")" \
        "$(basename "$backup_dir")"

    echo "Backup complete: ${backup_dir}.tar.gz"
}

export_all_lists
```

### Incremental Export (Changed Contacts Only)

```bash
#!/bin/bash

# Export only contacts modified since last export
incremental_export() {
    local list_id="$1"
    local state_file=".last-export-${list_id}"
    local output_file="incremental-export-$(date +%Y%m%d).csv"

    # Get last export timestamp
    local last_export=$([ -f "$state_file" ] && cat "$state_file" || echo "2000-01-01")

    echo "Exporting contacts modified since: $last_export"

    # Export with filter
    cakemail contacts list "$list_id" \
        --filter "updated_at>=$last_export" \
        -f json | \
        jq -r '["email","first_name","last_name","status","updated_at"],
               (.data[] | [.email, .first_name, .last_name, .status, .updated_at]) |
               @csv' > "$output_file"

    # Count exported contacts
    local count=$(($(wc -l < "$output_file") - 1))

    if [ $count -gt 0 ]; then
        echo "Exported $count changed contacts to $output_file"

        # Update state
        date -Iseconds > "$state_file"
    else
        echo "No changes since last export"
        rm "$output_file"
    fi
}

# Usage
incremental_export 123
```

## Bulk Campaign Operations

### Create Multiple Campaigns from Templates

```bash
#!/bin/bash

# Create campaigns for multiple segments
create_segmented_campaigns() {
    local list_id="$1"
    local sender_id="$2"
    local template_id="$3"
    local base_name="$4"

    # Get all segments
    local segments=$(cakemail segments list "$list_id" -f json | \
        jq -r '.data[] | "\(.id):\(.name)"')

    echo "Creating campaigns for each segment..."

    while IFS=: read -r segment_id segment_name; do
        echo "Creating campaign for segment: $segment_name"

        # Create campaign
        campaign_id=$(cakemail campaigns create \
            -n "${base_name} - ${segment_name}" \
            -l "$list_id" \
            -s "$sender_id" \
            --template "$template_id" \
            --segment "$segment_id" \
            --subject "Personalized for ${segment_name}" \
            -f json | jq -r '.id')

        if [ -n "$campaign_id" ]; then
            echo "✓ Created campaign $campaign_id for segment $segment_name"
        else
            echo "✗ Failed to create campaign for segment $segment_name"
        fi

        sleep 1
    done <<< "$segments"

    echo "Campaign creation complete"
}

# Usage
create_segmented_campaigns 123 101 201 "Weekly Newsletter"
```

### Bulk Campaign Scheduling

```bash
#!/bin/bash

# Schedule multiple campaigns with staggered send times
bulk_schedule_campaigns() {
    local -a campaign_ids=("$@")
    local start_date="2024-03-20"
    local start_time="08:00:00"
    local interval_hours=24

    local current_timestamp=$(date -d "$start_date $start_time" +%s)

    for campaign_id in "${campaign_ids[@]}"; do
        # Calculate send time
        local send_datetime=$(date -d "@$current_timestamp" "+%Y-%m-%d %H:%M:%S")

        echo "Scheduling campaign $campaign_id for $send_datetime"

        if cakemail campaigns schedule "$campaign_id" --when "$send_datetime"; then
            echo "✓ Scheduled campaign $campaign_id"
        else
            echo "✗ Failed to schedule campaign $campaign_id"
        fi

        # Increment timestamp
        current_timestamp=$((current_timestamp + interval_hours * 3600))

        sleep 1
    done
}

# Schedule campaigns 24 hours apart
bulk_schedule_campaigns 790 791 792 793 794
```

### Archive Old Campaigns

```bash
#!/bin/bash

# Archive campaigns older than N days
archive_old_campaigns() {
    local days_old="${1:-90}"
    local cutoff_date=$(date -d "$days_old days ago" +%Y-%m-%d)

    echo "Archiving campaigns older than $cutoff_date..."

    # Get old campaigns
    local campaigns=$(cakemail campaigns list \
        --filter "sent_at<$cutoff_date;status==sent" \
        -f json | jq -r '.data[].id')

    local count=0

    for campaign_id in $campaigns; do
        echo "Archiving campaign $campaign_id"

        if cakemail campaigns archive "$campaign_id"; then
            ((count++))
            echo "✓ Archived campaign $campaign_id"
        else
            echo "✗ Failed to archive campaign $campaign_id"
        fi

        sleep 0.5
    done

    echo "Archived $count campaigns"
}

# Archive campaigns older than 90 days
archive_old_campaigns 90
```

## Bulk Report Generation

### Generate Reports for All Recent Campaigns

```bash
#!/bin/bash

# Generate and save reports for all campaigns from last 30 days
bulk_report_generation() {
    local days="${1:-30}"
    local output_dir="reports/$(date +%Y%m%d)"
    local start_date=$(date -d "$days days ago" +%Y-%m-%d)

    mkdir -p "$output_dir"

    echo "Generating reports for campaigns since $start_date"

    # Get campaigns
    local campaigns=$(cakemail campaigns list \
        --filter "sent_at>=$start_date;status==sent" \
        -f json | jq -r '.data[] | "\(.id):\(.name)"')

    local total=$(echo "$campaigns" | wc -l)
    local count=0

    while IFS=: read -r campaign_id campaign_name; do
        ((count++))

        # Sanitize filename
        local safe_name=$(echo "$campaign_name" | \
            tr '[:upper:]' '[:lower:]' | \
            tr -cs '[:alnum:]' '-' | \
            sed 's/-*$//')

        local filename="${output_dir}/campaign-${campaign_id}-${safe_name}"

        echo "[$count/$total] Generating report for: $campaign_name"

        # Get campaign report
        cakemail reports campaign "$campaign_id" -f json > "${filename}.json"

        # Get link analytics
        cakemail reports campaign-links "$campaign_id" -f json > "${filename}-links.json"

        # Create summary CSV
        jq -r '["metric","value"],
               (["Delivered",.delivered],
                ["Open Rate",(.unique_opens / .delivered * 100 | round)],
                ["Click Rate",(.unique_clicks / .delivered * 100 | round)],
                ["Bounce Rate",(.bounced / .total_recipients * 100 | round)]) |
               @csv' "${filename}.json" > "${filename}-summary.csv"

        echo "✓ Saved report: $filename"

        sleep 1
    done <<< "$campaigns"

    # Create combined report
    echo "Creating combined report..."

    echo "campaign_id,campaign_name,delivered,unique_opens,unique_clicks,open_rate,click_rate" > \
        "${output_dir}/combined-report.csv"

    for json_file in "$output_dir"/campaign-*.json; do
        [ -f "$json_file" ] || continue
        [[ "$json_file" == *"-links.json" ]] && continue

        jq -r --arg id "$(basename "$json_file" | cut -d- -f2)" \
            --arg name "$(basename "$json_file" .json | cut -d- -f3-)" \
            '[$id, $name, .delivered, .unique_opens, .unique_clicks,
              (.unique_opens / .delivered * 100 | round),
              (.unique_clicks / .delivered * 100 | round)] | @csv' \
            "$json_file" >> "${output_dir}/combined-report.csv"
    done

    echo "Reports complete: $output_dir"
}

bulk_report_generation 30
```

### Performance Comparison Report

```bash
#!/bin/bash

# Compare performance across multiple campaigns
compare_campaigns() {
    local -a campaign_ids=("$@")
    local output_file="campaign-comparison-$(date +%Y%m%d).csv"

    # CSV header
    echo "id,name,delivered,open_rate,click_rate,ctor,bounce_rate,unsubscribe_rate" > "$output_file"

    for campaign_id in "${campaign_ids[@]}"; do
        echo "Fetching data for campaign $campaign_id..."

        # Get campaign data
        local data=$(cakemail reports campaign "$campaign_id" -f json)

        # Extract metrics
        local name=$(echo "$data" | jq -r '.campaign_name' | tr ',' ';')
        local delivered=$(echo "$data" | jq -r '.delivered')
        local recipients=$(echo "$data" | jq -r '.total_recipients')
        local unique_opens=$(echo "$data" | jq -r '.unique_opens')
        local unique_clicks=$(echo "$data" | jq -r '.unique_clicks')
        local bounced=$(echo "$data" | jq -r '.bounced')
        local unsubscribed=$(echo "$data" | jq -r '.unsubscribed')

        # Calculate rates
        local open_rate=$(echo "scale=2; $unique_opens * 100 / $delivered" | bc)
        local click_rate=$(echo "scale=2; $unique_clicks * 100 / $delivered" | bc)
        local ctor=$(echo "scale=2; $unique_clicks * 100 / $unique_opens" | bc)
        local bounce_rate=$(echo "scale=2; $bounced * 100 / $recipients" | bc)
        local unsub_rate=$(echo "scale=2; $unsubscribed * 100 / $delivered" | bc)

        # Write to CSV
        echo "$campaign_id,$name,$delivered,$open_rate,$click_rate,$ctor,$bounce_rate,$unsub_rate" >> \
            "$output_file"

        sleep 1
    done

    echo "Comparison report saved to: $output_file"

    # Display summary
    echo ""
    echo "Performance Summary:"
    column -t -s',' "$output_file"
}

# Compare specific campaigns
compare_campaigns 790 791 792 793 794
```

## Data Synchronization

### Two-Way Sync with External CRM

```bash
#!/bin/bash

# Sync contacts between Cakemail and external CRM
sync_with_crm() {
    local list_id="$1"
    local crm_api="https://api.yourcrm.com"
    local sync_state_file=".sync-state"

    echo "Starting two-way sync..."

    # 1. Export from Cakemail
    echo "Exporting from Cakemail..."
    local cakemail_contacts=$(mktemp)
    cakemail contacts list "$list_id" -f json | \
        jq -r '.data[] | "\(.email)|\(.updated_at)"' > "$cakemail_contacts"

    # 2. Fetch from CRM
    echo "Fetching from CRM..."
    local crm_contacts=$(mktemp)
    curl -s "$crm_api/contacts" | \
        jq -r '.[] | "\(.email)|\(.updated_at)"' > "$crm_contacts"

    # 3. Find contacts to update in CRM (modified in Cakemail)
    echo "Finding Cakemail → CRM updates..."
    while IFS='|' read -r email cakemail_updated; do
        local crm_updated=$(grep "^${email}|" "$crm_contacts" | cut -d'|' -f2)

        if [ -z "$crm_updated" ]; then
            echo "New contact in Cakemail: $email"
            # Add to CRM
            cakemail contacts get-by-email "$list_id" "$email" -f json | \
                curl -s -X POST "$crm_api/contacts" -H "Content-Type: application/json" -d @-
        elif [[ "$cakemail_updated" > "$crm_updated" ]]; then
            echo "Updating CRM: $email"
            # Update CRM
            cakemail contacts get-by-email "$list_id" "$email" -f json | \
                curl -s -X PUT "$crm_api/contacts/$email" -H "Content-Type: application/json" -d @-
        fi
    done < "$cakemail_contacts"

    # 4. Find contacts to update in Cakemail (modified in CRM)
    echo "Finding CRM → Cakemail updates..."
    while IFS='|' read -r email crm_updated; do
        local cakemail_updated=$(grep "^${email}|" "$cakemail_contacts" | cut -d'|' -f2)

        if [ -z "$cakemail_updated" ]; then
            echo "New contact in CRM: $email"
            # Add to Cakemail
            local contact_data=$(curl -s "$crm_api/contacts/$email")
            local first_name=$(echo "$contact_data" | jq -r '.first_name')
            local last_name=$(echo "$contact_data" | jq -r '.last_name')

            cakemail contacts add "$list_id" -e "$email" -f "$first_name" -l "$last_name"
        elif [[ "$crm_updated" > "$cakemail_updated" ]]; then
            echo "Updating Cakemail: $email"
            # Update Cakemail
            local contact_data=$(curl -s "$crm_api/contacts/$email")
            local first_name=$(echo "$contact_data" | jq -r '.first_name')
            local last_name=$(echo "$contact_data" | jq -r '.last_name')

            cakemail contacts update "$list_id" "$email" -f "$first_name" -l "$last_name"
        fi
    done < "$crm_contacts"

    # Cleanup
    rm "$cakemail_contacts" "$crm_contacts"

    # Save sync timestamp
    date -Iseconds > "$sync_state_file"

    echo "Sync complete"
}

# Usage
sync_with_crm 123
```

### Deduplicate Contacts Across Lists

```bash
#!/bin/bash

# Find and remove duplicate contacts across multiple lists
deduplicate_contacts() {
    local -a list_ids=("$@")
    local temp_file=$(mktemp)

    echo "Finding duplicates across ${#list_ids[@]} lists..."

    # Export all contacts with list IDs
    for list_id in "${list_ids[@]}"; do
        echo "Scanning list $list_id..."
        cakemail contacts list "$list_id" -f json | \
            jq -r --arg list "$list_id" \
                '.data[] | "\(.email)|\($list)|\(.id)"' >> "$temp_file"
    done

    # Find duplicates
    echo "Analyzing duplicates..."
    local duplicates=$(cut -d'|' -f1 "$temp_file" | sort | uniq -d)

    if [ -z "$duplicates" ]; then
        echo "No duplicates found"
        rm "$temp_file"
        return
    fi

    echo "Found duplicates:"
    echo "$duplicates"
    echo ""

    # Process each duplicate
    while read -r email; do
        echo "Processing: $email"

        # Get all occurrences
        local occurrences=$(grep "^${email}|" "$temp_file")
        local count=$(echo "$occurrences" | wc -l)

        echo "  Found in $count lists:"
        echo "$occurrences" | while IFS='|' read -r dup_email list_id contact_id; do
            echo "    List $list_id (Contact $contact_id)"
        done

        # Keep first occurrence, remove others
        local first=true
        echo "$occurrences" | while IFS='|' read -r dup_email list_id contact_id; do
            if [ "$first" = true ]; then
                echo "  ✓ Keeping in list $list_id"
                first=false
            else
                echo "  ✗ Removing from list $list_id"
                cakemail contacts delete "$list_id" "$contact_id"
            fi
        done

        echo ""
    done <<< "$duplicates"

    rm "$temp_file"

    echo "Deduplication complete"
}

# Usage
deduplicate_contacts 123 124 125
```

## Memory-Efficient Processing

### Stream Processing Large Exports

```bash
#!/bin/bash

# Process large export without loading into memory
stream_process_export() {
    local list_id="$1"
    local export_id="$2"

    echo "Streaming export $export_id..."

    # Process line by line
    cakemail contacts export-download "$export_id" | {
        local line_num=0
        local processed=0

        while IFS=, read -r email first_name last_name status custom_attrs; do
            ((line_num++))

            # Skip header
            [ $line_num -eq 1 ] && continue

            # Process contact (example: extract bounced emails)
            if [ "$status" = "bounced" ]; then
                echo "$email" >> bounced-emails.txt
                ((processed++))
            fi

            # Progress indicator
            if [ $((line_num % 1000)) -eq 0 ]; then
                echo "Processed $line_num contacts ($processed bounced)"
            fi
        done

        echo "Stream processing complete: $processed bounced emails found"
    }
}

# Usage
stream_process_export 123 "export_abc123"
```

### Paginated List Processing

```bash
#!/bin/bash

# Process all contacts using pagination
paginated_processing() {
    local list_id="$1"
    local page_size=100
    local page=1
    local total_processed=0

    while true; do
        echo "Processing page $page (size: $page_size)..."

        # Fetch page
        local response=$(cakemail contacts list "$list_id" \
            --page "$page" \
            --per-page "$page_size" \
            -f json)

        # Check if empty
        local count=$(echo "$response" | jq '.data | length')

        if [ "$count" -eq 0 ]; then
            echo "No more contacts"
            break
        fi

        # Process contacts on this page
        echo "$response" | jq -r '.data[] | .email' | while read -r email; do
            # Your processing logic here
            echo "Processing: $email"
            ((total_processed++))
        done

        echo "Page $page complete ($count contacts)"

        ((page++))
        sleep 1
    done

    echo "Total processed: $total_processed contacts"
}

paginated_processing 123
```

## Error Recovery

### Bulk Operation with Transaction Log

```bash
#!/bin/bash

# Perform bulk operation with detailed logging for rollback
bulk_operation_with_log() {
    local operation="$1"
    shift
    local items=("$@")

    local log_file="bulk-operation-$(date +%Y%m%d-%H%M%S).log"
    local success_count=0
    local failure_count=0

    echo "Starting bulk operation: $operation" | tee -a "$log_file"
    echo "Total items: ${#items[@]}" | tee -a "$log_file"
    echo "---" | tee -a "$log_file"

    for item in "${items[@]}"; do
        echo "[$(date -Iseconds)] Processing: $item" >> "$log_file"

        if eval "$operation '$item'"; then
            ((success_count++))
            echo "SUCCESS|$item" >> "$log_file"
        else
            ((failure_count++))
            echo "FAILURE|$item" >> "$log_file"
        fi
    done

    echo "---" | tee -a "$log_file"
    echo "Complete: $success_count success, $failure_count failures" | tee -a "$log_file"
    echo "Log saved to: $log_file"

    # Return failure count
    return $failure_count
}

# Example: Delete multiple campaigns
delete_campaign() {
    local campaign_id="$1"
    cakemail campaigns delete "$campaign_id"
}

bulk_operation_with_log "delete_campaign" 790 791 792 793
```

### Retry Failed Operations

```bash
#!/bin/bash

# Retry operations that failed in previous bulk run
retry_failed_operations() {
    local log_file="$1"
    local operation="$2"

    if [ ! -f "$log_file" ]; then
        echo "Log file not found: $log_file"
        return 1
    fi

    # Extract failed items
    local failed_items=$(grep "^FAILURE|" "$log_file" | cut -d'|' -f2)
    local count=$(echo "$failed_items" | wc -w)

    if [ $count -eq 0 ]; then
        echo "No failed operations to retry"
        return 0
    fi

    echo "Retrying $count failed operations..."

    local retry_log="retry-$(basename "$log_file")"
    local success=0

    for item in $failed_items; do
        echo "Retrying: $item"

        if eval "$operation '$item'"; then
            ((success++))
            echo "SUCCESS|$item" >> "$retry_log"
        else
            echo "FAILURE|$item" >> "$retry_log"
        fi

        sleep 2  # Longer delay for retries
    done

    echo "Retry complete: $success/$count succeeded"
}

# Usage
retry_failed_operations "bulk-operation-20240315-143022.log" "delete_campaign"
```

## Performance Tips

1. **Use Batch Operations**: Import 1000 contacts at once vs. 1000 individual calls
2. **Implement Pagination**: Process large datasets in chunks
3. **Add Rate Limiting**: Sleep between operations to avoid throttling
4. **Use Parallel Processing**: Run independent operations concurrently (max 3-5 jobs)
5. **Stream Large Files**: Process line-by-line instead of loading into memory
6. **Cache API Responses**: Store frequently accessed data locally
7. **Use Filters**: Reduce data transfer with server-side filtering
8. **Implement Checkpoints**: Resume long operations after interruption
9. **Log Everything**: Track progress and enable recovery
10. **Monitor Resources**: Watch memory and disk usage for long operations

