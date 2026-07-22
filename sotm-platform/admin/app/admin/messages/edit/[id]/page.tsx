import { EditMessageForm } from "@/components/admin/edit-form";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      <EditMessageForm messageId={id} />
    </div>
  );
}
