-- CreateTable
CREATE TABLE "MarriageProfile" (
    "id" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "lookingForGender" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "religiousPractice" TEXT NOT NULL,
    "maritalStatus" TEXT NOT NULL,
    "wantsChildren" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "photoUrl" TEXT,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "MarriageProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarriageInterest" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fromProfileId" TEXT NOT NULL,
    "toProfileId" TEXT NOT NULL,

    CONSTRAINT "MarriageInterest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MarriageProfile_userId_key" ON "MarriageProfile"("userId");

-- CreateIndex
CREATE INDEX "MarriageProfile_gender_lookingForGender_idx" ON "MarriageProfile"("gender", "lookingForGender");

-- CreateIndex
CREATE INDEX "MarriageProfile_country_city_idx" ON "MarriageProfile"("country", "city");

-- CreateIndex
CREATE INDEX "MarriageInterest_toProfileId_idx" ON "MarriageInterest"("toProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "MarriageInterest_fromProfileId_toProfileId_key" ON "MarriageInterest"("fromProfileId", "toProfileId");

-- AddForeignKey
ALTER TABLE "MarriageProfile" ADD CONSTRAINT "MarriageProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarriageInterest" ADD CONSTRAINT "MarriageInterest_fromProfileId_fkey" FOREIGN KEY ("fromProfileId") REFERENCES "MarriageProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarriageInterest" ADD CONSTRAINT "MarriageInterest_toProfileId_fkey" FOREIGN KEY ("toProfileId") REFERENCES "MarriageProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

