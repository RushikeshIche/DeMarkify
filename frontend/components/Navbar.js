"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ethers } from "ethers";

export default function Navbar() {
  const [account, setAccount] = useState(null);

  async function connectWallet() {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);
    }
  }

  useEffect(() => {
    connectWallet();
  }, []);

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
      <div className="flex gap-6">
        <Link href="/">Home</Link>
        <Link href="/create">Create</Link>
        <Link href="/purchases">My Purchases</Link>
        <Link href="/listings">My Listings</Link>
      </div>
      <button
        onClick={connectWallet}
        className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
      >
        {account ? `Connected: ${account.slice(0, 6)}...` : "Connect Wallet"}
      </button>
    </nav>
  );
}
