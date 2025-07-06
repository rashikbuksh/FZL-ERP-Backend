# Order Status Report Query Fix - Summary

## Issue Fixed
The order status report query was not displaying quantity columns (quantity, party_price, company_price, delivered, warehouse, balance_quantity, etc.) when there was no corresponding dyeing batch or thread batch. This was happening because the CASE conditions only checked for `batch_rank = 1` but didn't account for cases where there was no batch (NULL values).

## Root Cause
- In the zipper production section: LEFT JOIN with `dyeing_batch_main dbm` could result in NULL `batch_rank` values
- In the tape coil production section: LEFT JOIN with `thread_batch_main tbm` could result in NULL `batch_rank` values  
- The CASE conditions only checked `WHEN batch_rank = 1` but ignored `WHEN batch_rank IS NULL`

## Solution Applied
Modified all CASE conditions in both sections to include:
```sql
CASE WHEN batch_rank = 1 OR batch_rank IS NULL THEN ... 
```

## Files Modified
- `/src/db/report/query/order_status_report.js`

## Fields Fixed

### Zipper Production Section
- quantity
- party_price  
- company_price
- not_approved_quantity
- approved_quantity
- total_quantity
- total_slider_required
- delivered
- warehouse
- balance_quantity

### Tape Coil Production Section  
- quantity
- party_price
- company_price
- not_approved_quantity
- approved_quantity
- delivered
- warehouse
- balance_quantity
- total_yarn_quantity
- total_expected_weight

## Result
Now the report will correctly display quantity and related fields for orders that don't have any batches created yet, instead of showing '--' for all quantity columns.
