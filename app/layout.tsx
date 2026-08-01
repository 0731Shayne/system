import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "交互式系统框图 — 空调室内机与咖啡机",
  description: "两套完整原创 SVG 工程框图，点击功能模块查看对应的 TI 公开产品。",
  icons: { icon: "./favicon.svg", shortcut: "./favicon.svg" },
  openGraph: {
    title: "交互式系统框图",
    description: "空调室内机与咖啡机完整工程架构及产品映射。",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
