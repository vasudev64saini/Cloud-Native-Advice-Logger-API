const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Sequelize, DataTypes } = require('sequelize');
const axios = require('axios');

const app = express();
app.use(express.json());

const JWT_SECRET = 'my_super_secret_key_123'; // In a real app, this goes in a .env file

// ==========================================
// 1. DATABASE SETUP (SQLite)
// ==========================================
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite', // Creates a local file for the DB automatically
    logging: false
});

const User = sequelize.define('User', {
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false }
});

const AdviceLog = sequelize.define('AdviceLog', {
    adviceText: { type: DataTypes.STRING, allowNull: false },
    notes: { type: DataTypes.STRING, allowNull: true }
});

// Relationships
User.hasMany(AdviceLog);
AdviceLog.belongsTo(User);

// Sync Database
sequelize.sync().then(() => console.log('SQLite Database Connected & Synced.'));

// ==========================================
// 2. AUTHENTICATION MIDDLEWARE
// ==========================================
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Access Denied: No Token Provided!' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid Token!' });
        req.user = user;
        next();
    });
};

// ==========================================
// 3. ROUTES (Auth)
// ==========================================
app.post('/api/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = await User.create({ username: req.body.username, password: hashedPassword });
        res.status(201).json({ message: 'User registered successfully!', userId: user.id });
    } catch (error) {
        res.status(400).json({ error: 'Username might already exist.' });
    }
});

app.post('/api/login', async (req, res) => {
    const user = await User.findOne({ where: { username: req.body.username } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Incorrect password' });

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
});

// ==========================================
// 4. ROUTES (CRUD & External API)
// ==========================================

// CREATE: Generate a random advice from external API and save it to the DB
app.post('/api/advice', authenticateToken, async (req, res) => {
    try {
        // Calling the free external API
        const apiResponse = await axios.get('https://api.adviceslip.com/advice');
        const randomAdvice = apiResponse.data.slip.advice;

        const newLog = await AdviceLog.create({
            adviceText: randomAdvice,
            notes: req.body.notes || 'No notes added.',
            UserId: req.user.id
        });

        res.status(201).json({ message: 'Advice saved!', data: newLog });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch or save advice.' });
    }
});

// READ: Get all advice logs for the logged-in user
app.get('/api/advice', authenticateToken, async (req, res) => {
    const logs = await AdviceLog.findAll({ where: { UserId: req.user.id } });
    res.json({ data: logs });
});

// DELETE: Remove an advice log
app.delete('/api/advice/:id', authenticateToken, async (req, res) => {
    const deleted = await AdviceLog.destroy({ where: { id: req.params.id, UserId: req.user.id } });
    if (!deleted) return res.status(404).json({ error: 'Log not found or unauthorized' });
    res.json({ message: 'Advice log deleted successfully.' });
});

// ==========================================
// 5. START SERVER
// ==========================================
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});