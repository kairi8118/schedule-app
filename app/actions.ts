// app/actions.ts
"use server"; // ← サーバーでしか動かない安全なプログラム

import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export async function createBooking(formData: FormData) {
  // フォームから送られてきたデータを取り出す
  const eventTypeId = formData.get("eventTypeId") as string;
  const dateStr = formData.get("date") as string;
  const timeStr = formData.get("time") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;

  // 日時を合体させて、正式なDate型にする
  // 例: "2024-11-29" + " " + "10:00" = "2024-11-29 10:00"
  const startDateTime = new Date(`${dateStr} ${timeStr}`);

  // 終了時間を計算（とりあえず60分後に設定。本来はメニューの時間を使う）
  const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);

  // データベースに保存！
  await prisma.booking.create({
    data: {
      eventTypeId: eventTypeId,
      userId: formData.get("userId") as string, // 主催者のID
      attendeeName: name,
      attendeeEmail: email,
      startTime: startDateTime,
      endTime: endDateTime,
      status: "CONFIRMED",
    },
  });

  // 完了画面へ飛ばす
  redirect("/success");
}
