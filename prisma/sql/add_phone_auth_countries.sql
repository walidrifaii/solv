-- Phone auth + countries (run if not using prisma db push)
ALTER TABLE `clients`
  MODIFY `email` VARCHAR(160) NULL,
  ADD COLUMN `country_id` VARCHAR(191) NULL,
  ADD COLUMN `phone_verified_at` DATETIME(3) NULL;

-- Unique phone (nullable unique allows multiple NULLs in MySQL)
CREATE UNIQUE INDEX `clients_phone_key` ON `clients`(`phone`);
CREATE INDEX `clients_country_id_idx` ON `clients`(`country_id`);

ALTER TABLE `email_otps`
  MODIFY `purpose` ENUM('REGISTER', 'EMAIL_CHANGE', 'ADMIN_PASSWORD_CHANGE', 'PASSWORD_RESET') NOT NULL;

CREATE TABLE IF NOT EXISTS `countries` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(120) NOT NULL,
  `name_ar` VARCHAR(120) NULL,
  `iso2` VARCHAR(2) NOT NULL,
  `dial_code` VARCHAR(8) NOT NULL,
  `flag_emoji` VARCHAR(16) NULL,
  `sort_order` INTEGER NOT NULL DEFAULT 0,
  `is_active` BOOLEAN NOT NULL DEFAULT true,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `countries_iso2_key`(`iso2`),
  INDEX `countries_is_active_sort_order_idx`(`is_active`, `sort_order`),
  INDEX `countries_dial_code_idx`(`dial_code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `clients`
  ADD CONSTRAINT `clients_country_id_fkey`
  FOREIGN KEY (`country_id`) REFERENCES `countries`(`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;
