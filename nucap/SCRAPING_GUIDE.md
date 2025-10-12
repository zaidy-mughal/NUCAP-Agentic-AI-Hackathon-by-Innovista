# 🤖 Custom University Scraping System

## Overview

NUCAP uses **custom scrapers** for each university to extract:
- 📅 Admission deadlines
- 📊 Merit lists  
- 📰 Announcements
- 🎓 Program information

## Architecture

```
┌─────────────────────────────────────────┐
│        ScrapingManager (Manager)        │
│  Coordinates all university scrapers    │
└───────────────┬─────────────────────────┘
                │
        ┌───────┴────────┐
        │                │
        ▼                ▼
┌──────────────┐   ┌──────────────┐
│ NUST Scraper │   │ FAST Scraper │
│              │   │              │
│ - Jina AI    │   │ - Jina AI    │
│ - Cheerio    │   │ - Cheerio    │
│ - Regex      │   │ - Regex      │
└──────────────┘   └──────────────┘
        │                │
        └────────┬───────┘
                 │
                 ▼
        ┌────────────────┐
        │   PostgreSQL   │
        │    Database    │
        └────────────────┘
```

## Custom Scrapers

### 1. NUST Scraper (`universities/nust.ts`)

**Features:**
- ✅ Dual-mode scraping (Jina AI + Direct HTML)
- ✅ Extracts admission deadlines
- ✅ Parses merit lists
- ✅ Captures announcements
- ✅ Fallback to direct scraping if Jina fails

**Target URLs:**
- Admissions: `https://nust.edu.pk/admissions/undergraduate`
- Merit Lists: `https://nust.edu.pk/admissions/merit-lists`
- Announcements: `https://nust.edu.pk/admissions/announcements`

**Extraction Patterns:**
```typescript
// Deadline patterns
/(?:last date|deadline|apply by)[^\n]*?(\d{1,2}[\s\-\/]+(?:Jan|Feb|...)\d{4})/i

// Merit patterns
/(Computer Science|Software Engineering)[:\s\-]+(\d{2,3}\.?\d{0,2})%?/gi
```

### 2. FAST Scraper (`universities/fast.ts`)

**Features:**
- ✅ Multi-campus support
- ✅ Jina AI integration
- ✅ Deadline extraction
- ✅ Announcement parsing

**Target URLs:**
- Main: `https://www.nu.edu.pk/Admissions`

### 3. COMSATS Scraper (`universities/comsats.ts`)

**Features:**
- ✅ Multi-city campus support
- ✅ NTS test information
- ✅ Deadline tracking

**Target URLs:**
- Main: `https://www.comsats.edu.pk/Admissions.aspx`

## Usage

### Test a Single University

```bash
npx tsx scripts/test-scraper.ts NUST
npx tsx scripts/test-scraper.ts FAST
npx tsx scripts/test-scraper.ts COMSATS
```

**Example Output:**
```
🧪 Testing NUST scraper...

==================================================
📊 SCRAPING RESULTS
==================================================

Status: ✅ SUCCESS
Message: Successfully scraped NUST

📅 Deadlines Found:
{
  "applicationDeadline": "2025-03-15T00:00:00.000Z",
  "testDate": "2025-04-20T00:00:00.000Z"
}

📰 Announcements Found: 3
  1. NUST Entry Test 2025 Registration Open
  2. Merit List 2024 Published  
  3. Important Dates Announced

📊 Merit Lists Found: 5
  - Computer Science: 79.2%
  - Software Engineering: 77.5%
  - Electrical Engineering: 75.8%
```

### Manual Scraping via API

```bash
# With authorization
curl -X POST http://localhost:3000/api/cron/scrape-universities \
  -H "Authorization: Bearer your-secret-key-here"
```

### Automated Scraping (Cron)

Runs automatically **every 12 hours** via Vercel Cron.

See `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/cron/scrape-universities",
    "schedule": "0 */12 * * *"
  }]
}
```

## How It Works

### Step 1: Fetch Content

```typescript
// Using Jina AI Reader API
const response = await axios.get(`https://r.jina.ai/${url}`, {
  headers: {
    'Authorization': `Bearer ${jinaApiKey}`,
    'X-Return-Format': 'markdown'
  }
});
```

### Step 2: Extract Information

```typescript
// Using regex patterns
const deadlineMatch = text.match(
  /(?:last date|deadline)[^\n]*?(\d{1,2}[\s\-\/]+(?:Jan|...)\d{4})/i
);

