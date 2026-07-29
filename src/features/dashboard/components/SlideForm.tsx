"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  adminInputClass,
  adminLabelClass,
} from "@/features/dashboard/components/AdminModal";
import { ImageUploadField } from "@/features/dashboard/components/ImageUploadField";
import { ROUTES } from "@/constants/routes";
import type { ApiAdminHeroSlide, CreateSlideInput } from "@/store/api/types";
import { getApiErrorMessage } from "@/store/api/errors";

type Props = {
  initial?: ApiAdminHeroSlide | null;
  saving: boolean;
  onCancel: () => void;
  onSubmit: (body: CreateSlideInput) => Promise<void>;
};

export function SlideForm({ initial, saving, onCancel, onSubmit }: Props) {
  const editing = Boolean(initial);
  const [eyebrow, setEyebrow] = useState(initial?.eyebrow ?? "");
  const [eyebrowAr, setEyebrowAr] = useState(initial?.eyebrowAr ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [titleAr, setTitleAr] = useState(initial?.titleAr ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [descriptionAr, setDescriptionAr] = useState(
    initial?.descriptionAr ?? "",
  );
  const [ctaLabel, setCtaLabel] = useState(initial?.ctaLabel ?? "Shop Now");
  const [ctaLabelAr, setCtaLabelAr] = useState(initial?.ctaLabelAr ?? "");
  const [imageAlt, setImageAlt] = useState(initial?.imageAlt ?? "");
  const [imageAltAr, setImageAltAr] = useState(initial?.imageAltAr ?? "");
  const [imagePath, setImagePath] = useState(initial?.imagePath ?? "");
  const [href, setHref] = useState(initial?.href ?? ROUTES.shop);
  const [sortOrder, setSortOrder] = useState(String(initial?.sortOrder ?? 0));
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);
  const [error, setError] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    if (!initial) return;
    setEyebrow(initial.eyebrow);
    setEyebrowAr(initial.eyebrowAr ?? "");
    setTitle(initial.title);
    setTitleAr(initial.titleAr ?? "");
    setDescription(initial.description);
    setDescriptionAr(initial.descriptionAr ?? "");
    setCtaLabel(initial.ctaLabel);
    setCtaLabelAr(initial.ctaLabelAr ?? "");
    setImageAlt(initial.imageAlt);
    setImageAltAr(initial.imageAltAr ?? "");
    setImagePath(initial.imagePath);
    setHref(initial.href);
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
        eyebrow: eyebrow.trim(),
        eyebrowAr: eyebrowAr.trim() || null,
        title: title.trim(),
        titleAr: titleAr.trim() || null,
        description: description.trim(),
        descriptionAr: descriptionAr.trim() || null,
        ctaLabel: ctaLabel.trim(),
        ctaLabelAr: ctaLabelAr.trim() || null,
        imageAlt: imageAlt.trim(),
        imageAltAr: imageAltAr.trim() || null,
        imagePath: imagePath.trim(),
        href: href.trim(),
        sortOrder: Number(sortOrder) || 0,
        isActive,
      });
    } catch (err) {
      setError(getApiErrorMessage(err, "Could not save slide."));
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-[#e8ddd2] bg-white p-5 sm:p-6"
      noValidate
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={adminLabelClass} htmlFor="slide-eyebrow">
            Eyebrow (English)
          </label>
          <input
            id="slide-eyebrow"
            required
            value={eyebrow}
            onChange={(e) => setEyebrow(e.target.value)}
            className={adminInputClass}
            placeholder="Premium Coffee & Tea"
          />
        </div>
        <div>
          <label className={adminLabelClass} htmlFor="slide-eyebrow-ar">
            Eyebrow (Arabic)
          </label>
          <input
            id="slide-eyebrow-ar"
            value={eyebrowAr}
            onChange={(e) => setEyebrowAr(e.target.value)}
            className={adminInputClass}
            placeholder="قهوة وشاي فاخر"
            dir="rtl"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={adminLabelClass} htmlFor="slide-title">
            Title (English)
          </label>
          <input
            id="slide-title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={adminInputClass}
            placeholder="Rich Flavor, Perfect Moments"
          />
        </div>
        <div>
          <label className={adminLabelClass} htmlFor="slide-title-ar">
            Title (Arabic)
          </label>
          <input
            id="slide-title-ar"
            value={titleAr}
            onChange={(e) => setTitleAr(e.target.value)}
            className={adminInputClass}
            placeholder="نكهة غنية، لحظات مثالية"
            dir="rtl"
          />
        </div>
      </div>

      <div>
        <label className={adminLabelClass} htmlFor="slide-description">
          Description (English)
        </label>
        <textarea
          id="slide-description"
          required
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={adminInputClass + " resize-y"}
        />
      </div>
      <div>
        <label className={adminLabelClass} htmlFor="slide-description-ar">
          Description (Arabic)
        </label>
        <textarea
          id="slide-description-ar"
          rows={3}
          value={descriptionAr}
          onChange={(e) => setDescriptionAr(e.target.value)}
          className={adminInputClass + " resize-y"}
          dir="rtl"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={adminLabelClass} htmlFor="slide-cta">
            CTA label (English)
          </label>
          <input
            id="slide-cta"
            required
            value={ctaLabel}
            onChange={(e) => setCtaLabel(e.target.value)}
            className={adminInputClass}
          />
        </div>
        <div>
          <label className={adminLabelClass} htmlFor="slide-cta-ar">
            CTA label (Arabic)
          </label>
          <input
            id="slide-cta-ar"
            value={ctaLabelAr}
            onChange={(e) => setCtaLabelAr(e.target.value)}
            className={adminInputClass}
            dir="rtl"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={adminLabelClass} htmlFor="slide-alt">
            Image alt (English)
          </label>
          <input
            id="slide-alt"
            required
            value={imageAlt}
            onChange={(e) => setImageAlt(e.target.value)}
            className={adminInputClass}
          />
        </div>
        <div>
          <label className={adminLabelClass} htmlFor="slide-alt-ar">
            Image alt (Arabic)
          </label>
          <input
            id="slide-alt-ar"
            value={imageAltAr}
            onChange={(e) => setImageAltAr(e.target.value)}
            className={adminInputClass}
            dir="rtl"
          />
        </div>
      </div>

      <ImageUploadField
        label="Image"
        value={imagePath}
        onChange={setImagePath}
        onUploadingChange={setImageUploading}
        required
      />

      <div>
        <label className={adminLabelClass} htmlFor="slide-href">
          Link URL
        </label>
        <input
          id="slide-href"
          required
          value={href}
          onChange={(e) => setHref(e.target.value)}
          className={adminInputClass}
          placeholder="/products"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={adminLabelClass} htmlFor="slide-sort">
            Sort order
          </label>
          <input
            id="slide-sort"
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
              className="size-4 rounded border-[#ddd0c4] accent-[#a5a196]"
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
          disabled={saving || imageUploading || !imagePath.trim()}
          className="rounded-xl bg-[#a5a196] px-4 py-2.5 text-sm font-medium text-[#17100a] hover:bg-[#b5b1a6] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {imageUploading
            ? "Uploading image…"
            : saving
              ? "Saving…"
              : editing
                ? "Save changes"
                : "Create slide"}
        </button>
      </div>
    </form>
  );
}
