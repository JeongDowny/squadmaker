import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Squadmaker",
    template: "%s | Squadmaker",
  },
  description:
    "축구 동호회 감독이 쿼터별 포메이션에 맞춘 선발 배치를 빠르게 추천받고 수정할 수 있도록 돕는 웹 서비스.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
