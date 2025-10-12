-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "phoneNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLogin" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "matricTotalMarks" INTEGER NOT NULL,
    "matricObtainedMarks" INTEGER NOT NULL,
    "matricPercentage" DOUBLE PRECISION NOT NULL,
    "matricBoard" TEXT NOT NULL,
    "matricYear" INTEGER NOT NULL,
    "interTotalMarks" INTEGER NOT NULL,
    "interObtainedMarks" INTEGER NOT NULL,
    "interPercentage" DOUBLE PRECISION NOT NULL,
    "interBoard" TEXT NOT NULL,
    "interGroup" TEXT NOT NULL,
    "interYear" INTEGER NOT NULL,
    "nustTestScore" INTEGER,
    "fastTestScore" INTEGER,
    "ntsTestScore" INTEGER,
    "preferredCities" TEXT[],
    "preferredFields" TEXT[],
    "budgetRange" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "universities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "shortName" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "testRequired" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastScraped" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "universities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "seats" INTEGER,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "merit_lists" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "admissionCycle" TEXT NOT NULL,
    "meritType" TEXT NOT NULL,
    "closingMerit" DOUBLE PRECISION NOT NULL,
    "aggregatePercentage" DOUBLE PRECISION,
    "matricPercentage" DOUBLE PRECISION,
    "interPercentage" DOUBLE PRECISION,
    "testScore" DOUBLE PRECISION,
    "publishedDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "merit_lists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admission_timelines" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "cycle" TEXT NOT NULL,
    "applicationStart" TIMESTAMP(3),
    "applicationDeadline" TIMESTAMP(3),
    "testDate" TIMESTAMP(3),
    "firstMeritList" TIMESTAMP(3),
    "secondMeritList" TIMESTAMP(3),
    "thirdMeritList" TIMESTAMP(3),
    "finalMeritList" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "scrapedData" JSONB,
    "lastUpdated" TIMESTAMP(3) NOT NULL,
    "updatedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admission_timelines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "university_updates" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "updateType" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "sourceUrl" TEXT,
    "publishedDate" TIMESTAMP(3),
    "isManual" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "university_updates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_matches" (
    "id" TEXT NOT NULL,
    "studentProfileId" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "matchScore" DOUBLE PRECISION NOT NULL,
    "estimatedMerit" DOUBLE PRECISION NOT NULL,
    "requiredMerit" DOUBLE PRECISION NOT NULL,
    "admissionChance" TEXT NOT NULL,
    "meritGap" DOUBLE PRECISION NOT NULL,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "student_matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scraping_logs" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "dataType" TEXT NOT NULL,
    "recordsUpdated" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT,
    "executionTime" INTEGER,
    "scheduledAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scraping_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_clerkId_key" ON "users"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "student_profiles_userId_key" ON "student_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "universities_shortName_key" ON "universities"("shortName");

-- CreateIndex
CREATE UNIQUE INDEX "admission_timelines_universityId_year_cycle_key" ON "admission_timelines"("universityId", "year", "cycle");

-- AddForeignKey
ALTER TABLE "student_profiles" ADD CONSTRAINT "student_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "departments" ADD CONSTRAINT "departments_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "universities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "merit_lists" ADD CONSTRAINT "merit_lists_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "universities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "merit_lists" ADD CONSTRAINT "merit_lists_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admission_timelines" ADD CONSTRAINT "admission_timelines_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "universities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "university_updates" ADD CONSTRAINT "university_updates_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "universities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_matches" ADD CONSTRAINT "student_matches_studentProfileId_fkey" FOREIGN KEY ("studentProfileId") REFERENCES "student_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_matches" ADD CONSTRAINT "student_matches_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "universities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_matches" ADD CONSTRAINT "student_matches_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scraping_logs" ADD CONSTRAINT "scraping_logs_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "universities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
