import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "GitHub Receipts",
  description:
    "Create a receipt-style GitHub summary! Showcase your repos, stars & contributions. Visualize your milestones uniquely. Celebrate your coding journey!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="title" content="GitHub Receipts" />
        <meta
          name="description"
          content="Create a receipt-style GitHub summary! Showcase your repos, stars & contributions. Visualize your milestones uniquely. Celebrate your coding journey!"
        />
        <meta name="copyright" content="VishwaGauravIn" />
        <meta
          name="keywords"
          content="github,github receipt,github profile,github widget,github summary"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="gitreceipt.itsvg.in" />
        <meta property="og:title" content="GitHub Receipts" />
        <meta
          property="og:description"
          content="Create a receipt-style GitHub summary! Showcase your repos, stars & contributions. Visualize your milestones uniquely. Celebrate your coding journey!"
        />
        <meta
          property="og:image"
          content="https://gitreceipt.itsvg.in/webimg.png"
        />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="gitreceipt.itsvg.in" />
        <meta property="twitter:title" content="GitHub Receipts" />
        <meta
          property="twitter:description"
          content="Create a receipt-style GitHub summary! Showcase your repos, stars & contributions. Visualize your milestones uniquely. Celebrate your coding journey!"
        />
        <meta
          property="twitter:image"
          content="https://gitreceipt.itsvg.in/webimg.png"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
