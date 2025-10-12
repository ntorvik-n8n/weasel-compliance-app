import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FileManagerProvider } from "@/contexts/FileManagerContext";
import { UploadProgressProvider } from "@/contexts/UploadProgressContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bill Collector AI",
  description: "AI-powered compliance monitoring for debt collection calls",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <FileManagerProvider>
          <UploadProgressProvider>
            {children}
          </UploadProgressProvider>
        </FileManagerProvider>
      </body>
    </html>
  );
}
