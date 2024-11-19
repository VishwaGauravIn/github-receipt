import Footer from "@/components/Footer";
import GitHubReceipts from "@/components/GitHubReceipts";
import Script from "next/script";
import React from "react";

export default function Home() {
  return (
    <>
      {/* Google Analytics */}
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-LD1SQNQXB0"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-LD1SQNQXB0', { page_path: window.location.pathname });
            `,
        }}
      />
      <GitHubReceipts />
      <Footer />
    </>
  );
}
