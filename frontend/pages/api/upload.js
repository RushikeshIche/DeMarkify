import multer from "multer";
import { pinata } from "@/utils/config";

export const config = {
  api: {
    bodyParser: false,
  },
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) return reject(result);
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    await runMiddleware(req, res, upload.single("file"));

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // ✅ Convert multer buffer → Blob
    const fileBlob = new Blob([req.file.buffer], { type: req.file.mimetype });

    // Upload to Pinata
    const { cid } = await pinata.upload.public.file(fileBlob, {
      metadata: { name: req.file.originalname },
    });

    const url = await pinata.gateways.public.convert(cid);

    return res.status(200).json({ url });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: "Upload failed" });
  }
}
