"use client";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { getMarketplaceContract, getNFTContract } from "@/lib/contract";

export default function Listings() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function loadListings() {
      if (!window.ethereum) return;

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const marketplace = getMarketplaceContract(provider);
      const itemCount = await marketplace.itemCount();

      const listed = [];
      for (let i = 1; i <= itemCount; i++) {
        const item = await marketplace.items(i);

        if (item.seller.toLowerCase() === address.toLowerCase()) {
          try {
            // get metadata from NFT contract
            const nft = getNFTContract(provider);
            const uri = await nft.tokenURI(item.tokenId);

            const res = await fetch(uri);
            const metadata = await res.json();

            listed.push({
              id: item.itemId.toString(),
              image: metadata.image,
              name: metadata.name,
              description: metadata.description,
              price: ethers.formatEther(item.price),
              sold: item.sold,
            });
          } catch (err) {
            console.error("Metadata fetch failed:", err);
          }
        }
      }
      setItems(listed);
    }

    loadListings();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Listings</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.length > 0 ? (
          items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md p-4 border hover:shadow-lg transition"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="mt-4">
                <p className="text-lg font-semibold">{item.name}</p>
                <p className="text-gray-600 text-sm">{item.description}</p>
                <p className="text-gray-800 font-bold mt-2">
                  {item.price} ETH
                </p>
                {item.sold ? (
                  <span className="text-red-500 text-sm font-medium">
                    SOLD
                  </span>
                ) : (
                  <span className="text-green-600 text-sm font-medium">
                    Listed
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">You haven't listed any NFTs yet.</p>
        )}
      </div>
    </div>
  );
}
