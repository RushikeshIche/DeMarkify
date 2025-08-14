"use client";
import { useEffect, useState } from "react";
import { getMarketplaceContract } from "../lib/contract";
import { ethers } from "ethers";

export default function Home() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function loadItems() {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = getMarketplaceContract(provider);
        const itemCount = await contract.itemCount();
        const loadedItems = [];

        for (let i = 1; i <= itemCount; i++) {
          const item = await contract.items(i);
          if (!item.sold) {
            const uri = await contract.tokenURI(item.tokenId);
            const res = await fetch(uri);
            const metadata = await res.json();

            loadedItems.push({
              id: i,
              price: ethers.formatEther(item.price),
              image: metadata.image,
              name: metadata.name,
              description: metadata.description,
            });
          }
        }
        setItems(loadedItems);
      }
    }
    loadItems();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Marketplace</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map((item, idx) => (
          <div key={idx} className="bg-white rounded shadow p-4">
            <img src={item.image} alt={item.name} className="w-full h-48 object-cover rounded" />
            <div className="mt-4">
              <p className="text-lg font-semibold">{item.name}</p>
              <p className="text-gray-600">{item.description}</p>
              <p className="text-gray-800 font-bold mt-2">{item.price} ETH</p>
              <button className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Buy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
