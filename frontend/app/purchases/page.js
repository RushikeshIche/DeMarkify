"use client";
import { useEffect, useState } from "react";
import { getMarketplaceContract } from "../../lib/contract";
import { ethers } from "ethers";

export default function Purchases() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function loadPurchases() {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        const contract = getMarketplaceContract(provider);
        const itemCount = await contract.itemCount();
        const purchased = [];

        for (let i = 1; i <= itemCount; i++) {
          const item = await contract.items(i);
          if (item.buyer === address) {
            const uri = await contract.tokenURI(item.tokenId);
            const res = await fetch(uri);
            const metadata = await res.json();

            purchased.push({
              image: metadata.image,
              name: metadata.name,
              description: metadata.description,
            });
          }
        }
        setItems(purchased);
      }
    }
    loadPurchases();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Purchases</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((item, idx) => (
          <div key={idx} className="bg-white rounded shadow p-4">
            <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded" />
            <p className="mt-2 font-semibold">{item.name}</p>
            <p className="text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
