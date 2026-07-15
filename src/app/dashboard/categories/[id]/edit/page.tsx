import { CategoryEditPage } from "@/features/dashboard/components/CategoryEditPage";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;
  return <CategoryEditPage categoryId={id} />;
}
