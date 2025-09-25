// pages/api/detect.ts
import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false, // important for file uploads
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const form = formidable({ multiples: false });
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Upload error" });

    const file = files.file as formidable.File;
    const imgBuffer = fs.readFileSync(file.filepath);

    // Send `imgBuffer` to your Python microservice or inference API
    // Example (pseudo):
    // const result = await fetch("http://localhost:8000/predict", { method: "POST", body: imgBuffer });
    // const data = await result.json();

    res.status(200).json({ count: 42 }); // mock response for now
  });
}
