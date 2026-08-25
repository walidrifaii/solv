-- Promo banners (2-up homepage section before Shop by Category)
CREATE TABLE IF NOT EXISTS `promo_banners` (
  `id` VARCHAR(191) NOT NULL,
  `image_alt` VARCHAR(200) NOT NULL,
  `image_alt_ar` VARCHAR(200) NULL,
  `image_path` VARCHAR(512) NOT NULL,
  `href` VARCHAR(500) NOT NULL,
  `category_id` VARCHAR(191) NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `is_active` BOOLEAN NOT NULL DEFAULT true,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `promo_banners_is_active_sort_order_idx` (`is_active`, `sort_order`),
  INDEX `promo_banners_category_id_idx` (`category_id`),
  CONSTRAINT `promo_banners_category_id_fkey`
    FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
