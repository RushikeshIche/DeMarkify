"use client";
import { useState } from "react";
import { uploadToPinata } from "../../lib/ipfs";

export default function Create() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    imageFile: null,
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [ipfsUrl, setIpfsUrl] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.imageFile) {
      alert("Please upload an image.");
      return;
    }

    setLoading(true);
    try {
      const tokenURI = await uploadToPinata(form.name, form.description, form.imageFile);
      setIpfsUrl(tokenURI);
      alert("Uploaded to IPFS!");
    } catch (err) {
      alert("Upload failed. Check console for details.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    setForm({ ...form, imageFile: file });
    setPreviewUrl(URL.createObjectURL(file));
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create NFT Metadata</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 border rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <textarea
          placeholder="Description"
          className="w-full p-2 border rounded"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          type="file"
          accept="image/*"
          className="w-full p-2 border rounded"
          onChange={handleImageChange}
        />
        {previewUrl && (
          <img src={previewUrl} alt="Preview" className="w-full h-auto rounded shadow" />
        )}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload to IPFS"}
        </button>
      </form>

      {ipfsUrl && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold">IPFS Metadata URL:</h2>
          <a
            href={ipfsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 break-all"
          >
            {ipfsUrl}
          </a>
        </div>
      )}
    </div>
  );
}
