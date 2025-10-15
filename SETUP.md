# NUCAP Setup Guide

## 🚀 Quick Start

Follow these steps to get NUCAP running on your local machine.

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- Clerk account for authentication
- Jina AI API key

### Step 1: Environment Setup

The `.env.local` file has already been created with your Clerk credentials. Update the database URL:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/nucap?schema=public"
```

**For local PostgreSQL:**
1. Install PostgreSQL if not already installed
2. Create a database: `createdb nucap`
3. Update the connection string in `.env.local`

**For cloud database (Recommended for production):**
- **Vercel Postgres**: Automatic setup when deploying to Vercel
- **Supabase**: Free tier available at supabase.com
- **Neon**: Serverless PostgreSQL at neon.tech

### Step 2: Install Dependencies

Already completed! Dependencies are installed.

### Step 3: Database Setup

Run these commands in order:

```bash
# Generate Prisma Client
npm run db:generate

# Create database tables
npm run db:migrate

# Seed with sample data
npm run db:seed
```

### Step 4: Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000 to see your application!

## 📊 Sample Data

The seed script creates:
- 4 Universities (NUST, FAST, COMSATS, Punjab)
- 7 Departments across universities
- Merit lists with 2024 data
- Admission timelines for 2025
- Sample university updates

## 🔐 Authentication

Clerk is configured with your credentials:
- Sign up page: `/sign-up`
- Sign in page: `/sign-in`
- Protected routes: `/dashboard`, `/profile`, `/matches`

## 🧪 Testing the Application

### 1. Create a Student Profile
1. Sign up at http://localhost:3000/sign-up
2. Go to Profile page
3. Enter your academic details:
   - Matric: 1000/1100 (90.9%)
   - Inter: 950/1100 (86.4%)
   - Expected test scores

### 2. Calculate Merit
The system will automatically calculate your merit for all universities based on their formulas.

### 3. View Matches
Navigate to the Matches page to see:
- Universities ranked by match score
- Admission chances (High/Good/Medium/Low)
- Merit gaps
- Department-wise breakdown

## 🤖 Web Scraping

### Manual Trigger
To manually trigger web scraping:

```bash
curl -X POST http://localhost:3000/api/cron/scrape-universities \
  -H "Authorization: Bearer your-secret-key-here"
```

### Automated Scraping
When deployed to Vercel, scraping runs automatically every 12 hours via `vercel.json` configuration.

## 📱 Key Pages

- `/` - Landing page
- `/dashboard` - Student dashboard (protected)
- `/profile` - Profile management (protected)
- `/universities` - University explorer (public)
- `/universities/[id]` - University details (public)
- `/matches` - Your matches (protected)

## 🔧 Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:generate      # Generate Prisma Client
npm run db:migrate       # Run migrations
npm run db:seed          # Seed database
npm run db:studio        # Open Prisma Studio (GUI)

# Linting
npm run lint             # Run ESLint
```

## 🐛 Troubleshooting

### Database Connection Error
- Verify PostgreSQL is running
- Check DATABASE_URL in `.env.local`
- Ensure database exists: `createdb nucap`

### Clerk Authentication Error
- Verify Clerk keys in `.env.local`
- Check if keys are from the correct Clerk application
- Ensure middleware.ts is properly configured

### Prisma Client Error
- Run `npm run db:generate` to regenerate client
- Delete `node_modules/.prisma` and regenerate

### Port Already in Use
- Change port: `npm run dev -- -p 3001`
- Or kill process using port 3000

## 📦 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to vercel.com
   - Click "Import Project"
   - Select your GitHub repository

3. **Add Environment Variables**
   Add all variables from `.env.local` to Vercel:
   - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
   - CLERK_SECRET_KEY
   - DATABASE_URL (use Vercel Postgres)
   - JINA_API_KEY
   - CRON_SECRET
   - NEXT_PUBLIC_APP_URL

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app is live!

5. **Run Migrations**
   After first deployment:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

## 🎯 Next Steps

1. **Customize Landing Page**
   - Edit `src/app/page.tsx`
   - Add your branding and messaging

2. **Add More Universities**
   - Update `prisma/seed.ts`
   - Add scraper configs in `src/services/scraper/index.ts`

3. **Enhance Scraping**
   - Improve data extraction logic
   - Add more university-specific parsers
   - Integrate LLM for better text parsing

4. **Add Features**
   - Email notifications
   - WhatsApp bot integration
   - Document checklist
   - University comparison tool

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review error messages in console
3. Check Prisma Studio for database issues: `npm run db:studio`
4. Verify all environment variables are set correctly

## 🎉 Success!

If everything is working, you should see:
- ✅ Landing page loads
- ✅ Can sign up/sign in
- ✅ Dashboard shows data
- ✅ Universities are listed
- ✅ Merit calculation works

Happy coding! 🚀

