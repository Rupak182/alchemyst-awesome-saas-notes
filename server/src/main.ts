import express, { Request, Response } from 'express';
import multer from 'multer';
import * as dotenv from 'dotenv';
import { generatePdfFromImage } from './util.js';
import cors from 'cors';
dotenv.config();


const app = express();
app.use(cors());

const port = process.env.PORT || 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/upload', upload.single('image'), async(req:Request, res:Response) => {
  // req.file.buffer contains the image data in memory
  if (!req.file) {
    res.status(400).send('No image uploaded');
    return;
  }

  const imageBuffer = req.file.buffer;
  const base64Image = imageBuffer.toString('base64'); 

  const pdf = await generatePdfFromImage(base64Image);
  if (pdf && pdf.content) {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="output.pdf"');
    res.send(pdf.content); 
  } else {
    res.status(500).send('Failed to generate PDF');
  }
  // res.send('Image received in memory without storing on disk');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});