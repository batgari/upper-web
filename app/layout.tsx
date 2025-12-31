import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./main/view/globals.css";
import Navbar from "./main/view/Navbar";
import { getEnvironmentName } from "./main/util/MainUtil";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const env = await getEnvironmentName();

  var title = "Upper - 의사 검색 서비스";
  if (env === "local")
    title = "[local] " + title;

  return {
    title,
    description: "지역별, 진료과별 의사 검색 및 상세 정보 제공 서비스",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
