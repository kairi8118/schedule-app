// app/success/page.tsx
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <span className="text-3xl">✅</span>
      </div>
      <h1 className="text-3xl font-bold mb-4">予約が完了しました！</h1>
      <p className="text-gray-600 mb-8">
        確認メールを送信しました（※まだ機能未実装）。<br />
        当日はお時間になりましたらZoom URLへアクセスしてください。
      </p>

      <Link href="/">
        <Button variant="outline">トップページに戻る</Button>
      </Link>
    </div>
  );
}
