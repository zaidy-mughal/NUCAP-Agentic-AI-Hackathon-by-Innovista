# 🚀 NUCAP Quick Start Guide

## Get Running in 5 Minutes!

### Prerequisites
- Node.js 18+ installed ✓
- PostgreSQL database (local or cloud)

---

## Option 1: Local PostgreSQL (Recommended for Development)

### Step 1: Install PostgreSQL
**Windows:**
```bash
# Download from: https://www.postgresql.org/download/windows/
# Or use winget:
winget install PostgreSQL.PostgreSQL
```

**Mac:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux:**
```bash
sudo apt-get install postgresql
sudo systemctl start postgresql
```

### Step 2: Create Database
```bash
# Open PostgreSQL command line
psql -U postgres

# Create database
CREATE DATABASE nucap;

# Exit
\q
```

### Step 3: Update Environment
Edit `.env.local` and update the DATABASE_URL:
```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/nucap?schema=public"
```

### Step 4: Set Up Database
```bash
cd nucap

# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed sample data
npm run db:seed
```

### Step 5: Run the App
```bash
npm run dev
```

Visit: **http://localhost:3000** 🎉

---

## Option 2: Cloud Database (Easier, No Local Setup)

### Using Neon (Free Tier)

1. **Go to** [neon.tech](https://neon.tech)
2. **Sign up** for free account
3. **Create a new project** named "nucap"
4. **Copy the connection string**
5. **Update `.env.local`:**
   ```env
   DATABASE_URL="postgresql://user:password@ep-xxx.neon.tech/nucap?sslmode=require"
   ```
6. **Run setup:**
   ```bash
   cd nucap
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   npm run dev
   ```

### Using Supabase (Free Tier)

1. **Go to** [supabase.com](https://supabase.com)
2. **Create new project** named "nucap"
3. **Go to Settings → Database**
4. **Copy connection string** (Connection Pooling)
5. **Update `.env.local`**
6. **Run setup** (same as above)

---

## 🧪 Test the Application

### 1. Sign Up
- Go to http://localhost:3000
- Click "Get Started"
- Sign up with email

### 2. Create Profile
- Enter Matric marks: `950/1100`
- Enter Inter marks: `900/1100`
- Enter test scores (optional): NUST `140`, FAST `75`
- Select preferences

### 3. View Dashboard
- See your academic stats
- View university matches
- Check upcoming deadlines

### 4. Explore Universities
- Browse all universities
- View department details
- Check merit lists

---

## 🎯 What You'll See

### Sample Data Includes:
- ✅ 4 Universities (NUST, FAST, COMSATS, Punjab)
- ✅ 7 Departments with merit data
- ✅ 2024 closing merits
- ✅ 2025 admission timelines
- ✅ Recent university updates

---

## 🐛 Troubleshooting

### Database Connection Failed
```bash
# Check if PostgreSQL is running
# Windows:
services.msc  # Look for PostgreSQL service

# Mac/Linux:
sudo systemctl status postgresql
```

### Prisma Client Error
```bash
# Regenerate client
npm run db:generate

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset
```

### Port 3000 Already in Use
```bash
# Use different port
npm run dev -- -p 3001
```

---

## 📱 Key URLs

- **Home**: http://localhost:3000
- **Dashboard**: http://localhost:3000/dashboard
- **Profile**: http://localhost:3000/profile/create
- **Admin**: http://localhost:3000/admin
- **Universities**: http://localhost:3000/universities

---

## 🔑 Default Credentials

**No default users** - You need to sign up!

Clerk handles all authentication securely.

---

## 🚀 Deploy to Vercel

### Quick Deploy

1. **Push to GitHub** (Already done! ✓)

2. **Go to** [vercel.com](https://vercel.com)

3. **Import Project**
   - Click "Add New Project"
   - Select your GitHub repo: `pak-institutioner`
   - Root Directory: `nucap`

4. **Add Environment Variables**
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   DATABASE_URL=your_production_database_url
   JINA_API_KEY=jina_c9d9d964838e48b2a99ca4eb006db329i3KwBWso30zOi6blN-AKnqd0unRt
   CRON_SECRET=generate_a_random_secret
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   NODE_ENV=production
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes

6. **Run Migrations**
   ```bash
   # In Vercel project settings, add build command:
   npx prisma migrate deploy && npx prisma db seed
   ```

7. **Done!** Your app is live! 🎉

---

## 📚 Next Steps

1. **Customize Landing Page**
   - Edit `src/app/page.tsx`
   - Add your branding

2. **Add More Universities**
   - Update `prisma/seed.ts`
   - Add scraper configs

3. **Enable Notifications**
   - Add email service
   - Set up WhatsApp bot

4. **Monitor Performance**
   - Check Vercel Analytics
   - Review scraping logs

---

## 💡 Pro Tips

### Development
```bash
# Open Prisma Studio (Database GUI)
npm run db:studio

# Watch for changes
npm run dev

# Check types
npm run build
```

### Database
```bash
# View database in browser
npm run db:studio

# Reset and reseed
npx prisma migrate reset

# Create new migration
npx prisma migrate dev --name your_migration_name
```

### Debugging
```bash
# Check logs
npm run dev

# Inspect database
npm run db:studio

# Test API endpoints
curl http://localhost:3000/api/universities
```

---

## 🎉 Success Checklist

- [ ] Database connected
- [ ] Migrations run successfully
- [ ] Sample data seeded
- [ ] App running on localhost:3000
- [ ] Can sign up/sign in
- [ ] Can create profile
- [ ] Dashboard shows data
- [ ] Universities listed
- [ ] Merit calculation works

---

## 📞 Need Help?

1. Check `SETUP.md` for detailed instructions
2. Review `PROJECT_SUMMARY.md` for features
3. Read `README.md` for API documentation
4. Check Prisma Studio for database issues

---

## 🎊 You're All Set!

Your NUCAP platform is ready to help students find their perfect university!

**Happy coding! 🚀**

