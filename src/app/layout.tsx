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
            <NextUIProvider className="bg-easyorder-gray grid layout">
                <Navbar />
                <div className={'container'}>
                  {children}
                </div>
                <Footer />
            </NextUIProvider>
        </body>
    </html>
  );
}
