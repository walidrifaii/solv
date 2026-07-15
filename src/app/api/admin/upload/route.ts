import { isAdmin } from "@/server/middleware/isAdmin";
import { uploadImageToRemote } from "@/server/services/admin-upload.service";
import { ApiError } from "@/server/utils/http";

export const POST = isAdmin(async (req) => {
  const form = await req.formData();
  const file = form.get("file");

  if (!(file instanceof File)) {
    throw new ApiError('Send image as multipart field "file"', 400);
  }

  return uploadImageToRemote(file);
});
