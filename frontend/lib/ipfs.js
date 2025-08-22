// ----------------------------
// |
// | This file was created for direct ipfs upload instead of pinata but the feature was not fully implemented 
// |
// ----------------------------

PINATA_JWT=process.env.PINATA_JWT
export async function uploadToPinata(name, description, imageFile) {
  const formData = new FormData();
  formData.append("file", imageFile);

  const imageRes = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`, // or use API key/secret via custom headers
    },
    body: formData,
  });

  const imageData = await imageRes.json();
  const imageUrl = `https://gateway.pinata.cloud/ipfs/${imageData.IpfsHash}`;

  const metadata = {
    name,
    description,
    image: imageUrl,
  };

  const metadataRes = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${PINATA_JWT}`,
    },
    body: JSON.stringify(metadata),
  });

  const metadataData = await metadataRes.json();
  return `https://gateway.pinata.cloud/ipfs/${metadataData.IpfsHash}`;
}
