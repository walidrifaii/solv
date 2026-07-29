-- Hero slider table (run if prisma db push is unavailable)
CREATE TABLE IF NOT EXISTS `hero_slides` (
  `id` VARCHAR(191) NOT NULL,
  `eyebrow` VARCHAR(120) NOT NULL,
  `eyebrow_ar` VARCHAR(120) NULL,
  `title` VARCHAR(200) NOT NULL,
  `title_ar` VARCHAR(200) NULL,
  `description` TEXT NOT NULL,
  `description_ar` TEXT NULL,
  `cta_label` VARCHAR(80) NOT NULL,
  `cta_label_ar` VARCHAR(80) NULL,
  `image_alt` VARCHAR(200) NOT NULL,
  `image_alt_ar` VARCHAR(200) NULL,
  `image_path` VARCHAR(512) NOT NULL,
  `href` VARCHAR(500) NOT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `is_active` BOOLEAN NOT NULL DEFAULT true,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `hero_slides_is_active_sort_order_idx` (`is_active`, `sort_order`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
