// app/book/[id]/page.tsx
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import BookingForm from "./BookingForm"; // ← さっき作った部品を読み込む

const prisma = new PrismaClient();

export default async function BookingPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;

  const eventType = await prisma.eventType.findUnique({
    where: { id: id },
    include: { user: true }
  });

  if (!eventType) return notFound();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-4xl w-full shadow-lg flex flex-col md:flex-row overflow-hidden min-h-[500px]">

        {/* 左側：固定情報 */}
        <div className="w-full md:w-1/3 bg-gray-900 text-white p-8 flex flex-col justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium">{eventType.user.name}</p>
            <h1 className="text-3xl font-bold mt-2">{eventType.title}</h1>
            <div className="mt-6 flex items-center gap-2 text-gray-300">
              <span className="text-xl">⏱️</span>
              <span>{eventType.length} 分</span>
            </div>
            <p className="mt-4 text-gray-400 text-sm">{eventType.description}</p>
          </div>
        </div>

        {/* 右側：動くカレンダー部品 */}
        <div className="w-full md:w-2/3 p-8 bg-white flex justify-center">
          <BookingForm eventType={eventType} />
        </div>

      </Card>
    </div>
  );
}
