const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory store (simulates Azure Blob Storage)
const store = {};

app.get('/', (req, res) => {
  res.json({ status: 'Backend is running!' });
});

// Simulate upload
app.post('/upload', (req, res) => {
  const content = req.body.text || 'Hello!';
  store['hello.txt'] = content;
  res.json({ message: 'Uploaded successfully!', content });
});

// Simulate read
app.get('/read', (req, res) => {
  const content = store['hello.txt'];
  if (!content)
    return res.status(404).json({ error: 'No file found. Upload first.' });
  res.json({ content });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
