import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SYSTEM ATLAS — 交互式工程系统框图",
  description: "六套原创 SVG 工程系统框图，点击功能模块即可查看对应的 TI 公开产品与官方资料。",
  icons: { icon: "./favicon.svg", shortcut: "./favicon.svg" },
  openGraph: {
    title: "SYSTEM ATLAS — 交互式工程系统框图",
    description: "原创 SVG 系统架构、可点击产品映射与 TI 官方资料入口。",
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
