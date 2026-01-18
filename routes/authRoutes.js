const express = require('express');
const router = express.Router();
const db = require('../models/db');
const bcrypt = require('bcryptjs');

// --- Register page ---
router.get('/register', (req, res) => {
    res.render('register');
});

// --- Register user ---
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashed = await bcrypt.hash(password, 10);
        await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashed]);
        res.redirect('/login');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// --- Login page ---
router.get('/login', (req, res) => {
    res.render('login');
});

// --- Login user ---
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length === 0) return res.send('User not found');

        const user = rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.send('Wrong password');

        req.session.user = { id: user.id, username: user.username };
        res.redirect('/');
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// --- Logout ---
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
