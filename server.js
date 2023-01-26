require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');

// Connect to MongoDB
// const url = `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
// mongoose.connect(url, { useNewUrlParser: true });

// Create an express app
const app = express();

// Use middlewares
app.use(cors()); // Enable CORS
app.use(helmet()); // Add security headers
app.use(bodyParser.json()); // Parse JSON request bodies

// Define a secret key for JWT
const secretKey = process.env.SECRET_KEY;

const mainRoutes = require('./routes/main');
const versionRoutes = require('./routes/version');

app.get('/', mainRoutes);
app.use('/api/v1/', versionRoutes);

// app.post('/login', (req, res) => {
//     // Authenticate the user
//     // ...
//     // If authenticated, generate a JWT
//     const token = jwt.sign({ userId: user._id }, secretKey);
//     res.json({ token });
// });

// Protected route
// app.get('/users', (req, res) => {
//     // Verify the JWT
//     const token = req.headers['authorization'];
//     jwt.verify(token, secretKey, (err, decoded) => {
//         if (err) {
//             return res.status(401).json({ message: 'Unauthorized' });
//         }
//         // Find all users in the database
//         User.find({}, (err, users) => {
//             res.json(users);
//         });
//     });
// });

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
