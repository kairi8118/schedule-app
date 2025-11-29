"use client"; // ← これ重要！ボタンを動かすために必要

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react"; // Googleログイン機能

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-4">
      <h1 className="text-4xl font-bold">日程調整ツール</h1>
      <p className="text-xl text-gray-500">開発中...</p>

      <div className="flex gap-4">
        {/* ボタンに onClick イベントを追加 */}
        <Button onClick={() => signIn("google")}>
          Googleでログイン
        </Button>
      </div>
    </main>
  );
}
