// app/dashboard/page.tsx
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { format } from "date-fns";
import { ja } from "date-fns/locale";

const prisma = new PrismaClient();

export default async function Dashboard() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/");

  // 1. 自分の「予約メニュー」を取得
  const eventTypes = await prisma.eventType.findMany({
    where: { userId: (session.user as any).id }, // ← 書き換え
    orderBy: { id: 'desc' }
  });

  // 2. 自分宛の「入った予約」を取得
  const bookings = await prisma.booking.findMany({
    where: { userId: (session.user as any).id }, // ← 書き換え
    include: { eventType: true },
    orderBy: { startTime: 'asc' }
  });

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">ダッシュボード</h1>
          <p className="text-gray-500">ようこそ、{session.user.name} さん</p>
        </div>
        <Link href="/dashboard/new">
          <Button>＋ 新しいメニューを作る</Button>
        </Link>
      </div>

      {/* エリア1: 予約メニュー一覧 */}
      <h2 className="text-xl font-bold mb-4 border-l-4 border-black pl-3">あなたの予約受付ページ</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-12">
        {eventTypes.length === 0 ? (
          <p className="text-gray-500 col-span-3 py-4">まだメニューがありません。</p>
        ) : (
          eventTypes.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{item.length} <span className="text-sm font-normal text-gray-500">分</span></p>
                <p className="text-sm text-gray-400 mt-1">/{item.slug}</p>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Link href={`/book/${item.id}`} target="_blank">
                  <Button variant="outline" size="sm">プレビュー</Button>
                </Link>
                <Button variant="secondary" size="sm">URLコピー</Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      {/* エリア2: 入った予約一覧 (ここが新機能！) */}
      <h2 className="text-xl font-bold mb-4 border-l-4 border-blue-600 pl-3">入っている予定</h2>
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        {bookings.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            まだ予約が入っていません。<br/>
            プレビュー画面から自分でテスト予約してみましょう！
          </div>
        ) : (
          <div className="divide-y">
            {bookings.map((booking) => (
              <div key={booking.id} className="p-4 flex flex-col md:flex-row justify-between items-center hover:bg-gray-50">

                {/* 日時とメニュー名 */}
                <div className="flex gap-4 items-center mb-2 md:mb-0">
                  <div className="bg-blue-100 text-blue-700 px-3 py-2 rounded font-bold text-center min-w-[100px]">
                    {format(booking.startTime, "M/d (E)", { locale: ja })}
                    <br/>
                    {format(booking.startTime, "HH:mm")}
                  </div>
                  <div>
                    <p className="font-bold text-lg">{booking.attendeeName} 様</p>
                    <p className="text-sm text-gray-500">
                      {booking.eventType.title} ({booking.eventType.length}分)
                    </p>
                  </div>
                </div>

                {/* メールアドレスとステータス */}
                <div className="text-right">
                  <p className="text-sm text-gray-600">{booking.attendeeEmail}</p>
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-1">
                    予約確定
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
