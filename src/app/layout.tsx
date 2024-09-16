import "./globals.css";
import Navbar from "@/app/components/navbar/page";
import Footer from "@/app/components/footer/page";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-easyorder-gray grid layout">
        <Navbar />
        <div className={'container'}>
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
