-- CreateTable
CREATE TABLE "SharedProfile" (
  "id" TEXT NOT NULL,
  "shareToken" TEXT NOT NULL,
  "candidateId" TEXT NOT NULL,
  "candidateName" TEXT NOT NULL,
  "candidateRole" TEXT NOT NULL,
  "sharedWithName" TEXT NOT NULL,
  "sharedWithEmail" TEXT NOT NULL,
  "rateLabel" TEXT NOT NULL,
  "expirationDate" TIMESTAMP(3) NOT NULL,
  "sharedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "revokedAt" TIMESTAMP(3),
  "accessCount" INTEGER NOT NULL DEFAULT 0,
  "lastAccessedAt" TIMESTAMP(3),
  "sharedByUserId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "SharedProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SharedProfile_shareToken_key" ON "SharedProfile"("shareToken");

-- CreateIndex
CREATE INDEX "SharedProfile_candidateId_idx" ON "SharedProfile"("candidateId");

-- CreateIndex
CREATE INDEX "SharedProfile_sharedWithEmail_idx" ON "SharedProfile"("sharedWithEmail");

-- CreateIndex
CREATE INDEX "SharedProfile_expirationDate_idx" ON "SharedProfile"("expirationDate");

-- CreateIndex
CREATE INDEX "SharedProfile_revokedAt_idx" ON "SharedProfile"("revokedAt");

-- AddForeignKey
ALTER TABLE "SharedProfile" ADD CONSTRAINT "SharedProfile_candidateId_fkey" FOREIGN KEY ("candidateId") REFERENCES "Candidate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedProfile" ADD CONSTRAINT "SharedProfile_sharedByUserId_fkey" FOREIGN KEY ("sharedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
