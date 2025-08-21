"use client";
import { useEffect, useState } from "react";
import { getMarketplaceContract, getNFTContract } from "../lib/contract";
import { ethers } from "ethers";
import { toast } from "react-toastify";
export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState(null);

  useEffect(() => {
    async function loadItems() {
      try {
        if (!window.ethereum) return;
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = getMarketplaceContract(provider);

        const itemCount = await contract.itemCount();
        const loaded = [];

        for (let i = 1; i <= itemCount; i++) {
          const item = await contract.items(i);
          if (!item.sold) {
            // fetch token metadata from NFT contract
            const nft = getNFTContract(provider);
            const uri = await nft.tokenURI(item.tokenId);
            const res = await fetch(uri);
            const metadata = await res.json();

            loaded.push({
              id: i,
              price: ethers.formatEther(item.price),
              totalPrice: ethers.formatEther(await contract.getTotalPrice(i)),
              image: metadata.image,
              name: metadata.name,
              description: metadata.description,
            });
          }
        }
        setItems(loaded);
      } catch (err) {
        console.error("Error loading items:", err);
      } finally {
        setLoading(false);
      }
    }
    loadItems();
  }, []);

  const buyItem = async (id, totalPrice) => {
  try {
    setBuyingId(id);
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = getMarketplaceContract(signer);

    const tx = await contract.purchaseItem(id, {
      value: ethers.parseEther(totalPrice),
    });
    await tx.wait();

    toast.success("✅ Purchase successful!");
    setItems((prev) => prev.filter((item) => item.id !== id));
  } catch (err) {
    if (err.code === 4001) {
      toast.info("❌ Transaction rejected in MetaMask.");
    } else {
      console.error("Purchase failed:", err);
      toast.error("⚠️ Transaction failed. Check console.");
    }
  } finally {
    setBuyingId(null);
  }
};


  if (loading) return <p className="p-6">Loading marketplace...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Marketplace</h1>
      {items.length === 0 ? (
        <p className="text-gray-600">No NFTs listed yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-4"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover rounded"
              />
              <div className="mt-4">
                <p className="text-lg font-semibold">{item.name}</p>
                <p className="text-gray-600 text-sm">{item.description}</p>
                <p className="text-gray-800 font-bold mt-2">
                  {item.totalPrice} ETH
                  <span className="text-xs text-gray-500 ml-1">(incl. fee)</span>
                </p>
                <button
                  onClick={() => buyItem(item.id, item.totalPrice)}
                  disabled={buyingId === item.id}
                  className="mt-3 w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {buyingId === item.id ? "Buying..." : "Buy"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
