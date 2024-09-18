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
      <html lang="en" className="bg-easyorder-gray">
          <head>
              <script
                  async
                  src="https://js.stripe.com/v3/pricing-table.js">
              </script>
          </head>
          <body className="antialiased">
          <NextUIProvider className="relative easyorder-container h-screen grid">
              <Navbar/>
              <div className="container flex flex-col">
                  {children}
              </div>
              <Footer/>
          </NextUIProvider>
          </body>
      </html>
  );
}
