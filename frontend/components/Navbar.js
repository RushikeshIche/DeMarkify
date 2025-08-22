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
    // Force MetaMask to show the account selection popup
    // const accounts = await window.ethereum.request({
    //   method: "wallet_requestPermissions",
    //   params: [{ eth_accounts: {} }],
    // }).then(() =>
    //   window.ethereum.request({ method: "eth_requestAccounts" })
    // );
    
    // //Here not forcing to show but using autoconnect as metamask retrieves the accounts
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      setAccount(address);
      // console.log("Connected:", address);
    } catch (err) {
      // console.error("Wallet connection failed:", err);
    }
  }

  function disconnectWallet() {
    setAccount(null);
    console.log("Wallet disconnected");
  }

  // Listen for account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]); // update to the new account
        } else {
          setAccount(null); // no accounts => disconnected
        }
      });
    }
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

      <div className="flex gap-3">
        {!account ? (
          <button
            onClick={connectWallet}
            className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Connect Wallet
          </button>
        ) : (
          <>
            <span className="bg-gray-800 px-3 py-2 rounded-lg">
              {account.slice(0, 6)}...{account.slice(-4)}
            </span>
            <button
              onClick={disconnectWallet}
              className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Disconnect
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
