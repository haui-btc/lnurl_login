const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise');
const lnurl = require('lnurl');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Replace with your MySQL connection details <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'notes_db',
};

// Initialize the LNURL-auth server
const lnurlAuthServer = lnurl.createServer({
  // Your server's LNURL-auth endpoint <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  url: 'https://yourserver.com/lnurl-auth',
});

// LNURL-auth endpoint
app.get('/lnurl-auth', async (req, res) => {
  const authRequest = lnurlAuthServer.generateAuthRequest();
  res.json({ lnurl: lnurl.toUrl(authRequest) });
});

// Save note endpoint
app.post('/api/save-note', async (req, res) => {
  const { publicKey, note } = req.body;
  try {
    const connection = await mysql.createConnection(dbConfig);
    await connection.query(
      'INSERT INTO notes (public_key, note) VALUES (?, ?)',
      [publicKey, note]
    );
    res.status(201).json({ message: 'Note saved successfully.' });
  } catch (error) {
    console.error('Error saving note:', error);
    res.status(500).json({ message: 'Error saving note.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));


// Fetch notes endpoint
app.get('/api/fetch-notes', async (req, res) => {
    const publicKey = req.query.publicKey;
    try {
      const connection = await mysql.createConnection(dbConfig);
      const [notes] = await connection.query(
        'SELECT note, created_at FROM notes WHERE public_key = ? ORDER BY created_at DESC',
        [publicKey]
      );
      res.status(200).json(notes);
    } catch (error) {
      console.error('Error fetching notes:', error);
      res.status(500).json({ message: 'Error fetching notes.' });
    }
  });
  