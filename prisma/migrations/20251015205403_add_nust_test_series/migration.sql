-- CreateTable
CREATE TABLE "nust_test_series" (
    "id" TEXT NOT NULL,
    "seriesName" TEXT NOT NULL,
    "onlineRegistration" TEXT,
    "cbnet" TEXT,
    "pbnet" TEXT,
    "testCentre" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "nust_test_series_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "nust_test_series_seriesName_key" ON "nust_test_series"("seriesName");
