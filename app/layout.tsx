import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-heading" });

export const metadata: Metadata = {
  title: "Smart Study Assistant | Multi-Agent Learning",
  description: "A multi-agent AI system for intelligent learning & document analysis.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${space.variable} font-sans antialiased text-slate-100 bg-[#030712] flex h-screen overflow-hidden selection:bg-indigo-500/30 selection:text-indigo-200 relative`}
        suppressHydrationWarning
      >
        <div className="mesh-gradient pointer-events-none"></div>
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto z-10">
          {children}
        </main>
      </body>
    </html>
  );
}
