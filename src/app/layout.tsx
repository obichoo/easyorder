import "./globals.css";
import Navbar from "@/app/components/navbar/page";
import Footer from "@/app/components/footer/page";
import {NextUIProvider} from "@nextui-org/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <body className="antialiased">
            <NextUIProvider className="relative easyorder-container h-screen grid">
                <Navbar />
                <div className="container flex flex-col bg-easyorder-gray">
                  {children}
                </div>
                <Footer />
            </NextUIProvider>
        </body>
    </html>
  );
}
