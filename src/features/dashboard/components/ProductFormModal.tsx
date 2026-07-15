"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  AdminModal,
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
  open: boolean;
  initial?: ApiAdminProduct | null;
  categories: ApiAdminCategory[];
  saving: boolean;
  onClose: () => void;
  onSubmit: (body: CreateProductInput) => Promise<void>;
};

export function ProductFormModal({
  open,
  initial,
  categories,
  saving,
  onClose,
  onSubmit,
}: Props) {
  const editing = Boolean(initial);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountType, setDiscountType] = useState<"" | "FIXED" | "PERCENTAGE">(
    "",
  );
  const [discount, setDiscount] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [quantity, setQuantity] = useState("0");
  const [sortOrder, setSortOrder] = useState("0");
  const [inStock, setInStock] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setName(initial?.name ?? "");
    setSlug(initial?.slug ?? "");
    setCategoryId(initial?.categoryId ?? categories[0]?.id ?? "");
    setDescription(initial?.description ?? "");
    setPrice(initial ? String(initial.price) : "");
    setDiscountType(initial?.discountType ?? "");
    setDiscount(initial?.discount != null ? String(initial.discount) : "");
    setImagePath(initial?.imagePath ?? "");
    setQuantity(String(initial?.quantity ?? 0));
    setSortOrder(String(initial?.sortOrder ?? 0));
    setInStock(initial?.inStock ?? true);
    setIsFeatured(initial?.isFeatured ?? false);
    setIsActive(initial?.isActive ?? true);
    setError("");
  }, [open, initial, categories]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

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
      onClose();
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not save product."));
    }
  }

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      wide
      title={editing ? "Edit product" : "Add product"}
      description="Storefront only shows active products."
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
              rows={3}
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

        <div className="flex flex-wrap gap-4 pt-1">
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

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#e8ddd2] px-4 py-2.5 text-sm font-medium text-[#5c4f43] hover:bg-[#FEF9F6]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-[#c4a574] px-4 py-2.5 text-sm font-medium text-[#17100a] hover:bg-[#d4b584] disabled:opacity-60"
          >
            {saving ? "Saving…" : editing ? "Save changes" : "Create product"}
          </button>
        </div>
      </form>
    </AdminModal>
  );
}
