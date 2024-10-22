import localFont from "next/font/local";
import "./globals.css";
import { GlobalStateProvider } from "@/GlobalStateContext";


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

export const metadata = {
  title: "5th Grade Spelling",
  description: "Practice your weekly spelling words",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <GlobalStateProvider>{children}</GlobalStateProvider>
      </body>
    </html>
  );
}
