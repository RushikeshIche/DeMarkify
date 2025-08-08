"use client";
import { useState } from "react";
import { getMarketplaceContract } from "../../lib/contract";
import { ethers } from "ethers";

export default function Create() {
  const [form, setForm] = useState({ name: "", description: "", image: "", price: "" });

  async function handleSubmit(e) {
    e.preventDefault();

    // Upload metadata to IPFS (mocked here)
    const metadata = {
      name: form.name,
      description: form.description,
      image: form.image,
    };
    const uri = "https://ipfs.io/ipfs/your-metadata-hash"; // Replace with actual IPFS upload

    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getMarketplaceContract(signer);

      const price = ethers.parseEther(form.price);
      const tx = await contract.createItem(uri, price);
      await tx.wait();
      alert("NFT listed!");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Create & List NFT</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 border rounded"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <textarea
          placeholder="Description"
          className="w-full p-2 border rounded"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          type="text"
          placeholder="Image URL"
          className="w-full p-2 border rounded"
          onChange={(e) => setForm({ ...form, image: e.target.value })}
        />
        <input
          type="text"
          placeholder="Price in ETH"
          className="w-full p-2 border rounded"
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          List NFT
        </button>
      </form>
    </div>
  );
}
