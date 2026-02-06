# Manual Testing Guide for Report Types API

## Prerequisites

1. Ensure the development server is running: `npm run dev`
2. Ensure you have a valid user account in the system
3. Ensure the database migrations have been applied (including seed data)

## Test Cases

### Test 1: Fetch Blood Group Report Type

**Request:**
```bash
curl -X GET http://localhost:3000/api/reports/types/BLOOD_GROUP \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Expected Response (200 OK):**
```json
{
  "reportType": {
    "id": "uuid",
    "code": "BLOOD_GROUP",
    "name": "Blood Group Test",
    "description": "Determines blood type and Rh factor",
    "isActive": true,
    "createdAt": "timestamp",
    "updatedAt": "timestamp"
  },
  "fields": [
    {
      "id": "uuid",
      "reportTypeId": "uuid",
      "fieldName": "blood_group",
      "fieldLabel": "Blood Group",
      "fieldType": "dropdown",
      "fieldOrder": 1,
      "isRequired": true,
      "unit": null,
      "normalRangeMin": null,
      "normalRangeMax": null,
      "normalRangeText": null,
      "dropdownOptions": ["A", "B", "AB", "O"],
      "defaultValue": null,
      "validationRules": null,
      "createdAt": "timestamp"
    },
    {
      "id": "uuid",
      "reportTypeId": "uuid",
      "fieldName": "rh_factor",
      "fieldLabel": "Rh Factor",
      "fieldType": "dropdown",
      "fieldOrder": 2,
      "isRequired": true,
      "unit": null,
      "normalRangeMin": null,
      "normalRangeMax": null,
      "normalRangeText": null,
      "dropdownOptions": ["POSITIVE", "NEGATIVE"],
      "defaultValue": null,
      "validationRules": null,
      "createdAt": "timestamp"
    }
  ]
}
```

### Test 2: Fetch CBC Report Type

**Request:**
```bash
curl -X GET http://localhost:3000/api/reports/types/CBC \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Expected Response (200 OK):**
- Should return CBC report type with 16 fields (14 numeric + 2 dropdown)
- Fields should be ordered by field_order
- Numeric fields should have unit, normalRangeMin, normalRangeMax, normalRangeText
- Dropdown fields should have dropdownOptions

### Test 3: Invalid Report Type Code

**Request:**
```bash
curl -X GET http://localhost:3000/api/reports/types/INVALID_CODE \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Expected Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Not found",
  "message": "Report type with code 'INVALID_CODE' not found or is not active"
}
```

### Test 4: Unauthenticated Request

**Request:**
```bash
curl -X GET http://localhost:3000/api/reports/types/BLOOD_GROUP
```

**Expected Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "You must be logged in to view report type definitions"
}
```

## Browser Testing

### Using Browser DevTools

1. Log in to the application
2. Open browser DevTools (F12)
3. Go to Console tab
4. Run the following JavaScript:

```javascript
// Test fetching Blood Group report type
fetch('/api/reports/types/BLOOD_GROUP')
  .then(res => res.json())
  .then(data => console.log('Blood Group:', data))
  .catch(err => console.error('Error:', err))

// Test fetching CBC report type
fetch('/api/reports/types/CBC')
  .then(res => res.json())
  .then(data => console.log('CBC:', data))
  .catch(err => console.error('Error:', err))

// Test invalid report type
fetch('/api/reports/types/INVALID')
  .then(res => res.json())
  .then(data => console.log('Invalid:', data))
  .catch(err => console.error('Error:', err))
```

## Verification Checklist

- [ ] Blood Group report type returns successfully with 2 fields
- [ ] CBC report type returns successfully with 16 fields
- [ ] Fields are ordered by field_order (ascending)
- [ ] Dropdown fields have dropdownOptions array
- [ ] Numeric fields have unit and normal range data
- [ ] Invalid report type code returns 404
- [ ] Unauthenticated requests return 401
- [ ] Response uses camelCase (not snake_case)
- [ ] All required fields are present in response
- [ ] Only active report types are returned

## Common Issues

### Issue: 401 Unauthorized
**Solution:** Ensure you're logged in and using a valid access token

### Issue: 404 Not Found
**Solution:** 
- Check that the report type code is correct (case-sensitive)
- Verify the seed data migration has been applied
- Ensure the report type is marked as active (is_active = true)

### Issue: 500 Internal Server Error
**Solution:**
- Check server logs for detailed error messages
- Verify database connection is working
- Ensure all required tables exist (report_types, report_fields)

## Database Verification

To verify the data exists in the database:

```sql
-- Check report types
SELECT * FROM report_types WHERE is_active = true;

-- Check report fields for Blood Group
SELECT rf.* 
FROM report_fields rf
JOIN report_types rt ON rf.report_type_id = rt.id
WHERE rt.code = 'BLOOD_GROUP'
ORDER BY rf.field_order;

-- Check report fields for CBC
SELECT rf.* 
FROM report_fields rf
JOIN report_types rt ON rf.report_type_id = rt.id
WHERE rt.code = 'CBC'
ORDER BY rf.field_order;
```
