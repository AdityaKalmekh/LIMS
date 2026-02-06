#!/bin/bash

# Integration Verification Script
# This script checks that all components for the Patient Test Reports system are in place

echo "🔍 Verifying Patient Test Reports Integration"
echo "=============================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0

# Function to check if file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $2"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $2 - File not found: $1"
        ((FAILED++))
    fi
}

# Function to check if directory exists
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $2"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $2 - Directory not found: $1"
        ((FAILED++))
    fi
}

echo "📁 Checking Database Migrations..."
check_file "supabase/migrations/005_create_report_types_table.sql" "Report types table migration"
check_file "supabase/migrations/006_create_report_fields_table.sql" "Report fields table migration"
check_file "supabase/migrations/007_create_report_instances_table.sql" "Report instances table migration"
check_file "supabase/migrations/008_create_report_values_table.sql" "Report values table migration"
check_file "supabase/migrations/009_seed_report_types_data.sql" "Report types seed data migration"
echo ""

echo "📝 Checking TypeScript Types..."
check_file "types/reports.ts" "Report types definitions"
echo ""

echo "🔌 Checking API Endpoints..."
check_file "app/api/reports/patients/route.ts" "GET /api/reports/patients"
check_dir "app/api/reports/test-assignments/[patientId]" "GET /api/reports/test-assignments/[patientId]"
check_dir "app/api/reports/types/[reportTypeCode]" "GET /api/reports/types/[reportTypeCode]"
check_dir "app/api/reports/instances/[testAssignmentId]" "GET /api/reports/instances/[testAssignmentId]"
check_file "app/api/reports/instances/route.ts" "POST /api/reports/instances"
echo ""

echo "✅ Checking Validation Logic..."
check_file "lib/validation/field-validators.ts" "Field validation functions"
check_file "lib/validation/form-validator.ts" "Form validation function"
echo ""

echo "📊 Checking Status Calculator..."
check_file "lib/utils/status-calculator.ts" "Report status calculator"
echo ""

echo "📋 Checking Form Components..."
check_file "components/reports/forms/BloodGroupForm.tsx" "Blood Group form"
check_file "components/reports/forms/CBCForm.tsx" "CBC form"
check_file "components/reports/forms/GenericReportForm.tsx" "Generic report form"
check_file "components/reports/forms/registry.ts" "Report form registry"
echo ""

echo "🎨 Checking UI Components..."
check_file "components/reports/ReportFormContainer.tsx" "Report form container"
check_file "components/reports/TestAssignmentList.tsx" "Test assignment list"
check_file "components/reports/PatientList.tsx" "Patient list"
echo ""

echo "📄 Checking Main Page..."
check_file "app/(dashboard)/reports/page.tsx" "Reports page"
echo ""

echo "🧪 Checking Test Scripts..."
check_file "scripts/create-test-data.sql" "Test data SQL script"
check_file "docs/REPORTS_INTEGRATION_TEST_GUIDE.md" "Integration test guide"
echo ""

echo "=============================================="
echo -e "Results: ${GREEN}${PASSED} passed${NC}, ${RED}${FAILED} failed${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All components are in place!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Ensure database migrations are applied in Supabase"
    echo "2. Run the test data SQL script in Supabase SQL Editor"
    echo "3. Start the dev server: npm run dev"
    echo "4. Navigate to http://localhost:3000/reports"
    echo "5. Follow the manual testing guide in docs/REPORTS_INTEGRATION_TEST_GUIDE.md"
    exit 0
else
    echo -e "${RED}✗ Some components are missing. Please review the errors above.${NC}"
    exit 1
fi
