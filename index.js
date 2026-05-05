require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { BlobServiceClient } = require('@azure/storage-blob');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const CONN_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const CONTAINER = 'mycontainer';

app.get('/', (req, res) => {
  res.json({ status: 'Backend is running!' });
});

app.post('/upload', async (req, res) => {
  try {
    const client = BlobServiceClient.fromConnectionString(CONN_STRING);
    const container = client.getContainerClient(CONTAINER);
    await container.createIfNotExists();
    const blob = container.getBlockBlobClient('hello.txt');
    const content = req.body.text || 'Hello!';
    await blob.upload(content, Buffer.byteLength(content), { overwrite: true });
    res.json({ message: 'Uploaded successfully!', content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/read', async (req, res) => {
  try {
    const client = BlobServiceClient.fromConnectionString(CONN_STRING);
    const container = client.getContainerClient(CONTAINER);
    const blob = container.getBlockBlobClient('hello.txt');
    const download = await blob.download(0);
    const chunks = [];
    for await (const chunk of download.readableStreamBody) chunks.push(chunk);
    res.json({ content: Buffer.concat(chunks).toString() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
