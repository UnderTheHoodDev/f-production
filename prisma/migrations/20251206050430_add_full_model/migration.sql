-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "publicId" TEXT,
ALTER COLUMN "url" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL,
    "youtubeUrl" TEXT,
    "thumbnail" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "place" TEXT,
    "client" TEXT,
    "description" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "eventOrder" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EventToImage" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EventToImage_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_EventToVideo" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EventToVideo_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_EventToImage_B_index" ON "_EventToImage"("B");

-- CreateIndex
CREATE INDEX "_EventToVideo_B_index" ON "_EventToVideo"("B");

-- AddForeignKey
ALTER TABLE "_EventToImage" ADD CONSTRAINT "_EventToImage_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToImage" ADD CONSTRAINT "_EventToImage_B_fkey" FOREIGN KEY ("B") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToVideo" ADD CONSTRAINT "_EventToVideo_A_fkey" FOREIGN KEY ("A") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToVideo" ADD CONSTRAINT "_EventToVideo_B_fkey" FOREIGN KEY ("B") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;
