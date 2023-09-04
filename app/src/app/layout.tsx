"use client";

import "~/styles/globals.css";
import Header from "./Header";
import Footer from "./Footer";

import { Rserve } from "@tmelliott/react-rserve";

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head></head>
      <body>
        <Rserve
          {...{
            host: process.env.NEXT_PUBLIC_R_HOST || "ws://localhost:8111",
          }}
        >
          <div className="App flex min-h-screen flex-col justify-center gap-1">
            <Header />

            <div className="flex-1 bg-gradient-to-br from-gray-50 to-green-50 p-4">
              {children}
            </div>

            <Footer />
          </div>
        </Rserve>
      </body>
    </html>
  );
}
