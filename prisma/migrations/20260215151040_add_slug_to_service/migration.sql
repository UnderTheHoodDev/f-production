-- AlterTable: Add slug column as nullable first
ALTER TABLE "Service" ADD COLUMN "slug" TEXT;

-- Populate slug for existing rows using name-to-slug mapping
UPDATE "Service" SET "slug" = CASE
  WHEN "name" ILIKE 'Chụp Ảnh Sự Kiện' THEN 'chup-anh-su-kien'
  WHEN "name" ILIKE 'Quay Phim Sự Kiện' THEN 'quay-phim-su-kien'
  ELSE LOWER(REPLACE("name", ' ', '-'))
END
WHERE "slug" IS NULL;

-- Insert remaining services that don't exist yet
INSERT INTO "Service" ("id", "name", "slug", "description", "eventOrder", "createdAt", "updatedAt") VALUES
  (gen_random_uuid(), 'Livestream Chuyên Nghiệp', 'livestream-chuyen-nghiep', 'Dịch vụ livestream chuyên nghiệp cho mọi sự kiện', '{}', NOW(), NOW()),
  (gen_random_uuid(), 'TVC - Phim Doanh Nghiệp', 'tvc-phim-doanh-nghiep', 'Sản xuất TVC và phim giới thiệu doanh nghiệp', '{}', NOW(), NOW()),
  (gen_random_uuid(), 'Chụp Ảnh Profile, Tập Thể', 'chup-anh-profile-tap-the', 'Chụp ảnh profile cá nhân, tập thể và doanh nghiệp', '{}', NOW(), NOW()),
  (gen_random_uuid(), 'Quay Phim Podcast', 'quay-phim-podcast', 'Quay và sản xuất podcast chuyên nghiệp', '{}', NOW(), NOW()),
  (gen_random_uuid(), 'Chụp Ảnh Kiến Trúc', 'chup-anh-kien-truc', 'Chụp ảnh công trình, không gian và kiến trúc chuyên nghiệp', '{}', NOW(), NOW()),
  (gen_random_uuid(), 'Quay Phim Kiến Trúc', 'quay-phim-kien-truc', 'Quay video kiến trúc và không gian bằng thiết bị chuyên dụng', '{}', NOW(), NOW()),
  (gen_random_uuid(), 'Truyền Thông Báo Chí', 'truyen-thong-bao-chi', 'Triển khai truyền thông báo chí và lan tỏa hình ảnh thương hiệu', '{}', NOW(), NOW()),
  (gen_random_uuid(), 'Livestream Sự Kiện', 'livestream-su-kien', 'Dịch vụ livestream sự kiện', '{}', NOW(), NOW()),
  (gen_random_uuid(), 'Chụp Ảnh Profile Chuyên Nghiệp', 'chup-anh-profile', 'Chụp ảnh profile chuyên nghiệp', '{}', NOW(), NOW());

-- Make slug NOT NULL
ALTER TABLE "Service" ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");
