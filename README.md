# LIMS Admin & Patient Registration

A Laboratory Information Management System (LIMS) with admin authentication and patient registration capabilities, built with Next.js, Supabase, and Tailwind CSS.

## Features

- 🔐 Admin authentication (signup/login)
- 👥 Patient registration with comprehensive details
- 📊 Google Drive-inspired dashboard interface
- 📱 Fully responsive design (mobile, tablet, desktop)
- 🎨 Modern UI with shadcn/ui components
- 🔒 Secure data storage with Supabase

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **Forms**: react-hook-form + zod validation

## Prerequisites

Before you begin, ensure you have:
- Node.js 18+ installed
- npm or yarn package manager
- A Supabase account and project (see setup guide below)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd lims-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Supabase

**📚 Follow the comprehensive setup guide**: [docs/SUPABASE_SETUP_GUIDE.md](./docs/SUPABASE_SETUP_GUIDE.md)

This guide will walk you through:
- Creating a Supabase account
- Creating a new Supabase project
- Obtaining your API credentials
- Updating the `.env.local` file

**Quick references:**
- [Database Migration Guide](./docs/DATABASE_MIGRATION_GUIDE.md) - How to set up the database schema
- [RLS Setup Guide](./docs/RLS_SETUP_GUIDE.md) - Row Level Security configuration
- [Email Confirmation Guide](./docs/EMAIL_CONFIRMATION_GUIDE.md) - Configure email settings

### 4. Configure Environment Variables

Copy the example environment file and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

After following the Supabase setup guide, your `.env.local` file should contain:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

⚠️ **Never commit `.env.local` to version control!**

