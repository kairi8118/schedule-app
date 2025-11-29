// app/dashboard/new/page.tsx
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const prisma = new PrismaClient();

export default async function NewEventTypePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  // フォームが送信されたら動く関数（サーバーアクション）
  async function createEventType(formData: FormData) {
    "use server"; // ← これが魔法の言葉！サーバー側で動きます

    const title = formData.get("title") as string;
    const urlSlug = formData.get("slug") as string;
    const duration = parseInt(formData.get("duration") as string);

    // 自分のIDを取得（もう一度セッション確認）
    const session = await getServerSession(authOptions);
    if (!session || !session.user) return;

    // データベースに保存！
    await prisma.eventType.create({
      data: {
        userId: (session.user as any).id, // ← ここを書き換え！(.id の前に (session.user as any) をつける)
        title: title,
        slug: urlSlug,
        length: duration,
      },
    });

    redirect("/dashboard");
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle>新しい予約メニューを作成</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createEventType} className="flex flex-col gap-4">

            {/* タイトル入力 */}
            <div className="grid gap-2">
              <Label htmlFor="title">メニュー名</Label>
              <Input id="title" name="title" placeholder="例: 初回ヒアリング" required />
            </div>

            {/* URLスラッグ入力 */}
            <div className="grid gap-2">
              <Label htmlFor="slug">URLの末尾 (英数字)</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">/booking/</span>
                <Input id="slug" name="slug" placeholder="meeting-60" required />
              </div>
            </div>

            {/* 時間入力 */}
            <div className="grid gap-2">
              <Label htmlFor="duration">所要時間 (分)</Label>
              <Input id="duration" name="duration" type="number" defaultValue="60" required />
            </div>

            <Button type="submit" className="mt-4">作成する</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
