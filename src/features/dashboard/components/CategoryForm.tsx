"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  adminInputClass,
  adminLabelClass,
} from "@/features/dashboard/components/AdminModal";
import { ImageUploadField } from "@/features/dashboard/components/ImageUploadField";
import type { ApiAdminCategory, CreateCategoryInput } from "@/store/api/types";
import { getApiErrorMessage } from "@/store/api/errors";

type Props = {
  initial?: ApiAdminCategory | null;
  saving: boolean;
  onCancel: () => void;
  onSubmit: (body: CreateCategoryInput) => Promise<void>;
};

export function CategoryForm({
  initial,
  saving,
  onCancel,
  onSubmit,
}: Props) {
  const editing = Boolean(initial);
  const [name, setName] = useState(initial?.name ?? "");
  const [nameAr, setNameAr] = useState(initial?.nameAr ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [descriptionAr, setDescriptionAr] = useState(
    initial?.descriptionAr ?? "",
  );
  const [imagePath, setImagePath] = useState(initial?.imagePath ?? "");
  const [sortOrder, setSortOrder] = useState(String(initial?.sortOrder ?? 0));
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [error, setError] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    if (!initial) return;
    setName(initial.name);
    setNameAr(initial.nameAr ?? "");
    setSlug(initial.slug);
    setDescription(initial.description ?? "");
    setDescriptionAr(initial.descriptionAr ?? "");
    setImagePath(initial.imagePath);
    setSortOrder(String(initial.sortOrder));
    setIsActive(initial.isActive);
    setError("");
    setImageUploading(false);
  }, [initial]);

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

    try {
      await onSubmit({
        name: name.trim(),
        nameAr: nameAr.trim() || null,
        ...(slug.trim() ? { slug: slug.trim() } : {}),
        description: description.trim() || null,
        descriptionAr: descriptionAr.trim() || null,
        imagePath: imagePath.trim(),
        sortOrder: Number(sortOrder) || 0,
        isActive,
      });
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not save category."));
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-[#e8ddd2] bg-white p-5 sm:p-6"
      noValidate
    >
      <div>
        <label className={adminLabelClass} htmlFor="category-name">
          Name (English)
        </label>
        <input
          id="category-name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={adminInputClass}
          placeholder="Coffee Beans"
        />
      </div>
      <div>
        <label className={adminLabelClass} htmlFor="category-name-ar">
          Name (Arabic)
        </label>
        <input
          id="category-name-ar"
          value={nameAr}
          onChange={(e) => setNameAr(e.target.value)}
          className={adminInputClass}
          placeholder="حبوب القهوة"
          dir="rtl"
        />
      </div>
      <div>
        <label className={adminLabelClass} htmlFor="category-slug">
          Slug {editing ? "" : "(optional)"}
        </label>
        <input
          id="category-slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className={adminInputClass}
          placeholder="coffee-beans"
        />
      </div>
      <div>
        <label className={adminLabelClass} htmlFor="category-description">
          Description (English)
        </label>
        <textarea
          id="category-description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={adminInputClass + " resize-y"}
          placeholder="Short collection summary"
        />
      </div>
      <div>
        <label className={adminLabelClass} htmlFor="category-description-ar">
          Description (Arabic)
        </label>
        <textarea
          id="category-description-ar"
          rows={4}
          value={descriptionAr}
          onChange={(e) => setDescriptionAr(e.target.value)}
          className={adminInputClass + " resize-y"}
          placeholder="ملخص قصير للمجموعة"
          dir="rtl"
        />
      </div>
      <ImageUploadField
        label="Image"
        value={imagePath}
        onChange={setImagePath}
        onUploadingChange={setImageUploading}
        required
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={adminLabelClass} htmlFor="category-sort">
            Sort order
          </label>
          <input
            id="category-sort"
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
              className="size-4 rounded border-[#ddd0c4] accent-[#c4a574]"
            />
            Active on storefront
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
          disabled={saving || imageUploading || !imagePath.trim()}
          className="rounded-xl bg-[#c4a574] px-4 py-2.5 text-sm font-medium text-[#17100a] hover:bg-[#d4b584] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {imageUploading
            ? "Uploading image…"
            : saving
              ? "Saving…"
              : editing
                ? "Save changes"
                : "Create category"}
        </button>
      </div>
    </form>
  );
}
