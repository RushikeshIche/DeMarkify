import { pinata } from "@/utils/config";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const metadata = req.body;
    const blob = new Blob([JSON.stringify(metadata)], { type: "application/json" });
    const { cid } = await pinata.upload.public.file(blob);
    const url = await pinata.gateways.public.convert(cid);
    return res.status(200).json({ url });
  } catch (e) {
    console.error("Metadata upload error:", e);
    return res.status(500).json({ error: "Upload failed" });
  }
}
