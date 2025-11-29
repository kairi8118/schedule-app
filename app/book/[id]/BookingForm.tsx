// app/book/[id]/BookingForm.tsx
"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input"; // 入力欄
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { createBooking } from "@/app/actions"; // さっき作った保存機能

// 仮の時間枠
const timeSlots = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

export default function BookingForm({ eventType }: { eventType: any }) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full">

      {/* 1. カレンダー */}
      <div className="flex flex-col items-center">
        <h2 className="font-bold mb-4">① 日付を選ぶ</h2>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border shadow-sm bg-white"
        />
      </div>

      {/* 2. 時間選択 */}
      {date && (
        <div className="flex flex-col items-center animate-in fade-in slide-in-from-left-4">
          <h2 className="font-bold mb-4">
            ② 時間を選ぶ <span className="text-sm font-normal text-gray-500">({format(date, "M/d", { locale: ja })})</span>
          </h2>
          <div className="grid grid-cols-2 gap-2 h-64 overflow-y-auto pr-2">
            {timeSlots.map((time) => (
              <Button
                key={time}
                type="button"
                // ↓ここを修正：色を強制指定して見やすくしました
                className={selectedTime === time
                  ? "bg-black text-white hover:bg-gray-800 w-24"
                  : "bg-white text-black border border-gray-300 hover:bg-gray-100 w-24"
                }
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* 3. 最終入力フォーム */}
      {date && selectedTime && (
        <div className="flex flex-col flex-1 animate-in fade-in zoom-in max-w-sm">
          <Card className="bg-slate-50 border-blue-200 shadow-md">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4 text-center">最終確認</h3>

              {/* アクションを呼び出すフォーム */}
              <form action={createBooking} className="flex flex-col gap-4">

                {/* 隠しデータ（ユーザーには見せないがサーバーに送る） */}
                <input type="hidden" name="eventTypeId" value={eventType.id} />
                <input type="hidden" name="userId" value={eventType.userId} />
                <input type="hidden" name="date" value={format(date, "yyyy-MM-dd")} />
                <input type="hidden" name="time" value={selectedTime} />

                {/* 選択した日時の表示 */}
                <div className="bg-white p-3 rounded border text-center mb-2">
                  <p className="text-sm text-gray-500">{format(date, "yyyy年M月d日 (E)", { locale: ja })}</p>
                  <p className="text-2xl font-bold text-blue-600">{selectedTime}〜</p>
                </div>

                <div className="grid gap-2">
                  <Label>お名前</Label>
                  <Input name="name" placeholder="山田 太郎" required className="bg-white" />
                </div>

                <div className="grid gap-2">
                  <Label>メールアドレス</Label>
                  <Input name="email" type="email" placeholder="yamada@example.com" required className="bg-white" />
                </div>

                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-2">
                  予約を確定する
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
