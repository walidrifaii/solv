"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  AdminModal,
  adminInputClass,
  adminLabelClass,
} from "@/features/dashboard/components/AdminModal";
import { ImageUploadField } from "@/features/dashboard/components/ImageUploadField";
import type { ApiAdminCategory, CreateCategoryInput } from "@/store/api/types";
import { getApiErrorMessage } from "@/store/api/errors";

type Props = {
  open: boolean;
  initial?: ApiAdminCategory | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: (body: CreateCategoryInput) => Promise<void>;
};

export function CategoryFormModal({
  open,
  initial,
  saving,
  onClose,
  onSubmit,
}: Props) {
  const editing = Boolean(initial);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setName(initial?.name ?? "");
    setSlug(initial?.slug ?? "");
    setDescription(initial?.description ?? "");
    setImagePath(initial?.imagePath ?? "");
    setSortOrder(String(initial?.sortOrder ?? 0));
    setIsActive(initial?.isActive ?? true);
    setError("");
  }, [open, initial]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!imagePath.trim()) {
      setError("Please upload an image.");
      return;
    }

    try {
      await onSubmit({
        name: name.trim(),
        ...(slug.trim() ? { slug: slug.trim() } : {}),
        description: description.trim() || null,
        imagePath: imagePath.trim(),
        sortOrder: Number(sortOrder) || 0,
        isActive,
      });
      onClose();
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not save category."));
    }
  }

  return (
    <AdminModal
      open={open}
      onClose={onClose}
      title={editing ? "Edit category" : "Add category"}
      description="Visible on the shop-by-category section when active."
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label className={adminLabelClass} htmlFor="category-name">
            Name
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
            Description
          </label>
          <textarea
            id="category-description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={adminInputClass + " resize-y"}
            placeholder="Short collection summary"
          />
        </div>
        <div>
          <ImageUploadField
            label="Image"
            value={imagePath}
            onChange={setImagePath}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
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
            {saving ? "Saving…" : editing ? "Save changes" : "Create category"}
          </button>
        </div>
      </form>
    </AdminModal>
  );
}
