-- Link admin password OTP rows to admins table
ALTER TABLE `email_otps`
  ADD COLUMN `admin_id` VARCHAR(191) NULL AFTER `client_id`,
  MODIFY COLUMN `payload` VARCHAR(255) NULL,
  ADD INDEX `email_otps_admin_id_idx` (`admin_id`),
  ADD CONSTRAINT `email_otps_admin_id_fkey`
    FOREIGN KEY (`admin_id`) REFERENCES `admins`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
