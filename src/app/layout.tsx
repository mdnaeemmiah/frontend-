import type { Metadata } from "next";
import "./globals.css";
import SplashLoader from "../components/SplashLoader";

export const metadata: Metadata = {
  title: "NovaHealth - Find Your Perfect Doctor",
  description: "Connect with healthcare providers who match your needs and preferences",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SplashLoader>
          {children}
        </SplashLoader>
      </body>
    </html>
  );
}