// Parse date
if (deadlineMatch) {
  const date = new Date(deadlineMatch[1]);
  deadlines.applicationDeadline = date;
}
```

### Step 3: Save to Database

```typescript
await prisma.admissionTimeline.upsert({
  where: {
    universityId_year_cycle: {
      universityId,
      year: 2025,
      cycle: 'Fall 2025'
    }
  },
  update: {
    applicationDeadline: date,
    updatedBy: 'system'
  },
  create: {
    universityId,
    year: 2025,
    cycle: 'Fall 2025',
    applicationDeadline: date
  }
});
```

## Adding a New University

### 1. Create Scraper File

Create `src/services/scraper/universities/punjab.ts`:

```typescript
import axios from 'axios';

export interface PUNJABData {
  deadlines: {
    applicationDeadline?: Date;
  };
  announcements: Array<{
    title: string;
    description: string;
  }>;
}

export class PUNJABScraper {
  private jinaApiKey: string;
  
  constructor(jinaApiKey: string) {
    this.jinaApiKey = jinaApiKey;
  }

  async scrape(): Promise<PUNJABData> {
    // Your scraping logic here
    return {
      deadlines: {},
      announcements: []
    };
  }
}
```

### 2. Register in Manager

Edit `src/services/scraper/manager.ts`:

```typescript
import { PUNJABScraper } from './universities/punjab';

// In scrapeUniversity method:
case 'PUNJAB':
  const punjabScraper = new PUNJABScraper(this.jinaApiKey);
  scrapedData = await punjabScraper.scrape();
  break;
```

### 3. Test It

```bash
npx tsx scripts/test-scraper.ts PUNJAB
```

## Troubleshooting

### Issue: "Jina API rate limit exceeded"

**Solution:** Add delays between requests:

```typescript
await new Promise(resolve => setTimeout(resolve, 6000)); // 6 second delay
```

### Issue: "No data extracted"

**Possible causes:**
1. Website structure changed
2. URL is incorrect
3. Content is behind JavaScript/login

**Solutions:**
1. Update regex patterns
2. Use browser automation (Playwright/Puppeteer)
3. Manual data entry

### Issue: "Dates not parsing correctly"

**Solution:** Add more date formats:

```typescript
const dateFormats = [
  /(\d{1,2})[\s\-\/]+(Jan|Feb|...)\d{4}/i,  // 15 March 2025
  /(\d{4})-(\d{2})-(\d{2})/,                 // 2025-03-15
  /(\d{1,2})\/(\d{1,2})\/(\d{4})/           // 03/15/2025
];
```

## Best Practices

### ✅ DO:
- Add delays between requests (rate limiting)
- Log all scraping activity
- Validate extracted data before saving
- Use fallback methods if primary fails
- Test scrapers regularly

### ❌ DON'T:
- Scrape more than once per hour
- Save unvalidated data
- Ignore robots.txt
- Scrape without logging
- Assume website structure won't change

## Limitations

1. **Website Changes** - Scrapers break when sites update
2. **JavaScript Content** - Can't scrape dynamic content easily
3. **Rate Limits** - Jina AI has 10 req/min free tier
4. **PDFs** - Merit lists in PDF need OCR or manual entry
5. **Authentication** - Can't access login-required pages

## Alternative: Manual Data Entry

For **MVP**, consider manual data entry:

**Advantages:**
- ✅ 100% accurate
- ✅ No technical failures
- ✅ Faster implementation
- ✅ No API costs

**Time Required:**
- 30 minutes/week during admission season
- Check 4 universities
- Update deadlines & announcements

**Cost:**
- $0 (you do it)
- OR $50-100/month (hire someone)

## Hybrid Approach (Recommended)

1. **Automated scraping** tries every 12 hours
2. **Admin dashboard** shows scraping status
3. **Manual override** when scraping fails
4. **Email alerts** when scraping detects changes

This gives you **best of both worlds**! 🎯

## Monitoring

View scraping logs in admin dashboard:
- ✅ Success rate
- ⏱️ Execution time
- 📊 Data extracted
- ❌ Error messages

## Future Enhancements

1. **Browser Automation** - Use Playwright for JavaScript-heavy sites
2. **OCR Integration** - Extract merit lists from PDFs
3. **Change Detection** - Alert when new data appears
4. **SMS Notifications** - Send alerts to students
5. **AI Parsing** - Use GPT-4 to understand unstructured data

---

**Need help? Check the logs or contact the development team!**

