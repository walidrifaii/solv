-- Add ADMIN_PASSWORD_CHANGE to email_otps.purpose enum (MySQL)
-- Run if prisma db push is unavailable after deploying password change feature

ALTER TABLE `email_otps`
  MODIFY COLUMN `purpose` ENUM('REGISTER', 'EMAIL_CHANGE', 'ADMIN_PASSWORD_CHANGE') NOT NULL;
