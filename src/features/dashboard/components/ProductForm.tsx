"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  adminInputClass,
  adminLabelClass,
} from "@/features/dashboard/components/AdminModal";
import { ImageUploadField } from "@/features/dashboard/components/ImageUploadField";
import type {
  ApiAdminCategory,
  ApiAdminProduct,
  CreateProductInput,
} from "@/store/api/types";
import { getApiErrorMessage } from "@/store/api/errors";

type Props = {
  initial?: ApiAdminProduct | null;
  categories: ApiAdminCategory[];
  saving: boolean;
  onCancel: () => void;
  onSubmit: (body: CreateProductInput) => Promise<void>;
};

export function ProductForm({
  initial,
  categories,
  saving,
  onCancel,
  onSubmit,
}: Props) {
  const editing = Boolean(initial);
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [categoryId, setCategoryId] = useState(
    initial?.categoryId ?? categories[0]?.id ?? "",
  );
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(initial ? String(initial.price) : "");
  const [discountType, setDiscountType] = useState<"" | "FIXED" | "PERCENTAGE">(
    initial?.discountType ?? "",
  );
  const [discount, setDiscount] = useState(
    initial?.discount != null ? String(initial.discount) : "",
  );
  const [imagePath, setImagePath] = useState(initial?.imagePath ?? "");
  const [quantity, setQuantity] = useState(String(initial?.quantity ?? 0));
  const [sortOrder, setSortOrder] = useState(String(initial?.sortOrder ?? 0));
  const [inStock, setInStock] = useState(initial?.inStock ?? true);
  const [isFeatured, setIsFeatured] = useState(initial?.isFeatured ?? false);
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [error, setError] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    if (!initial) return;
    setName(initial.name);
    setSlug(initial.slug);
    setCategoryId(initial.categoryId);
    setDescription(initial.description);
    setPrice(String(initial.price));
    setDiscountType(initial.discountType ?? "");
    setDiscount(initial.discount != null ? String(initial.discount) : "");
    setImagePath(initial.imagePath);
    setQuantity(String(initial.quantity));
    setSortOrder(String(initial.sortOrder));
    setInStock(initial.inStock);
    setIsFeatured(initial.isFeatured);
    setIsActive(initial.isActive);
    setError("");
    setImageUploading(false);
  }, [initial]);

  useEffect(() => {
    if (initial) return;
    if (!categoryId && categories[0]?.id) {
      setCategoryId(categories[0].id);
    }
  }, [initial, categories, categoryId]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (imageUploading) {
      setError("Please wait until the image finishes uploading.");
      return;
    }

    if (!categoryId) {
      setError("Select a category.");
      return;
    }

    if (!imagePath.trim()) {
      setError("Please upload an image.");
      return;
    }

    const body: CreateProductInput = {
      name: name.trim(),
      ...(slug.trim() ? { slug: slug.trim() } : {}),
      categoryId,
      description: description.trim(),
      price: Number(price),
      imagePath: imagePath.trim(),
      quantity: Number(quantity) || 0,
      sortOrder: Number(sortOrder) || 0,
      inStock,
      isFeatured,
      isActive,
      discountType: discountType || null,
      discount: discountType ? Number(discount) : null,
    };

    try {
      await onSubmit(body);
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not save product."));
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-[#e8ddd2] bg-white p-5 sm:p-6"
      noValidate
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={adminLabelClass} htmlFor="product-name">
            Name
          </label>
          <input
            id="product-name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={adminInputClass}
            placeholder="Ethiopian Yirgacheffe"
          />
        </div>
        <div>
          <label className={adminLabelClass} htmlFor="product-slug">
            Slug {editing ? "" : "(optional)"}
          </label>
          <input
            id="product-slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className={adminInputClass}
            placeholder="ethiopian-yirgacheffe"
          />
        </div>
        <div>
          <label className={adminLabelClass} htmlFor="product-category">
            Category
          </label>
          <select
            id="product-category"
            required
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className={adminInputClass}
          >
            <option value="" disabled>
              Select category
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
                {!category.isActive ? " (hidden)" : ""}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className={adminLabelClass} htmlFor="product-description">
            Description
          </label>
          <textarea
            id="product-description"
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={adminInputClass + " resize-y"}
          />
        </div>
        <div>
          <label className={adminLabelClass} htmlFor="product-price">
            Price (QAR)
          </label>
          <input
            id="product-price"
            type="number"
            min={0}
            step="0.01"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={adminInputClass}
          />
        </div>
        <div className="sm:col-span-2">
          <ImageUploadField
            label="Image"
            value={imagePath}
            onChange={setImagePath}
            onUploadingChange={setImageUploading}
            required
          />
        </div>
        <div>
          <label className={adminLabelClass} htmlFor="product-discount-type">
            Discount type
          </label>
          <select
            id="product-discount-type"
            value={discountType}
            onChange={(e) =>
              setDiscountType(e.target.value as "" | "FIXED" | "PERCENTAGE")
            }
            className={adminInputClass}
          >
            <option value="">None</option>
            <option value="FIXED">Fixed (QAR off)</option>
            <option value="PERCENTAGE">Percentage</option>
          </select>
        </div>
        <div>
          <label className={adminLabelClass} htmlFor="product-discount">
            Discount value
          </label>
          <input
            id="product-discount"
            type="number"
            min={0}
            step="0.01"
            disabled={!discountType}
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className={adminInputClass + " disabled:bg-[#FEF9F6]"}
          />
        </div>
        <div>
          <label className={adminLabelClass} htmlFor="product-qty">
            Quantity
          </label>
          <input
            id="product-qty"
            type="number"
            min={0}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className={adminInputClass}
          />
        </div>
        <div>
          <label className={adminLabelClass} htmlFor="product-sort">
            Sort order
          </label>
          <input
            id="product-sort"
            type="number"
            min={0}
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className={adminInputClass}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-[#5c4f43]">
          <input
            type="checkbox"
            checked={inStock}
            onChange={(e) => setInStock(e.target.checked)}
            className="size-4 rounded border-[#ddd0c4] accent-[#c4a574]"
          />
          In stock
        </label>
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-[#5c4f43]">
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="size-4 rounded border-[#ddd0c4] accent-[#c4a574]"
          />
          Featured
        </label>
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-[#5c4f43]">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="size-4 rounded border-[#ddd0c4] accent-[#c4a574]"
          />
          Active on storefront
        </label>
      </div>

      {error ? (
        <p className="text-sm text-[#a35d5d]" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap justify-end gap-2 border-t border-[#f0e7de] pt-5">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving || imageUploading}
          className="rounded-xl border border-[#e8ddd2] px-4 py-2.5 text-sm font-medium text-[#5c4f43] hover:bg-[#FEF9F6] disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving || imageUploading || !imagePath.trim()}
          className="rounded-xl bg-[#c4a574] px-4 py-2.5 text-sm font-medium text-[#17100a] hover:bg-[#d4b584] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {imageUploading
            ? "Uploading image…"
            : saving
              ? "Saving…"
              : editing
                ? "Save changes"
                : "Create product"}
        </button>
      </div>
    </form>
  );
}
