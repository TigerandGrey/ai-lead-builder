import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Outreach Generator",
  description: "Generate personalized outreach messages",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
          <div className="w-full">{children}</div>
          <Toaster />
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
