"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ethers } from "ethers";

export default function Navbar() {
  const [account, setAccount] = useState(null);

  async function connectWallet() {
    if (!window.ethereum) {
      alert("Please install MetaMask");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);

      // Listen for account change
      window.ethereum.on("accountsChanged", (accounts) => {
        setAccount(accounts.length > 0 ? accounts[0] : null);
      });
    } catch (err) {
      console.error("Wallet connection failed:", err);
    }
  }

  useEffect(() => {
    connectWallet();
  }, []);

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow">
      <div className="flex gap-6 font-medium">
        <Link href="/" className="hover:text-gray-300">
          Home
        </Link>
        <Link href="/create" className="hover:text-gray-300">
          Create
        </Link>
        <Link href="/purchases" className="hover:text-gray-300">
          My Purchases
        </Link>
        <Link href="/listings" className="hover:text-gray-300">
          My Listings
        </Link>
      </div>
      <button
        onClick={connectWallet}
        className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        {account
          ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}`
          : "Connect Wallet"}
      </button>
    </nav>
  );
}
