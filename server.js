const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // replace with your MySQL username
    password: 'ashwin', // replace with your MySQL password
    database: 'health_card_system'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database.');
});

app.post('/users', (req, res) => {
  const {id, name, plan, valid_date, toll_free_number} = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Please provide name, email, and age' });
  }

  const sql = 'INSERT INTO patients (id, name, plan, valid_date, toll_free_number) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [ id, name, plan, valid_date, toll_free_number], (err, result) => {
    if (err) {
      console.error('Insert error:', err);
      return res.status(500).json({ error: 'Database insert failed' });
    }
    res.json({ message: 'User added', userId: result.insertId });
  });
});

// API to get patient data by ID
app.get('/api/patient/:id', (req, res) => {
    const patientId = req.params.id;
    console.log(patientId);
    db.query('SELECT * FROM patients WHERE id = ?', [patientId], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        res.json(results[0]);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});