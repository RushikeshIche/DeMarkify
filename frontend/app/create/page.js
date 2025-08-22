"use client";
import axios from "axios";
import { useState, useRef } from "react";
import { ethers } from "ethers";
import { getNFTContract, getMarketplaceContract } from "@/lib/contract";
import { toast } from "react-toastify";
export default function CreateNFT() {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [metadataUrl, setMetadataUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [minting, setMinting] = useState(false);
  const fileInputRef = useRef(null);

  // --- STEP 1: Upload Image ---
  const uploadImage = async () => {
    if (!(file instanceof File)) {
      toast.error("Please select a valid file");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setImageUrl(res.data.url);
    } catch (err) {
      console.error("Image upload failed:", err);
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  // --- STEP 2: Upload Metadata ---
  const uploadMetadata = async () => {
    if (!imageUrl || !name || !description || !price) {
      return toast.error("Fill all fields and upload image first");
    }

    try {
      const metadata = { name, description, image: imageUrl };
      const res = await fetch("/api/metadata", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(metadata),
      });

      const data = await res.json();
      setMetadataUrl(data.url);

      // Auto trigger mint after metadata is ready
      await mintAndList(data.url);
    } catch (err) {
      console.error("Metadata upload failed:", err);
      toast.error("Metadata upload failed");
    }
  };

  // --- STEP 3: Mint + List ---
  const mintAndList = async (tokenURI) => {
    try {
      setMinting(true);

      // Connect to wallet
      if (!window.ethereum) {
        toast.info("Please install MetaMask");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const nft = getNFTContract(signer);
      const marketplace = getMarketplaceContract(signer);

      // Mint NFT
      const mintTx = await nft.mint(tokenURI);
      const receipt = await mintTx.wait();

      // Extract tokenId from Transfer event
      const transferEvent = receipt.logs
        .map((log) => {
          try {
            return nft.interface.parseLog(log);
          } catch {
            return null;
          }
        })
        .find((e) => e && e.name === "Transfer");

      const tokenId = transferEvent?.args?.tokenId?.toString();
      if (!tokenId) throw new Error("TokenId not found in Transfer event");

      // Approve marketplace
      const approveTx = await nft.approve(marketplace.target, tokenId);
      await approveTx.wait();

      // Convert ETH price to wei
      const listingPrice = ethers.parseEther(price);

      // List NFT
      const listTx = await marketplace.makeItem(nft.target, tokenId, listingPrice);
      await listTx.wait();

      toast.success(`NFT #${tokenId} minted and listed successfully!`);

      // Reset form
      resetForm();
    } catch (err) {
      console.error("Minting/listing failed:", err);
      toast.error("Minting/listing failed, see console for details.");
    } finally {
      setMinting(false);
    }
  };

  // Reset all fields
  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setFile(null);
    setImageUrl("");
    setMetadataUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create & Mint NFT</h1>

      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => setFile(e.target.files?.[0])}
      />
      <button
        onClick={uploadImage}
        disabled={uploading}
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
      >
        {uploading ? "Uploading..." : "Upload Image"}
      </button>

      {imageUrl && (
        <img
          src={imageUrl}
          alt="Preview"
          className="mt-4 w-48 h-48 object-cover rounded"
        />
      )}

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mt-4 w-full p-2 border rounded"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="mt-2 w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Price in ETH"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="mt-2 w-full p-2 border rounded"
      />

      <button
        onClick={uploadMetadata}
        disabled={minting}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        {minting ? "Minting..." : "Upload Metadata & Mint"}
      </button>

      {metadataUrl && (
        <div className="mt-4">
          <p className="text-sm text-gray-600">Metadata URI:</p>
          <a
            href={metadataUrl}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 underline"
          >
            {metadataUrl}
          </a>
        </div>
      )}
    </div>
  );
}
