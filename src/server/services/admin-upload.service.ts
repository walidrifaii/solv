import { getEnv } from "@/server/config/env";
import { ApiError, ok } from "@/server/utils/http";

type UploadApiResponse = {
  success?: boolean;
  path?: string;
  category?: string;
  error?: string;
};

function toPublicUrl(relativePath: string) {
  // Already a full URL — normalize singular /image/ → /images/
  if (/^https?:\/\//i.test(relativePath)) {
    return relativePath.replace(/\/solv\/image\//i, "/solv/images/");
  }

  const base = getEnv().UPLOAD_PUBLIC_BASE_URL.replace(/\/$/, "");
  let path = relativePath.replace(/^\//, "").replace(/\\/g, "/");

  // Upload API may return "image/…" but files are served under /solv/images/
  if (path.startsWith("image/")) {
    path = `images/${path.slice("image/".length)}`;
  } else if (!path.startsWith("images/")) {
    path = `images/${path}`;
  }

  return `${base}/${path}`;
}

export async function uploadImageToRemote(file: File) {
  const env = getEnv();

  if (!file.size) {
    throw new ApiError("Empty file", 400);
  }

  if (file.size > 8 * 1024 * 1024) {
    throw new ApiError("Image must be 8MB or smaller", 400);
  }

  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (file.type && !allowed.includes(file.type)) {
    throw new ApiError("Only JPEG, PNG, WebP, or GIF images are allowed", 400);
  }

  const form = new FormData();
  form.append("file", file, file.name || "upload.jpg");
  form.append("token", env.UPLOAD_API_TOKEN);

  let remote: UploadApiResponse;
  try {
    const response = await fetch(env.UPLOAD_API_URL, {
      method: "POST",
      body: form,
    });
    remote = (await response.json()) as UploadApiResponse;
    if (!response.ok || !remote.success || !remote.path) {
      throw new ApiError(
        remote.error || "Image upload failed",
        response.status >= 400 ? response.status : 502,
      );
    }
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("Could not reach image upload service", 502);
  }

  return ok({
    path: remote.path,
    url: toPublicUrl(remote.path),
    category: remote.category ?? "image",
  });
}
