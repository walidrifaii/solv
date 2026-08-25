"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  adminInputClass,
  adminLabelClass,
} from "@/features/dashboard/components/AdminModal";
import { ImageUploadField } from "@/features/dashboard/components/ImageUploadField";
import { ROUTES } from "@/constants/routes";
import type {
  ApiAdminPromoBanner,
  CreatePromoBannerInput,
} from "@/store/api/types";
import { getApiErrorMessage } from "@/store/api/errors";
import { useAdminListCategoriesQuery } from "@/store/slices";

type Props = {
  initial?: ApiAdminPromoBanner | null;
  saving: boolean;
  onCancel: () => void;
  onSubmit: (body: CreatePromoBannerInput) => Promise<void>;
};

export function PromoBannerForm({
  initial,
  saving,
  onCancel,
  onSubmit,
}: Props) {
  const editing = Boolean(initial);
  const { data: categoriesData, isLoading: loadingCategories } =
    useAdminListCategoriesQuery({ limit: 50 });
  const categories = categoriesData?.items ?? [];

  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? "");
  const [imageAlt, setImageAlt] = useState(initial?.imageAlt ?? "");
  const [imageAltAr, setImageAltAr] = useState(initial?.imageAltAr ?? "");
  const [imagePath, setImagePath] = useState(initial?.imagePath ?? "");
  const [sortOrder, setSortOrder] = useState(String(initial?.sortOrder ?? 0));
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [error, setError] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    if (!initial) return;
    setCategoryId(initial.categoryId ?? "");
    setImageAlt(initial.imageAlt);
    setImageAltAr(initial.imageAltAr ?? "");
    setImagePath(initial.imagePath);
    setSortOrder(String(initial.sortOrder));
    setIsActive(initial.isActive);
    setError("");
    setImageUploading(false);
  }, [initial]);

  useEffect(() => {
    if (initial || categoryId || categories.length === 0) return;
    setCategoryId(categories[0].id);
  }, [initial, categoryId, categories]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");

    if (imageUploading) {
      setError("Please wait until the image finishes uploading.");
      return;
    }

    if (!imagePath.trim()) {
      setError("Please upload an image.");
      return;
    }

    if (!categoryId) {
      setError("Please select a category.");
      return;
    }

    const category = categories.find((item) => item.id === categoryId);
    const name = category?.name?.trim() || "Shop";
    const nameAr = category?.nameAr?.trim() || null;

    try {
      await onSubmit({
        imageAlt: imageAlt.trim() || name,
        imageAltAr: imageAltAr.trim() || nameAr,
        imagePath: imagePath.trim(),
        href: ROUTES.shopCategory(categoryId),
        categoryId,
        sortOrder: Number(sortOrder) || 0,
        isActive,
      });
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not save banner."));
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-[#e8ddd2] bg-white p-5 sm:p-6"
      noValidate
    >
      <ImageUploadField
        label="Banner image"
        value={imagePath}
        onChange={setImagePath}
        onUploadingChange={setImageUploading}
        required
      />

      <div>
        <label className={adminLabelClass} htmlFor="promo-category">
          Category
        </label>
        <select
          id="promo-category"
          required
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className={adminInputClass}
          disabled={loadingCategories}
        >
          <option value="" disabled>
            {loadingCategories ? "Loading categories…" : "Select category"}
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
              {!category.isActive ? " (hidden)" : ""}
            </option>
          ))}
        </select>
        <p className="mt-1.5 text-xs text-[#8a7a6c]">
          Clicking this banner opens the category in the shop.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={adminLabelClass} htmlFor="promo-alt">
            Image alt (English)
          </label>
          <input
            id="promo-alt"
            value={imageAlt}
            onChange={(e) => setImageAlt(e.target.value)}
            className={adminInputClass}
            placeholder="Coffee promo banner"
          />
        </div>
        <div>
          <label className={adminLabelClass} htmlFor="promo-alt-ar">
            Image alt (Arabic)
          </label>
          <input
            id="promo-alt-ar"
            value={imageAltAr}
            onChange={(e) => setImageAltAr(e.target.value)}
            className={adminInputClass}
            placeholder="بانر ترويجي"
            dir="rtl"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={adminLabelClass} htmlFor="promo-sort">
            Sort order
          </label>
          <input
            id="promo-sort"
            type="number"
            min={0}
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className={adminInputClass}
          />
        </div>
        <div className="flex items-end pb-1">
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-[#5c4f43]">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="size-4 rounded border-[#ddd0c4] accent-[#C9A962]"
            />
            Active on homepage
          </label>
        </div>
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
          disabled={saving || imageUploading || !imagePath.trim() || !categoryId}
          className="rounded-xl bg-[#C9A962] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#D9BC82] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {imageUploading
            ? "Uploading image…"
            : saving
              ? "Saving…"
              : editing
                ? "Save changes"
                : "Create banner"}
        </button>
      </div>
    </form>
  );
}
