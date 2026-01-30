# Database Migrations

This directory contains SQL migration files for the LIMS application database.

## Migration Files

| File | Description | Task |
|------|-------------|------|
| `001_create_patients_table.sql` | Creates the patients table with schema | 2.2 |
| `001_create_patients_table_rollback.sql` | Rolls back the patients table creation | 2.2 (rollback) |
| `002_setup_rls_policies.sql` | Enables RLS and creates security policies | 2.3 |
| `002_setup_rls_policies_rollback.sql` | Removes RLS policies and disables RLS | 2.3 (rollback) |

## Naming Convention

Migration files follow this naming pattern:

```
{number}_{description}.sql
{number}_{description}_rollback.sql
```

- **number**: Sequential number (001, 002, 003, etc.)
- **description**: Brief description in snake_case
- **rollback**: Optional rollback file to undo the migration

## How to Run Migrations

### Using Supabase SQL Editor (Recommended)

1. Open your Supabase Dashboard
2. Navigate to SQL Editor
3. Create a new query
4. Copy and paste the migration SQL
5. Click Run

See `docs/DATABASE_MIGRATION_GUIDE.md` for detailed instructions.

### Using Supabase CLI

```bash
# Run all pending migrations
supabase db push

# Run a specific migration
supabase db execute --file supabase/migrations/001_create_patients_table.sql
```

## Migration Order

Migrations should be run in numerical order:

1. `001_create_patients_table.sql` - Creates patients table
2. `002_setup_rls_policies.sql` - Enables RLS and creates security policies
3. (Future migrations will be added here)

## Rollback Migrations

If you need to undo a migration:

1. Run the corresponding `*_rollback.sql` file
2. **WARNING**: Rollback migrations will delete data!
3. Always backup your data before running rollbacks

## Best Practices

1. **Never modify existing migrations** - Create new migrations instead
2. **Test migrations locally first** - Use a development database
3. **Backup before running** - Especially for production databases
4. **Document changes** - Add comments to explain what the migration does
5. **Use transactions** - Wrap migrations in BEGIN/COMMIT when possible
6. **Create rollbacks** - Always provide a way to undo changes

## Migration Checklist

Before running a migration:

- [ ] Read the migration file to understand what it does
- [ ] Check for any prerequisites
- [ ] Backup your database (if in production)
- [ ] Test in development environment first
- [ ] Verify the migration completed successfully
- [ ] Test the application to ensure it works with the new schema

After running a migration:

- [ ] Verify tables/columns were created correctly
- [ ] Check indexes were created
- [ ] Test constraints are working
- [ ] Update application code if needed
- [ ] Document any manual steps required

## Troubleshooting

### Migration fails with "already exists" error

The migration likely uses `IF NOT EXISTS` clauses, so this shouldn't happen. If it does:

1. Check if the object already exists
2. Verify you're running the correct migration
3. Consider if you need to run a rollback first

### Migration fails with permission error

Ensure you have the correct permissions in Supabase. You should be the project owner or have admin access.

### Migration succeeds but changes not visible

1. Refresh the Table Editor page
2. Check you're looking at the correct project
3. Verify the migration actually completed (check for error messages)

## Additional Resources

- [Supabase Database Documentation](https://supabase.com/docs/guides/database)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Migration Guide](../docs/DATABASE_MIGRATION_GUIDE.md)

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Review the full migration guide in `docs/DATABASE_MIGRATION_GUIDE.md`
3. Consult Supabase documentation
4. Ask for help in the project chat
