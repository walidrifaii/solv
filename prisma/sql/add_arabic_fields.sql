-- Add Arabic translation columns for categories and products
-- Safe to re-run: uses IF NOT EXISTS pattern via procedure-less ALTER where supported.

ALTER TABLE `categories`
  ADD COLUMN `name_ar` VARCHAR(80) NULL AFTER `name`,
  ADD COLUMN `description_ar` TEXT NULL AFTER `description`;

ALTER TABLE `products`
  ADD COLUMN `name_ar` VARCHAR(160) NULL AFTER `name`,
  ADD COLUMN `description_ar` TEXT NULL AFTER `description`;
