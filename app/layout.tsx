import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Instagramアフィリエイト投稿メーカー",
  description: "野菜・料理系Instagram投稿の下書き作成ツール",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
