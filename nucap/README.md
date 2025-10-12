# NUCAP - National University Admission Platform

## 🎯 Overview

NUCAP is a comprehensive platform designed to help 1M+ Pakistani students navigate university admissions. It prevents students from missing deadlines and helps them find the best-fit universities based on their academic profile.

## ✨ Features

- **Merit Calculator**: Calculate merit for NUST, FAST, COMSATS, and Punjab University
- **Smart Matching**: Get personalized university recommendations
- **Deadline Tracking**: Never miss important admission dates
- **Real-time Updates**: Automated web scraping for latest information
- **Merit Analysis**: Compare your chances across departments
- **Multi-University Support**: Track admissions across 4+ universities

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **UI Components**: Shadcn/ui
- **Authentication**: Clerk
- **Database**: PostgreSQL with Prisma ORM
- **Web Scraping**: Jina AI API
- **Hosting**: Vercel
- **Cron Jobs**: Vercel Cron

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/saadkhantareen/pak-institutioner.git
   cd pak-institutioner/nucap
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/nucap?schema=public"

   # Jina AI
   JINA_API_KEY=your_jina_api_key

   # Cron Job Security
   CRON_SECRET=your-secret-key-here

   # App
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NODE_ENV=development
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma Client
   npx prisma generate

   # Run migrations
   npx prisma migrate dev --name init

   # (Optional) Seed the database
   npx prisma db seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄️ Database Schema

The application uses PostgreSQL with the following main models:

- **User**: User authentication and basic info
- **StudentProfile**: Academic credentials and preferences
- **University**: University information
- **Department**: Department details
- **MeritList**: Historical merit data
- **AdmissionTimeline**: Deadline tracking
- **UniversityUpdate**: News and announcements
- **StudentMatch**: University recommendations
- **ScrapingLog**: Web scraping activity logs

## 🔌 API Endpoints

### Student APIs
- `POST /api/student/profile` - Create student profile
- `GET /api/student/profile` - Get student profile
- `PUT /api/student/profile` - Update student profile
- `POST /api/student/calculate-merit` - Calculate merit and matches

### University APIs
- `GET /api/universities` - List all universities
- `GET /api/universities/[id]` - Get university details

### Admin APIs
- `GET /api/cron/scrape-universities` - Trigger scraping (protected)

## 🤖 Web Scraping

The platform uses Jina AI API for automated web scraping:

- **Jina Reader API**: Extracts content from university websites
- **Scheduled Jobs**: Runs every 12 hours via Vercel Cron
- **Data Extraction**: Deadlines, merit lists, and announcements

### Supported Universities
1. NUST (National University of Sciences & Technology)
2. FAST (Foundation for Advancement of Science & Technology)
3. COMSATS University
4. University of the Punjab

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables
   - Deploy

3. **Set up Database**
   - Use Vercel Postgres or external PostgreSQL
   - Run migrations: `npx prisma migrate deploy`

4. **Configure Cron Jobs**
   - Cron jobs are automatically configured via `vercel.json`
   - Set `CRON_SECRET` in environment variables

## 📊 Merit Calculation Formulas

### NUST
- Matric: 10%
- Inter: 15%
- Test: 75% (out of 200)

### FAST
- Matric: 10%
- Inter: 40%
- Test: 50% (out of 100)

### COMSATS
- Matric: 15%
- Inter: 35%
- Test: 50% (out of 100)

### Punjab University
- Matric: 20%
- Inter: 50%
- Test: 30% (out of 100)

## 🧪 Testing

```bash
# Run tests
npm test

# Run linting
npm run lint

# Type checking
npm run type-check
```

## 📝 Project Structure

```
nucap/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── api/               # API routes
│   │   ├── dashboard/         # Student dashboard
│   │   ├── profile/           # Profile management
│   │   ├── universities/      # University explorer
│   │   └── page.tsx           # Landing page
│   ├── components/            # React components
│   │   └── ui/               # Shadcn UI components
│   ├── lib/                   # Utility libraries
│   │   ├── prisma.ts         # Prisma client
│   │   ├── meritCalculator.ts # Merit calculation
│   │   └── utils.ts          # Helper functions
│   └── services/              # Business logic
│       └── scraper/          # Web scraping service
├── prisma/
│   └── schema.prisma         # Database schema
├── public/                    # Static assets
└── vercel.json               # Vercel configuration
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📧 Contact

For questions or support, please contact:
- Email: support@nucap.pk
- GitHub: [@saadkhantareen](https://github.com/saadkhantareen)

## 🙏 Acknowledgments

- Jina AI for web scraping capabilities
- Clerk for authentication
- Vercel for hosting
- All contributors and supporters

---

**Made with ❤️ for Pakistani students**
