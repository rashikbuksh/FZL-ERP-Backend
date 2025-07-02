# Global Audit Logging System

## Overview

This comprehensive audit logging system automatically tracks **ALL** database changes across your entire FZL-ERP-Backend application. It captures INSERT, UPDATE, and DELETE operations on every table, providing complete visibility into data modifications.

## Features

### ✅ **Complete Coverage**

-   **Automatic logging** of all database operations (INSERT, UPDATE, DELETE)
-   **Schema-wide coverage** across all schemas (hr, public, zipper, slider, thread, material, lab_dip, delivery, commercial, purchase)
-   **Field-level tracking** for UPDATE operations (logs each changed column separately)
-   **No code changes required** in existing operations

### ✅ **Rich Audit Data**

-   **What changed**: Old value vs New value for each field
-   **When**: Precise timestamp of changes
-   **Where**: Table and schema information

### ✅ **Performance Optimized**

-   **Efficient triggers** that only log actual changes
-   **Indexed tables** for fast querying
-   **Configurable cleanup** to manage storage
-   **Optional enable/disable** functionality

## Database Schema

### Main Audit Table: `audit.global_audit_log`

```sql
Column               | Type                        | Description
---------------------|-----------------------------|-----------------------------------------
id                   | SERIAL PRIMARY KEY          | Auto-incrementing unique identifier
schema_name          | TEXT NOT NULL               | Database schema name (e.g., 'zipper', 'hr')
table_name           | TEXT NOT NULL               | Table name (e.g., 'order_info', 'users')
record_id            | TEXT NOT NULL               | UUID/ID of the affected record
operation            | TEXT NOT NULL               | 'INSERT', 'UPDATE', or 'DELETE'
column_name          | TEXT                        | Column name (NULL for INSERT/DELETE)
old_value            | JSONB                       | Previous value (NULL for INSERT)
new_value            | JSONB                       | New value (NULL for DELETE)
changed_at           | TIMESTAMP WITH TIME ZONE    | When the change occurred
created_at           | TIMESTAMP WITH TIME ZONE    | Audit record creation time
remarks              | TEXT                        | Additional notes
```

### Views for Easy Querying

#### `audit.v_audit_summary`

Provides aggregated view of changes per record:

```sql
SELECT schema_name, table_name, record_id, total_changes, first_change, last_change
FROM audit.v_audit_summary
WHERE table_name = 'order_info';
```

#### `audit.v_audit_details`

Detailed view with user information:

```sql
SELECT * FROM audit.v_audit_details
WHERE schema_name = 'zipper' AND table_name = 'order_info'
ORDER BY changed_at DESC;
```

## Installation

### 1. Run the Migration

Execute the migration file to set up the audit system:

```bash
# Apply the migration to your database
psql -d your_database -f src/db/migrations/global_audit_system.sql
```

### 2. Add Route Integration

Update your main route file to include audit routes:

```javascript
import auditRouter from './src/db/audit/route.js';

// Add to your main router
app.use('/audit', auditRouter);
```

### 3. Add Audit Middleware (Optional but Recommended)

To capture user context in audit logs:

```javascript
import { setAuditContext } from './src/middleware/audit.js';

// Add before your routes
app.use(setAuditContext);
```

## API Endpoints

### Get All Audit Logs

```http
GET /audit/global-audit-log?schema_name=zipper&table_name=order_info&limit=100
```

**Query Parameters:**

-   `schema_name` - Filter by schema
-   `table_name` - Filter by table
-   `record_id` - Filter by specific record
-   `operation` - Filter by operation type (INSERT/UPDATE/DELETE)
-   `changed_by` - Filter by user
-   `from_date` - Start date filter
-   `to_date` - End date filter
-   `limit` - Number of records (default: 100)
-   `offset` - Pagination offset

### Get Record History

```http
GET /audit/global-audit-log/record-history/zipper/order_info/{record_uuid}
```

### Get Audit Statistics

```http
GET /audit/audit-stats?from_date=2024-01-01&to_date=2024-12-31
```

### Get Recent Activity

```http
GET /audit/recent-activity?limit=50
```

### Search Audit Logs

```http
GET /audit/search?search_term=john.doe&limit=100
```

### Admin: Toggle Audit Logging

```http
POST /audit/toggle-logging
Content-Type: application/json

{
  "enabled": true
}
```

### Admin: Cleanup Old Logs

```http
POST /audit/cleanup-old-logs
Content-Type: application/json

{
  "days_to_keep": 90
}
```

## Usage Examples

### 1. Track Order Changes

```javascript
// Get all changes to a specific order
const orderHistory = await fetch('/audit/global-audit-log/record-history/zipper/order_info/123e4567-e89b-12d3-a456-426614174000');

// Response shows all changes with old/new values
{
  "data": [
    {
      "operation": "UPDATE",
      "column_name": "status",
      "old_value": "\"pending\"",
      "new_value": "\"confirmed\"",
      "changed_at": "2024-01-15T10:30:00Z",
      "changed_by_name": "John Doe"
    }
  ]
}
```

