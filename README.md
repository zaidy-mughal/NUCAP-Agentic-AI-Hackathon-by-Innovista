# 🎓 NUCAP - National University Admission Platform

<div align="center">

![NUCAP Logo](https://img.shields.io/badge/NUCAP-University%20Admission%20Platform-blue?style=for-the-badge)

**Empowering 1M+ Pakistani Students to Never Miss a University Deadline**

[![GitHub](https://img.shields.io/badge/GitHub-saadkhantareen%2Fpak--institutioner-181717?style=flat&logo=github)](https://github.com/saadkhantareen/pak-institutioner)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)](https://www.postgresql.org/)

[🚀 Live Demo](#) | [📖 Documentation](#documentation) | [🐛 Report Bug](https://github.com/saadkhantareen/pak-institutioner/issues) | [✨ Request Feature](https://github.com/saadkhantareen/pak-institutioner/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🎯 Overview

**NUCAP** (National University Admission Platform) is a comprehensive web application designed to solve the critical problem of students missing university admission deadlines in Pakistan. Every year, thousands of talented students lose opportunities because admission information is scattered across multiple university websites, frequently changes, and is difficult to track.

### Key Statistics
- 🎓 **Target Users**: 1M+ Intermediate (12th grade) students
- 🏫 **Universities Covered**: NUST, FAST, COMSATS, Punjab University (expandable)
- ⏰ **Automated Tracking**: Real-time deadline monitoring and alerts
- 📊 **Smart Matching**: AI-powered university recommendations based on academic profile

---

## 💡 Problem Statement

### The Challenge

Pakistani students face several challenges during university admissions:

1. **Scattered Information** 📚
   - Each university has its own website with different layouts
   - Admission criteria changes frequently
   - Merit lists published at different times

2. **Missed Deadlines** ⏰
   - No centralized platform for deadline tracking
   - Manual checking of multiple websites is time-consuming
   - Last-minute announcements go unnoticed

3. **Uncertainty** ❓
   - Students don't know their admission chances
   - Comparing merit across universities is difficult
   - No guidance on which universities to apply to

### Our Solution

NUCAP solves these problems by:

✅ **Centralizing** all university information in one place  
✅ **Automating** deadline tracking and notifications  
✅ **Calculating** merit and matching students with universities  
✅ **Providing** real-time updates and announcements  
✅ **Simplifying** the entire admission process  

---

## ✨ Features

### For Students

#### 🎯 Academic Profile Management
- Create comprehensive academic profile
- Store Matric and Inter marks
- Add test scores (NUST, FAST, NTS)
- Set preferences (cities, fields, budget)

#### 📊 Merit Calculator
- Calculate merit for multiple universities instantly
- University-specific formulas (NUST, FAST, COMSATS, Punjab)
- Real-time percentage calculation
- Estimated vs. required merit comparison

#### 🎓 Smart University Matching
- AI-powered recommendations based on profile
- Match score algorithm (0-100)
- Admission chances (High/Good/Medium/Low)
- Merit gap analysis
- Department-wise breakdown

#### ⏰ Deadline Tracking
- Upcoming deadlines dashboard
- Countdown timers
- Multi-university tracking
- Important date reminders

#### 📰 Real-Time Updates
- Latest announcements from universities
- Merit list publications
- Deadline extensions
- Important notices

#### 🔍 University Explorer
- Browse all universities
- Filter by city, test type, field
- Department details
- Historical merit data
- Direct application links

### For Administrators

#### 🛠️ Admin Dashboard
- System statistics overview
- User analytics
- Scraping activity monitoring
- Manual data entry forms

#### 🤖 Web Scraping Management
- Automated data collection from university websites
- Custom scrapers for each university
- Scraping logs and error tracking
- Manual trigger for on-demand updates

#### 📝 Content Management
- Add/edit university information
- Update admission timelines
- Publish announcements
- Manage merit lists

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.5 (App Router)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 4.0
- **UI Components**: Shadcn/ui
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation

### Backend
- **Runtime**: Node.js 22
- **API**: Next.js API Routes
- **Authentication**: Clerk
- **Database**: PostgreSQL 16
- **ORM**: Prisma 6.17

### Infrastructure
- **Hosting**: Vercel
- **Database Hosting**: Vercel Postgres / Supabase / Neon
- **Cron Jobs**: Vercel Cron
- **Web Scraping**: Jina AI API + Cheerio

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Database GUI**: Prisma Studio

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                         │
│                     Next.js 15 Frontend                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Landing │  │Dashboard │  │Universities│ │ Profile  │       │
│  │   Page   │  │          │  │  Explorer  │ │ Creation │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTP/HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API LAYER (Next.js)                          │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐   │
│  │   Student API  │  │Universities API│  │   Admin API    │   │
│  │  - Profile     │  │  - List        │  │  - Manage Data │   │
│  │  - Merit Calc  │  │  - Details     │  │  - Scraping    │   │
│  │  - Matches     │  │  - Filter      │  │  - Analytics   │   │
│  └────────────────┘  └────────────────┘  └────────────────┘   │
└────────┬──────────────────┬──────────────────┬──────────────────┘
         │                  │                  │
         ▼                  ▼                  ▼
┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│ Authentication │  │    Database    │  │  Web Scraping  │
│     (Clerk)    │  │  (PostgreSQL)  │  │   (Jina AI)    │
│                │  │                │  │                │
│ - User Mgmt    │  │ - Users        │  │ - NUST         │
│ - Sessions     │  │ - Universities │  │ - FAST         │
│ - Protected    │  │ - Departments  │  │ - COMSATS      │
│   Routes       │  │ - Merit Lists  │  │ - Punjab       │
└────────────────┘  └────────────────┘  └────────────────┘
```

## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Admin Panel

The application includes an admin panel for managing university data, merit lists, and admission timelines.

### Admin Setup

1. Create a `.env` file based on `.env.example`
2. Set your admin credentials:
   ```
   ADMIN_USERNAME=your_admin_username
   ADMIN_PASSWORD=your_admin_password
   ```

### Accessing the Admin Panel

1. Navigate to [http://localhost:3000/admin](http://localhost:3000/admin)
2. You'll be redirected to the login page if not authenticated
3. Enter your admin credentials to access the panel

### Admin Features

- **University Management**: Add, edit, and manage universities and their departments
- **Merit Lists**: Create and update merit lists for university departments
- **Admission Timelines**: Set important dates for admission processes
- **System Monitoring**: View system statistics and scraping logs

### Quick Start Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:generate      # Generate Prisma Client
npm run db:migrate       # Run migrations
npm run db:seed          # Seed database
npm run db:studio        # Open Prisma Studio

# Testing
npm run lint             # Run ESLint
npx tsx scripts/test-scraper.ts NUST  # Test scraper
```

📖 **For detailed setup instructions**, see [SETUP.md](./SETUP.md)  
🚀 **For quick deployment**, see [QUICKSTART.md](./QUICKSTART.md)

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import repository
   - Configure environment variables
   - Deploy

3. **Set up Database**
   - Use Vercel Postgres, Supabase, or Neon
   - Run migrations: `npx prisma migrate deploy`
   - Seed data: `npx prisma db seed`

4. **Configure Clerk**
   - Update allowed domains in Clerk dashboard
   - Set production redirect URLs

📖 **For detailed deployment guide**, see [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Ways to Contribute

- 🐛 **Report Bugs**: [Open an issue](https://github.com/saadkhantareen/pak-institutioner/issues)
- ✨ **Request Features**: [Suggest enhancements](https://github.com/saadkhantareen/pak-institutioner/issues)
- 💻 **Submit Code**: [Create a pull request](https://github.com/saadkhantareen/pak-institutioner/pulls)
- 📖 **Improve Docs**: Help us improve documentation
- 🎨 **Design**: Contribute UI/UX improvements

### Development Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit (`git commit -m 'Add amazing feature'`)
6. Push (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Style

- Use TypeScript for all new code
- Follow existing code patterns
- Add comments for complex logic
- Write meaningful commit messages
- Update documentation as needed

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Saad Khan Tareen**

- GitHub: [@saadkhantareen](https://github.com/saadkhantareen)
- Project: [pak-institutioner](https://github.com/saadkhantareen/pak-institutioner)

---

## 🙏 Acknowledgments

- **Jina AI** for web scraping capabilities
- **Clerk** for authentication services
- **Vercel** for hosting platform
- **Shadcn/ui** for beautiful UI components
- All contributors and supporters

---

## 📞 Contact & Support

- **GitHub Issues**: [Report a problem](https://github.com/saadkhantareen/pak-institutioner/issues)
- **Discussions**: [Ask questions](https://github.com/saadkhantareen/pak-institutioner/discussions)
- **Email**: support@nucap.pk

---

<div align="center">

**Made with ❤️ for Pakistani Students**

⭐ Star us on GitHub if you find this project helpful!

[⬆ Back to Top](#-nucap---national-university-admission-platform)


</div>
