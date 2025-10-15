# 🚀 NUCAP Deployment Guide

Complete guide to deploy NUCAP to production on Vercel.

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] GitHub repository set up
- [ ] Clerk account created
- [ ] Jina AI API key obtained
- [ ] PostgreSQL database ready (Vercel Postgres, Supabase, or Neon)
- [ ] All environment variables documented
- [ ] Local testing completed successfully

---

## 🌐 Step 1: Database Setup

### Option A: Vercel Postgres (Recommended)

1. **Go to Vercel Dashboard**
   - Navigate to Storage tab
   - Click "Create Database"
   - Select "Postgres"
   - Choose a name: `nucap-db`

2. **Get Connection String**
   - Copy the `POSTGRES_PRISMA_URL`
   - This will be your `DATABASE_URL`

### Option B: Supabase

1. **Create Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Name: `nucap`

2. **Get Connection String**
   - Go to Settings → Database
   - Copy "Connection Pooling" string
   - Format: `postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true`

### Option C: Neon

1. **Create Project**
   - Go to [neon.tech](https://neon.tech)
   - Create new project
   - Name: `nucap`

2. **Get Connection String**
   - Copy the connection string
   - Add `?sslmode=require` at the end

---

## 🔐 Step 2: Environment Variables

### Required Variables

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
CLERK_SECRET_KEY=sk_live_xxxxx

# Database
DATABASE_URL=postgresql://xxxxx

# Jina AI
JINA_API_KEY=jina_xxxxx

# Security
CRON_SECRET=generate_random_32_char_string

# App
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NODE_ENV=production
```

### Generate CRON_SECRET

```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Or use online generator
https://generate-secret.vercel.app/32
```

---

## 📤 Step 3: Push to GitHub

```bash
# Stage all changes
git add .

# Commit
git commit -m "Ready for production deployment"

# Push to main branch
git push origin main
```

---

## 🚀 Step 4: Deploy to Vercel

### Method 1: Vercel Dashboard (Recommended)

1. **Import Project**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import `pak-institutioner` repository
   - Select `nucap` as root directory

2. **Configure Build Settings**
   ```
   Framework Preset: Next.js
   Root Directory: nucap
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

3. **Add Environment Variables**
   - Click "Environment Variables"
   - Add all variables from Step 2
   - Apply to: Production, Preview, Development

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app is live! 🎉

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
cd nucap
vercel

# Follow prompts
# Set root directory to: nucap
# Add environment variables when prompted

# Deploy to production
vercel --prod
```

---

## 🗄️ Step 5: Database Migration

After first deployment:

```bash
# Set DATABASE_URL environment variable locally
export DATABASE_URL="your_production_database_url"

# Run migrations
npx prisma migrate deploy

# Seed initial data
npx prisma db seed
```

**Or use Vercel CLI:**

```bash
# Connect to Vercel project
vercel env pull

# Run migrations
npm run db:migrate

# Seed data
npm run db:seed
```

---

## 🔧 Step 6: Clerk Configuration

1. **Update Allowed Domains**
   - Go to Clerk Dashboard
   - Navigate to "Domains"
   - Add your Vercel domain: `your-app.vercel.app`

2. **Update Redirect URLs**
   - Go to "Paths"
   - Set Sign-in URL: `/sign-in`
   - Set Sign-up URL: `/sign-up`
   - Set After sign-in: `/dashboard`
   - Set After sign-up: `/profile/create`

3. **Update API Keys**
   - If using production keys, update in Vercel
   - Ensure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` starts with `pk_live_`
   - Ensure `CLERK_SECRET_KEY` starts with `sk_live_`

---

## ⚙️ Step 7: Cron Job Setup

Vercel Cron is automatically configured via `vercel.json`:

```json
{
  "crons": [{
    "path": "/api/cron/scrape-universities",
    "schedule": "0 */12 * * *"
  }]
}
```

**Verify Cron Job:**
1. Go to Vercel Dashboard → Project → Cron
2. You should see: `scrape-universities` running every 12 hours
3. Check logs after first run

**Manual Trigger:**
```bash
curl -X POST https://your-app.vercel.app/api/cron/scrape-universities \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

---

## ✅ Step 8: Post-Deployment Verification

### Test Checklist

- [ ] Homepage loads correctly
- [ ] Sign up flow works
- [ ] Sign in redirects to dashboard
- [ ] Profile creation saves data
- [ ] Merit calculation works
- [ ] Universities page loads
- [ ] Dashboard shows correct data
- [ ] Admin panel accessible
- [ ] Cron job runs successfully

### Test URLs

```
Homepage:        https://your-app.vercel.app
Sign Up:         https://your-app.vercel.app/sign-up
Universities:    https://your-app.vercel.app/universities
About:           https://your-app.vercel.app/about
Dashboard:       https://your-app.vercel.app/dashboard
```

---

## 🔍 Step 9: Monitoring & Analytics

### Vercel Analytics

1. **Enable Analytics**
   - Go to Project Settings → Analytics
   - Enable "Web Analytics"
   - Track page views, performance

2. **View Metrics**
   - Real-time visitors
   - Page load times
   - Geographic distribution

### Vercel Logs

```bash
# View real-time logs
vercel logs

# View function logs
vercel logs --follow
```

### Error Tracking

Monitor these endpoints:
- `/api/student/*` - Student operations
- `/api/universities/*` - University data
- `/api/cron/*` - Scraping jobs

---

## 🛠️ Troubleshooting

### Issue: Build Fails

**Solution:**
```bash
# Test build locally
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# Check for linting errors
npm run lint
```

### Issue: Database Connection Error

**Solution:**
1. Verify `DATABASE_URL` in Vercel environment variables
2. Ensure database allows connections from Vercel IPs
3. Check if migrations are applied:
   ```bash
   npx prisma migrate status
   ```

### Issue: Clerk Authentication Not Working

**Solution:**
1. Verify domain is added in Clerk dashboard
2. Check if API keys are production keys (`pk_live_`, `sk_live_`)
3. Ensure redirect URLs are correct
4. Clear browser cache and cookies

### Issue: Cron Job Not Running

**Solution:**
1. Verify `vercel.json` is in root directory
2. Check cron logs in Vercel dashboard
3. Ensure `CRON_SECRET` is set in environment variables
4. Test endpoint manually:
   ```bash
   curl -X POST https://your-app.vercel.app/api/cron/scrape-universities \
     -H "Authorization: Bearer YOUR_CRON_SECRET"
   ```

### Issue: Environment Variables Not Loaded

**Solution:**
1. Redeploy after adding variables
2. Ensure variables are set for "Production"
3. Check variable names (no typos)
4. Verify `.env.local` is in `.gitignore`

---

## 🔄 Continuous Deployment

Vercel automatically deploys on every push to `main`:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Vercel automatically:
# 1. Detects push
# 2. Builds project
# 3. Runs tests
# 4. Deploys to production
```

### Preview Deployments

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and push
git push origin feature/new-feature

# Vercel creates preview deployment
# URL: https://nucap-git-feature-new-feature-username.vercel.app
```

---

## 🎯 Performance Optimization

### 1. Enable Edge Functions

Update `vercel.json`:
```json
{
  "crons": [...],
  "functions": {
    "api/**/*.ts": {
      "runtime": "edge"
    }
  }
}
```

### 2. Enable Image Optimization

Next.js automatically optimizes images via Vercel.

### 3. Enable Caching

Headers are auto-configured for optimal caching.

### 4. Database Connection Pooling

Use connection pooling URLs for better performance:
- Vercel Postgres: Automatically pooled
- Supabase: Use "Connection Pooling" string
- Neon: Supports pooling by default

---

## 📊 Production Checklist

- [ ] Domain configured (if custom domain)
- [ ] SSL certificate active (automatic on Vercel)
- [ ] Environment variables set
- [ ] Database migrations applied
- [ ] Initial data seeded
- [ ] Clerk configured for production
- [ ] Cron jobs verified
- [ ] Error monitoring set up
- [ ] Analytics enabled
- [ ] Backup strategy in place
- [ ] Documentation updated
- [ ] Team invited to Vercel project

---

## 🔐 Security Best Practices

1. **Never commit `.env.local`**
   ```bash
   # Already in .gitignore
   .env*
   ```

2. **Use Production API Keys**
   - Clerk: `pk_live_*` and `sk_live_*`
   - Rotate keys regularly

3. **Secure Cron Endpoint**
   - Always use `CRON_SECRET`
   - Use strong random secret (32+ characters)

4. **Database Security**
   - Use SSL connections
   - Enable connection pooling
   - Set up read replicas for scaling

5. **Rate Limiting**
   - Vercel automatically rate-limits
   - Consider adding custom rate limiting for API routes

---

## 📈 Scaling Considerations

### Database

- **Vertical Scaling**: Upgrade database plan
- **Connection Pooling**: Use PgBouncer (Supabase) or Prisma Data Proxy
- **Read Replicas**: For high read loads

### Application

- **Edge Functions**: Deploy API routes to edge for lower latency
- **CDN**: Vercel automatically uses CDN
- **Caching**: Implement Redis for session/data caching

### Monitoring

- **Uptime Monitoring**: Use UptimeRobot or similar
- **Error Tracking**: Integrate Sentry
- **Performance**: Use Vercel Analytics + Web Vitals

---

## 🎉 Deployment Complete!

Your NUCAP platform is now live and helping students!

### Next Steps

1. **Monitor Performance**: Check analytics daily
2. **User Feedback**: Collect and iterate
3. **Update Data**: Manually update university info weekly
4. **Marketing**: Promote to students
5. **Scale**: Expand to more universities

### Share Your Success

- Star the project: [GitHub](https://github.com/saadkhantareen/pak-institutioner)
- Share on social media
- Report issues and improvements

---

## 📞 Need Help?

- **GitHub Issues**: [Report problems](https://github.com/saadkhantareen/pak-institutioner/issues)
- **Vercel Support**: [support.vercel.com](https://support.vercel.com)
- **Clerk Support**: [clerk.com/support](https://clerk.com/support)

---

**Built with ❤️ for Pakistani Students**


