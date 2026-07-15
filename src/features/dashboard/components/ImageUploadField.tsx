"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { adminLabelClass } from "@/features/dashboard/components/AdminModal";
import { getApiErrorMessage } from "@/store/api/errors";
import { useAdminUploadImageMutation } from "@/store/slices";

type Props = {
  label?: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
};

export function ImageUploadField({
  label = "Image",
  value,
  onChange,
  required,
}: Props) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [upload, { isLoading }] = useAdminUploadImageMutation();
  const [error, setError] = useState("");
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const preview = localPreview || value;

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setError("");

    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);

    const form = new FormData();
    form.append("file", file);

    try {
      const result = await upload(form).unwrap();
      onChange(result.url);
    } catch (err) {
      setError(getApiErrorMessage(err, "Upload failed."));
    } finally {
      setLocalPreview(null);
      URL.revokeObjectURL(objectUrl);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <p className={adminLabelClass}>{label}</p>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="relative size-24 shrink-0 overflow-hidden rounded-xl border border-[#e8ddd2] bg-[#FEF9F6]">
          {localPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={localPreview}
              alt=""
              className="size-full object-cover"
            />
          ) : preview ? (
            <Image
              src={preview}
              alt=""
              fill
              className="object-cover"
              sizes="96px"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-2 text-center text-[11px] text-[#a39486]">
              No image
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={(event) => void handleFile(event.target.files?.[0])}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={isLoading}
              onClick={() => inputRef.current?.click()}
              className="rounded-xl bg-[#2a1f16] px-3.5 py-2 text-xs font-medium text-white transition-colors hover:bg-[#3a2c20] disabled:opacity-60"
            >
              {isLoading
                ? "Uploading…"
                : value
                  ? "Replace image"
                  : "Upload image"}
            </button>
          </div>
          <p className="text-[11px] text-[#8a7a6c]">
            JPEG, PNG, WebP or GIF · max 8MB
          </p>
          {value ? (
            <p className="truncate text-[11px] text-[#a39486]" title={value}>
              {value}
            </p>
          ) : required ? (
            <p className="text-[11px] text-[#a35d5d]">Image is required</p>
          ) : null}
          {error ? (
            <p className="text-sm text-[#a35d5d]" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      </div>
      <input type="hidden" value={value} required={required} readOnly />
    </div>
  );
}
