import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  password: z.string().min(8).max(72),
  phone: z.string().trim().max(40).optional().nullable(),
});

export const loginSchema = z.object({
  email: z.string().trim().email().max(160),
  password: z.string().min(1).max(72),
});

export const subscribeSchema = z.object({
  email: z.string().trim().email().max(160),
});

export const createOrderItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().int().min(1).max(99),
});

export const createOrderSchema = z.object({
  guestName: z.string().trim().min(2).max(120),
  guestEmail: z.string().trim().email().max(160),
  guestPhone: z.string().trim().min(6).max(40),
  deliveryCity: z.string().trim().min(2).max(80),
  deliveryAddress: z.string().trim().min(5).max(255),
  notes: z.string().trim().max(1000).optional().nullable(),
  deliveryFee: z.coerce.number().min(0).max(9999).default(0),
  items: z.array(createOrderItemSchema).min(1).max(50),
});

export const productListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  categoryId: z.string().optional(),
  search: z.string().trim().max(100).optional(),
  featured: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === "true")),
  inStock: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === "true")),
});

export const categoryListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});