### 2. Monitor User Activity

```javascript
// Get all changes made by a specific user
const userActivity = await fetch(
	'/audit/global-audit-log?changed_by=user-uuid&from_date=2024-01-01'
);
```

### 3. Generate Compliance Reports

```javascript
// Get audit statistics for compliance reporting
const stats = await fetch('/audit/audit-stats?from_date=2024-01-01&to_date=2024-12-31');

// Response includes detailed breakdown by table and operation
{
  "data": {
    "detailed_stats": [
      {
        "schema_name": "zipper",
        "table_name": "order_info",
        "operation": "UPDATE",
        "count": 150,
        "unique_records": 45,
        "unique_users": 8
      }
    ]
  }
}
```

### 4. Search for Specific Values

```javascript
// Search for all changes containing specific data
const searchResults = await fetch('/audit/search?search_term=canceled');
```

## Advanced Features

### 1. Transaction Tracking

All changes within the same database transaction share a `transaction_id`, allowing you to group related changes:

```sql
SELECT * FROM audit.global_audit_log
WHERE transaction_id = '12345'
ORDER BY changed_at;
```

### 2. Field-Level Change Tracking

For UPDATE operations, each changed field is logged separately:

```sql
-- See what specific fields changed in an order
SELECT column_name, old_value, new_value, changed_at
FROM audit.global_audit_log
WHERE record_id = 'order-uuid' AND operation = 'UPDATE'
ORDER BY changed_at;
```

### 3. User Context Integration

The system captures user information when available:

```javascript
// In your authentication middleware
req.user = { uuid: 'user-uuid-here' };

// The audit system will automatically capture this user as the change author
```

## Management & Maintenance

### Enable/Disable Audit Logging

```sql
-- Disable audit logging temporarily
SELECT audit.set_audit_enabled(false);

-- Re-enable audit logging
SELECT audit.set_audit_enabled(true);
```

### Monitor Storage Usage

```sql
-- Check audit log table size
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE tablename = 'global_audit_log';
```

### Cleanup Old Data

```sql
-- Remove audit logs older than 6 months
DELETE FROM audit.global_audit_log
WHERE changed_at < NOW() - INTERVAL '6 months';
```

## Performance Considerations

### Indexes

The system includes optimized indexes for common query patterns:

-   `(schema_name, table_name)` - For table-specific queries
-   `(record_id)` - For record history queries
-   `(changed_at)` - For time-based queries
-   `(changed_by)` - For user activity queries
-   `(operation)` - For operation-type filtering

### Storage Management

-   Consider implementing automated cleanup jobs for old audit data
-   Monitor disk usage and adjust retention policies as needed
-   Use database partitioning for very high-volume environments

### Excluded Columns

The system automatically excludes certain columns from UPDATE logging to reduce noise:

-   `updated_at` - Usually auto-updated by application
-   `created_at` - Never changes after INSERT

## Security & Compliance

### Data Privacy

-   Audit logs contain actual data values - ensure appropriate access controls
-   Consider data masking for sensitive fields in audit logs
-   Implement retention policies compliant with data protection regulations

### Access Control

-   Grant audit log access only to authorized personnel
-   Use database roles to control who can view audit data
-   Consider separate audit database for enhanced security

## Troubleshooting

### Common Issues

1. **Triggers Not Working**

    ```sql
    -- Check if triggers exist
    SELECT * FROM pg_trigger WHERE tgname LIKE 'audit_trigger_%';

    -- Recreate triggers if missing
    SELECT audit.create_audit_triggers();
    ```

2. **Missing User Context**

    - Ensure audit middleware is properly configured
    - Check that user UUID is being set in request context
    - Verify authentication system integration

3. **Performance Issues**
    - Check query execution plans
    - Verify indexes are being used
    - Consider cleanup of old audit data

### Debug Queries

```sql
-- Check recent audit activity
SELECT * FROM audit.v_audit_details
ORDER BY changed_at DESC
LIMIT 10;

-- Check for missing user information
SELECT DISTINCT changed_by
FROM audit.global_audit_log
WHERE changed_by IS NULL;
```

## Best Practices

1. **Regular Monitoring**: Set up alerts for unusual audit activity
2. **Data Retention**: Implement automated cleanup based on business requirements
3. **Performance Testing**: Monitor impact on application performance
4. **Access Control**: Limit audit log access to authorized personnel only
5. **Backup Strategy**: Include audit logs in your backup and recovery plans

## Support

For issues or questions about the global audit system:

1. Check the troubleshooting section above
2. Review PostgreSQL logs for error messages
3. Verify database permissions and trigger existence
4. Test with simple operations to isolate issues

---

_This audit system provides comprehensive tracking of all database changes, ensuring complete visibility and accountability for your FZL-ERP system._
