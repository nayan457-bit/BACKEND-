const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const validUsername = "admin";
    const validPassword = "password123";

    if (username === validUsername && password === validPassword) {
        const token = jwt.sign(
            { username },
            'your_secret_key',
            { expiresIn: '10m' }
        );
        res.status(200).json({ message: "Login successful", token });
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
});
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Access token is missing" });
    }

    jwt.verify(token, 'your_secret_key', (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }
        req.user = user;
        next();
    });
}

app.get('/dashboard', authenticateToken, (req, res) => {
    res.status(200).json({ message: "Welcome to your dashboard" });
});