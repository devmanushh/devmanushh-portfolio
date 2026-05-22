import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Devmanushh | Portfolio",
  description: "Software engineer, builder, and collector of extra activities.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
