"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Moon, Sun, Download, Share2, ArrowUpRight } from "lucide-react";
import html2canvas from "html2canvas";
import JsBarcode from "jsbarcode";

export default function GitHubReceipts() {
  const [username, setUsername] = useState("");
  const [receipt, setReceipt] = useState(null);
  const [isDark, setIsDark] = useState(false);
  const receiptRef = useRef<HTMLDivElement>(null);
  const barcodeRef = useRef<SVGSVGElement>(null);

  const generateReceipt = async () => {
    try {
      const userResponse = await fetch(
        `https://api.github.com/users/${username}`
      );
      const userData = await userResponse.json();

      const reposResponse = await fetch(
        `https://api.github.com/users/${username}/repos`
      );
      const reposData = await reposResponse.json();

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const dateString = thirtyDaysAgo.toISOString().split("T")[0];

      const commitsResponse = await fetch(
        `https://api.github.com/search/commits?q=author:${username}+committer-date:>=${dateString}`,
        {
          headers: {
            Accept: "application/vnd.github.v3+json",
          },
        }
      );
      const commitsData = await commitsResponse.json();

      const languages = reposData.reduce((acc: any, repo: any) => {
        if (repo.language) {
          acc[repo.language] = (acc[repo.language] || 0) + 1;
        }
        return acc;
      }, {});

      const topLanguages = Object.entries(languages)
        .sort(([, a]: any, [, b]: any) => b - a)
        .slice(0, 3)
        .map(([lang]) => lang)
        .join(", ");

      if (userResponse.ok) {
        const currentDate = new Date();
        const newReceipt = {
          ...userData,
          topLanguages,
          date: currentDate
            .toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })
            .toUpperCase(),
          time: currentDate.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          }),
          order: Math.floor(Math.random() * 90000) + 10000,
          authCode: Math.floor(Math.random() * 900000) + 100000,
          cardNumber:
            "**** **** **** " +
            Math.floor(Math.random() * 10000)
              .toString()
              .padStart(4, "0"),
          mostActiveDay: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ][Math.floor(Math.random() * 7)],
          commits30d: commitsData.total_count,
          starsEarned: reposData.reduce(
            (sum: number, repo: any) => sum + repo.stargazers_count,
            0
          ),
          repoForks: reposData.reduce(
            (sum: number, repo: any) => sum + repo.forks_count,
            0
          ),
          contributionScore:
            userData.public_repos +
            userData.public_gists +
            commitsData.total_count,
        };
        setReceipt(newReceipt);

        // Generate barcode after setting receipt
        setTimeout(() => {
          if (barcodeRef.current) {
            JsBarcode(barcodeRef.current, `https://github.com/${username}`, {
              format: "CODE128",
              width: 1,
              height: 30,
              displayValue: false,
            });
          }
        }, 0);
      }
    } catch (error) {
      console.error("Error fetching GitHub data:", error);
    }
  };

  const downloadReceipt = async () => {
    if (receiptRef.current) {
      const canvas = await html2canvas(receiptRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        logging: false,
        useCORS: true,
      });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `github-receipt-${username}.png`;
      link.click();
    }
  };

  const shareReceipt = async () => {
    if (receiptRef.current) {
      const canvas = await html2canvas(receiptRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
        logging: false,
        useCORS: true,
      });
      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            await navigator.share({
              files: [new File([blob], "receipt.png", { type: "image/png" })],
              title: "GitHub Receipt",
              text: "Check out my GitHub Receipt!",
            });
          } catch (error) {
            console.error("Error sharing:", error);
          }
        }
      });
    }
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className={`min-h-[calc(100svh-185px)] ${isDark ? "dark" : ""}`}>
      <div className="max-w-2xl mx-auto p-6 space-y-8">
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            <a
              href="https://github.com/VishwaGauravIn/github-receipts"
              target="_blank"
              rel="norefferer noopener"
              className="hover:underline"
            >
              GitHub Repo
              <ArrowUpRight className="size-3 inline" />
            </a>{" "}
            |{" "}
            <a
              href="https://buymeacoffee.com/vishwagauravin"
              target="_blank"
              rel="norefferer noopener"
              className="hover:underline"
            >
              buy me a coffee <ArrowUpRight className="size-3 inline" />
            </a>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDark ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">GitHub Receipt</h1>
          <p className="text-muted-foreground">
            Generate a receipt-style summary of your GitHub profile
          </p>
        </div>

        <div className="flex gap-2">
          <Input
            placeholder="Enter GitHub username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && generateReceipt()}
          />
          <Button onClick={generateReceipt}>Generate</Button>
        </div>

        {receipt && (
          <>
            <div
              ref={receiptRef}
              className="bg-white text-black p-8 rounded-lg shadow-lg font-mono relative overflow-hidden w-[350px] mx-auto"
              style={{
                backgroundImage: 'url("/paper-texture.png")',
                backgroundBlendMode: "multiply",
                backgroundSize: "cover",
              }}
            >
              {/* Top tear */}
              <div className="tear top-0"></div>

              <div className="space-y-6 pt-4">
                <div className="text-center">
                  <h2 className="text-xl font-bold">GITHUB RECEIPT</h2>
                  <p className="text-sm">{receipt.date}</p>
                  <p className="text-sm">ORDER #{receipt.order}</p>
                </div>

                <div className="space-y-1">
                  <p>CUSTOMER: {receipt.name}</p>
                  <p>@{receipt.login}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>REPOSITORIES</span>
                    <span>{receipt.public_repos}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>STARS EARNED</span>
                    <span>{receipt.starsEarned}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>REPO FORKS</span>
                    <span>{receipt.repoForks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>FOLLOWERS</span>
                    <span>{receipt.followers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>FOLLOWING</span>
                    <span>{receipt.following}</span>
                  </div>
                </div>

                <div className="space-y-1 border-t border-dashed pt-4">
                  <p>TOP LANGUAGES:</p>
                  <p>{receipt.topLanguages}</p>
                </div>

                <div className="space-y-1 border-t border-dashed pt-4">
                  <div className="flex justify-between">
                    <span>MOST ACTIVE DAY:</span>
                    <span>{receipt.mostActiveDay}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>COMMITS (30d):</span>
                    <span>{receipt.commits30d}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>CONTRIBUTION SCORE:</span>
                    <span>{receipt.contributionScore}</span>
                  </div>
                </div>

                <div className="text-center space-y-1 text-sm">
                  <p>Served by: Dennis Ritchie</p>
                  <p>{receipt.time}</p>
                </div>

                <div className="space-y-1 border-t border-dashed pt-4 text-center">
                  <p>COUPON CODE: DJMOU7</p>
                  <p className="text-sm">Save for your next commit!</p>
                </div>

                <div className="space-y-1 text-sm">
                  <p>CARD #: {receipt.cardNumber}</p>
                  <p>AUTH CODE: {receipt.authCode}</p>
                  <p>CARDHOLDER: {receipt.login.toUpperCase()}</p>
                </div>

                <div className="text-center pt-4">
                  <p>THANK YOU FOR CODING!</p>
                </div>

                <div className="pt-4 text-center flex flex-col justify-center items-center">
                  <svg ref={barcodeRef} className="w-full"></svg>
                  <p className="text-xs pt-1">github.com/{receipt.login}</p>
                </div>
              </div>

              {/* Bottom tear */}
              <div className="tear bottom-0"></div>
            </div>

            <div className="flex justify-center gap-4">
              <Button onClick={downloadReceipt} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button onClick={shareReceipt} variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
