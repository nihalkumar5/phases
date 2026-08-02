import { Playfair_Display, Outfit, Space_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import Cart from "@/components/Cart";

const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-serif' });
const outfit = Outfit({ subsets: ["latin"], variable: '--font-sans' });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: '--font-mono' });

export const metadata = {
  title: "Phases Handcrafted",
  description: "Premium handcrafted candles and soft toys",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${playfair.variable} ${spaceMono.variable}`} suppressHydrationWarning>
        <CartProvider>
          {children}
          <Cart />
        </CartProvider>
      </body>
    </html>
  );
}