See [Environment Variables Documentation](#environment-variables) for detailed information about each variable.

### 5. Setup Database

Run the database migrations to create the required tables:

1. Open your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Run the migrations in order:
   - `supabase/migrations/001_create_patients_table.sql`
   - `supabase/migrations/002_setup_rls_policies.sql`

See [Database Migration Guide](./docs/DATABASE_MIGRATION_GUIDE.md) for detailed instructions.

### 6. Run the Development Server

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### 7. Create Your First Admin User

1. Navigate to [http://localhost:3000/signup](http://localhost:3000/signup)
2. Create an admin account with your email and password
3. Check your email for the confirmation link (if email confirmation is enabled)
4. Log in and start using the application!

## Project Structure

```
lims-app/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages (login, signup)
│   │   ├── login/         # Login page
│   │   └── signup/        # Signup page
│   ├── (dashboard)/       # Protected dashboard pages
│   │   └── dashboard/     # Main dashboard with patient list
│   ├── api/               # API routes
│   │   └── patients/      # Patient CRUD operations
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui base components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── auth/             # Authentication components
│   │   ├── LoginForm.tsx
│   │   └── SignupForm.tsx
│   ├── dashboard/        # Dashboard components
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── PatientList.tsx
│   └── patients/         # Patient-related components
│       └── PatientRegistrationForm.tsx
├── lib/                   # Utility functions and configurations
│   ├── supabase/         # Supabase client setup
│   │   ├── client.ts     # Client-side Supabase client
│   │   └── server.ts     # Server-side Supabase client
│   ├── validations/      # Form validation schemas
│   │   └── patient.ts    # Patient form validation
│   └── utils.ts          # Utility functions
├── types/                 # TypeScript type definitions
│   └── index.ts          # Shared types (Patient, etc.)
├── supabase/             # Supabase configuration
│   └── migrations/       # Database migration files
│       ├── 001_create_patients_table.sql
│       └── 002_setup_rls_policies.sql
├── docs/                  # Documentation
│   ├── SUPABASE_SETUP_GUIDE.md
│   ├── DATABASE_MIGRATION_GUIDE.md
│   ├── RLS_SETUP_GUIDE.md
│   └── ...
├── public/               # Static assets
├── middleware.ts         # Next.js middleware for auth
├── .env.local           # Environment variables (not in git)
├── .env.example         # Example environment variables
├── package.json         # Dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```

## Documentation

### Setup Guides
- **[Supabase Setup Guide](./docs/SUPABASE_SETUP_GUIDE.md)** - Complete guide for setting up Supabase
- **[Database Migration Guide](./docs/DATABASE_MIGRATION_GUIDE.md)** - How to run database migrations
- **[RLS Setup Guide](./docs/RLS_SETUP_GUIDE.md)** - Row Level Security configuration
- **[Email Confirmation Guide](./docs/EMAIL_CONFIRMATION_GUIDE.md)** - Configure email settings

### Component Documentation
- **[Header Component Guide](./docs/HEADER_COMPONENT_GUIDE.md)** - Dashboard header usage
- **[Signup Form Implementation](./docs/SIGNUP_FORM_IMPLEMENTATION.md)** - Signup form details

### Troubleshooting
- **[Auth Troubleshooting](./docs/AUTH_TROUBLESHOOTING.md)** - Common authentication issues
- **[Supabase Auth Troubleshooting](./docs/SUPABASE_AUTH_TROUBLESHOOTING.md)** - Supabase-specific auth issues

### Quick References
- **[Supabase Quick Reference](./docs/SUPABASE_QUICK_REFERENCE.md)** - Quick checklist for Supabase setup
- **[Supabase Auth Quick Reference](./docs/SUPABASE_AUTH_QUICK_REFERENCE.md)** - Auth methods and usage
- **[Logout Quick Reference](./docs/LOGOUT_QUICK_REFERENCE.md)** - Logout implementation

## Available Scripts

### Development

```bash
npm run dev
```
Starts the development server on [http://localhost:3000](http://localhost:3000). The page auto-updates as you edit files.

### Build

```bash
npm run build
```
Creates an optimized production build. This command:
- Compiles TypeScript
- Optimizes assets
- Generates static pages where possible
- Prepares the app for deployment

### Start Production Server

```bash
npm run start
```
Starts the production server. You must run `npm run build` first.

### Linting

```bash
npm run lint
```
Runs ESLint to check for code quality issues and potential bugs.

### Type Checking

```bash
npx tsc --noEmit
```
Runs TypeScript compiler to check for type errors without emitting files.

## Environment Variables

The application requires the following environment variables:

### Required Variables

| Variable | Description | Where to Find |
|----------|-------------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key (safe for client-side) | Supabase Dashboard → Settings → API → Project API keys → anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) | Supabase Dashboard → Settings → API → Project API keys → service_role secret |

### Security Notes

- ✅ `NEXT_PUBLIC_*` variables are exposed to the browser
- ⚠️ `SUPABASE_SERVICE_ROLE_KEY` should **NEVER** be exposed to the client
- 🔒 Always use `.env.local` for local development
- 🚫 Never commit `.env.local` to version control
- 📝 Use `.env.example` as a template

See [.env.example](./.env.example) for a complete template with detailed comments.

## Database Schema

The application uses Supabase (PostgreSQL) with the following schema:

### patients Table

Stores patient registration information with comprehensive details.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Unique patient identifier |
| `mobile_number` | VARCHAR(15) | NOT NULL | Patient mobile number with country code |
| `title` | VARCHAR(10) | NOT NULL | Title (Mr., Mrs., Ms., Dr., etc.) |
| `first_name` | VARCHAR(100) | NOT NULL | Patient first name |
| `last_name` | VARCHAR(100) | | Patient last name (optional) |
| `sex` | VARCHAR(10) | NOT NULL, CHECK (Male/Female/Other) | Patient sex |
| `age_years` | INTEGER | NOT NULL, CHECK (>= 0) | Age in years |
| `age_months` | INTEGER | CHECK (0-11) | Additional months (optional) |
| `age_days` | INTEGER | CHECK (0-30) | Additional days (optional) |
| `referred_by` | VARCHAR(200) | | Referring doctor (optional) |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Record creation timestamp |
| `created_by` | UUID | FOREIGN KEY → auth.users(id) | Admin who created the record |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Last update timestamp |

**Indexes:**
- `idx_patients_mobile` on `mobile_number` - Fast lookups by phone number
- `idx_patients_created_at` on `created_at DESC` - Efficient sorting by date

**Row Level Security (RLS):**
- ✅ Enabled on patients table
- 👁️ Authenticated users can SELECT (view) patients
- ➕ Authenticated users can INSERT (create) patients

### auth.users Table

Managed automatically by Supabase Auth for admin user authentication.

See [Database Migration Guide](./docs/DATABASE_MIGRATION_GUIDE.md) for setup instructions.

## Security

- 🔒 Row Level Security (RLS) enabled on all tables
- 🔑 Service role key used only in server-side code
- 🛡️ Input validation with zod schemas
- 🔐 Secure authentication with Supabase Auth

## Troubleshooting

### Environment Variables Not Loading

**Symptoms:**
- Application can't connect to Supabase
- "Missing environment variables" errors

**Solutions:**
1. Ensure `.env.local` is in the `lims-app` directory (not in a subdirectory)
2. Restart the development server after making changes to `.env.local`
3. Check for typos in variable names (they're case-sensitive)
4. Ensure there are no spaces around the `=` sign
5. Verify the file is named exactly `.env.local` (with the leading dot)

### Supabase Connection Issues

**Symptoms:**
- "Failed to fetch" errors
- Authentication not working
- Database queries failing

**Solutions:**
1. Verify credentials in `.env.local` match your Supabase dashboard
2. Check that your Supabase project is active (not paused)
3. Ensure you copied the complete API keys (they're very long)
4. Verify the project URL includes `https://`
5. See [Auth Troubleshooting Guide](./docs/AUTH_TROUBLESHOOTING.md) for detailed help

### Database Migration Errors

**Symptoms:**
- "Table already exists" errors
- "Extension does not exist" errors

**Solutions:**
1. Check that migrations are run in the correct order
2. Ensure you're running migrations on the correct Supabase project
3. See [Database Migration Guide](./docs/DATABASE_MIGRATION_GUIDE.md) for detailed instructions

### Authentication Issues

**Symptoms:**
- Can't sign up or log in
- Email confirmation not working
- Session not persisting

**Solutions:**
1. Check Supabase Auth settings in dashboard
2. Verify email confirmation settings
3. Clear browser cookies and try again
4. See [Email Confirmation Guide](./docs/EMAIL_CONFIRMATION_GUIDE.md)
5. See [Supabase Auth Troubleshooting](./docs/SUPABASE_AUTH_TROUBLESHOOTING.md)

### Build Errors

**Symptoms:**
- TypeScript errors during build
- Missing dependencies

**Solutions:**
1. Run `npm install` to ensure all dependencies are installed
2. Delete `.next` folder and rebuild: `rm -rf .next && npm run build`
3. Check for TypeScript errors: `npx tsc --noEmit`
4. Ensure Node.js version is 18 or higher

### Common Error Messages

#### "Invalid API key"
- Double-check you copied the entire key from Supabase dashboard
- Ensure you're using the correct key for each variable (anon vs service_role)

#### "Row Level Security policy violation"
- Ensure you're authenticated before accessing patient data
- Verify RLS policies are set up correctly
- See [RLS Setup Guide](./docs/RLS_SETUP_GUIDE.md)

#### "Failed to fetch"
- Check your internet connection
- Verify Supabase project URL is correct
- Ensure Supabase project is not paused

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Supabase Documentation](https://supabase.com/docs) - learn about Supabase
- [Tailwind CSS](https://tailwindcss.com/docs) - utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - re-usable component library
- [React Hook Form](https://react-hook-form.com/) - performant form library
- [Zod](https://zod.dev/) - TypeScript-first schema validation

## Deployment

The application is designed to be deployed on Vercel, but can be deployed to any platform that supports Next.js.

### Deploy to Vercel (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import project to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Configure Environment Variables**
   - In Vercel project settings, go to "Environment Variables"
   - Add the following variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`
   - Copy values from your `.env.local` file

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your application
   - You'll get a production URL (e.g., `your-app.vercel.app`)

5. **Verify Deployment**
   - Visit your production URL
   - Test signup and login
   - Create a test patient record
   - Verify database connection

### Deploy to Other Platforms

The application can also be deployed to:
- **Netlify**: Similar process to Vercel
- **Railway**: Supports Next.js with environment variables
- **AWS Amplify**: Full-stack deployment option
- **Self-hosted**: Use `npm run build && npm run start`

### Production Checklist

Before deploying to production:

- [ ] All environment variables are configured
- [ ] Database migrations have been run
- [ ] RLS policies are enabled and tested
- [ ] Email confirmation is configured (if required)
- [ ] Build completes without errors (`npm run build`)
- [ ] No TypeScript errors (`npx tsc --noEmit`)
- [ ] Linting passes (`npm run lint`)
- [ ] Test authentication flow in production
- [ ] Test patient registration in production
- [ ] Verify Supabase connection in production
- [ ] Set up custom domain (optional)
- [ ] Configure CORS if needed
- [ ] Set up monitoring and error tracking

### Post-Deployment

After successful deployment:

1. **Test thoroughly**
   - Create admin account
   - Register test patients
   - Verify all features work

2. **Monitor performance**
   - Check Vercel analytics
   - Monitor Supabase usage
   - Watch for errors in logs

3. **Set up backups**
   - Supabase provides automatic backups (Pro plan)
   - Consider additional backup strategy for critical data

See the [Deployment Guide](./docs/DEPLOYMENT_GUIDE.md) for detailed instructions.

## Contributing

We welcome contributions to improve the LIMS application!

### How to Contribute

1. **Fork the repository**
   ```bash
   # Click "Fork" on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/lims-app.git
   cd lims-app
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

4. **Make your changes**
   - Write clean, readable code
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation if needed

5. **Test your changes**
   ```bash
   npm run lint        # Check for linting errors
   npx tsc --noEmit   # Check for type errors
   npm run build      # Ensure build succeeds
   ```

6. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add amazing feature"
   ```
   
   **Commit message guidelines:**
   - Use present tense ("Add feature" not "Added feature")
   - Be descriptive but concise
   - Reference issues if applicable

7. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```

8. **Open a Pull Request**
   - Go to the original repository on GitHub
   - Click "New Pull Request"
   - Select your fork and branch
   - Describe your changes clearly
   - Link any related issues

### Code Style Guidelines

- **TypeScript**: Use strict typing, avoid `any`
- **Components**: Use functional components with hooks
- **Naming**: Use descriptive names (camelCase for variables, PascalCase for components)
- **Formatting**: Follow existing indentation and spacing
- **Comments**: Add comments for complex logic, not obvious code

### What to Contribute

- 🐛 Bug fixes
- ✨ New features
- 📝 Documentation improvements
- 🎨 UI/UX enhancements
- ♿ Accessibility improvements
- 🧪 Tests
- 🌐 Internationalization

### Reporting Issues

Found a bug? Have a suggestion?

1. Check if the issue already exists
2. Create a new issue with:
   - Clear title and description
   - Steps to reproduce (for bugs)
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (OS, browser, Node version)

## License

This project is part of the LIMS Admin & Patient Registration system.

## Support

For issues and questions:
- Check the [documentation](./docs/)
- Review the [Supabase Setup Guide](./docs/SUPABASE_SETUP_GUIDE.md)
- Open an issue in the repository

---

**Project**: LIMS Admin & Patient Registration  
**Version**: 1.0.0  
**Last Updated**: 2024
