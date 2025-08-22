import "./globals.css";
import Navbar from "../components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const metadata = {
  title: "NFT Marketplace",
  description: "Buy and sell NFTs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">
        <Navbar />
        <main className="p-6">{children}</main>
        <ToastContainer position="top-right" autoClose={4000} />
      </body>
    </html>
  );
}
