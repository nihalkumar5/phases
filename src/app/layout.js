import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import Cart from "@/components/Cart";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Phases Handcrafted",
  description: "Apple-level minimal design store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          {children}
          <Cart />
        </CartProvider>
      </body>
    </html>
  );
}
