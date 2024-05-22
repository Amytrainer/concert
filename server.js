const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 5000;

// Set up body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Initialize SQLite database
const db = new sqlite3.Database('./contacts.db'); // Change to file-based database

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        message TEXT
    )`);
});

// Endpoint to handle form submission
app.post('/submit-form', (req, res) => {
    const { name, email, message } = req.body;
    const stmt = db.prepare("INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)");
    stmt.run(name, email, message, (err) => {
        if (err) {
            return res.status(500).send('Failed to save message');
        }
        res.status(200).send('Message received');
    });
    stmt.finalize();
});

// Endpoint to fetch all contacts (for testing purposes)
app.get('/contacts', (req, res) => {
    db.all("SELECT * FROM contacts", [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
