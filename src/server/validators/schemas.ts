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

export const verifyOtpSchema = z.object({
  email: z.string().trim().email().max(160),
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Enter the 6-digit code"),
});

export const resendOtpSchema = z.object({
  email: z.string().trim().email().max(160),
});

export const updateProfileSchema = z
  .object({
    name: z.string().trim().min(2).max(120).optional(),
    phone: z.string().trim().max(40).optional().nullable(),
  })
  .refine((data) => data.name !== undefined || data.phone !== undefined, {
    message: "At least one field is required",
  });

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1).max(72),
  newPassword: z.string().min(8).max(72),
});

export const requestEmailChangeSchema = z.object({
  email: z.string().trim().email().max(160),
});

export const confirmEmailChangeSchema = z.object({
  email: z.string().trim().email().max(160),
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Enter the 6-digit code"),
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

const boolQuery = z
  .enum(["true", "false"])
  .optional()
  .transform((v) => (v === undefined ? undefined : v === "true"));

const slugField = z
  .string()
  .trim()
  .min(2)
  .max(80)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens");

export const adminCategoryListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().trim().max(100).optional(),
  isActive: boolQuery,
});

export const createCategorySchema = z.object({
  id: slugField.optional(),
  slug: slugField.optional(),
  name: z.string().trim().min(2).max(80),
  description: z.string().trim().max(2000).optional().nullable(),
  imagePath: z
    .string()
    .trim()
    .min(1)
    .max(500),
  sortOrder: z.coerce.number().int().min(0).max(9999).default(0),
  isActive: z.boolean().default(true),
});

export const updateCategorySchema = createCategorySchema
  .omit({ id: true })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export const adminProductListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().trim().max(100).optional(),
  categoryId: z.string().optional(),
  isActive: boolQuery,
  featured: boolQuery,
  inStock: boolQuery,
});

const discountFields = {
  discountType: z.enum(["FIXED", "PERCENTAGE"]).optional().nullable(),
  discount: z.coerce.number().min(0).max(999999).optional().nullable(),
};

function refineDiscount(
  data: { discountType?: string | null; discount?: number | null },
  ctx: z.RefinementCtx,
) {
  const hasType = data.discountType != null;
  const hasValue = data.discount != null;
  if (hasType !== hasValue) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "discountType and discount must both be set or both empty",
      path: ["discount"],
    });
  }
  if (data.discountType === "PERCENTAGE" && data.discount != null && data.discount > 100) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Percentage discount cannot exceed 100",
      path: ["discount"],
    });
  }
}

export const createProductSchema = z
  .object({
    id: slugField.optional(),
    slug: slugField.optional(),
    categoryId: z.string().trim().min(1),
    name: z.string().trim().min(2).max(160),
    description: z.string().trim().min(1).max(5000),
    price: z.coerce.number().min(0).max(999999),
    ...discountFields,
    imagePath: z.string().trim().min(1).max(500),
    quantity: z.coerce.number().int().min(0).max(999999).default(0),
    inStock: z.boolean().default(true),
    isFeatured: z.boolean().default(false),
    isActive: z.boolean().default(true),
    sortOrder: z.coerce.number().int().min(0).max(9999).default(0),
  })
  .superRefine(refineDiscount);

export const updateProductSchema = z
  .object({
    slug: slugField.optional(),
    categoryId: z.string().trim().min(1).optional(),
    name: z.string().trim().min(2).max(160).optional(),
    description: z.string().trim().min(1).max(5000).optional(),
    price: z.coerce.number().min(0).max(999999).optional(),
    discountType: z.enum(["FIXED", "PERCENTAGE"]).optional().nullable(),
    discount: z.coerce.number().min(0).max(999999).optional().nullable(),
    imagePath: z.string().trim().min(1).max(500).optional(),
    quantity: z.coerce.number().int().min(0).max(999999).optional(),
    inStock: z.boolean().optional(),
    isFeatured: z.boolean().optional(),
    isActive: z.boolean().optional(),
    sortOrder: z.coerce.number().int().min(0).max(9999).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  })
  .superRefine(refineDiscount);

export const orderStatusEnum = z.enum([
  "PENDING",
  "CONFIRMED",
  "PREPARING",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
]);

export const adminOrderListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().trim().max(100).optional(),
  status: orderStatusEnum.optional(),
});

export const updateOrderStatusSchema = z.object({
  status: orderStatusEnum,
});

export const adminSubscriberListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  search: z.string().trim().max(100).optional(),
  isActive: z
    .enum(["true", "false"])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === "true")),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().max(40).optional().nullable(),
  subject: z.string().trim().min(2).max(120),
  message: z.string().trim().min(10).max(5000),
});
