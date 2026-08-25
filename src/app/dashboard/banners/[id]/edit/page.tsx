import { BannerEditPage } from "@/features/dashboard/components/BannerEditPage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BannerEditPage bannerId={id} />;
}
