require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');

// Connect to MongoDB
//const url = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}`
const url = 'mongodb://tdm-admin:lss9SpRITieSUIeOVltI@cluster0.0fua7.mongodb.net/cltickdata'
mongoose.set('strictQuery', false);
//mongoose.connect(url, { useNewUrlParser: true });
mongoose.connect(
    url,
    { useNewUrlParser: true, useUnifiedTopology: true},
    (er) => {
        if (er) {
            console.log(`Error during connect to MongoDB: ${er}`)
        } else {
            console.log(`Connected to MongoDB successfully!`);
        }
    }
  );
// Create an express app
const app = express();

// Use middlewares
app.use(cors()); // Enable CORS
app.use(helmet()); // Add security headers
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: false })); // Parse application/x-www-form-urlencoded request bodies

// Define a secret key for JWT
const secretKey = process.env.SECRET_KEY;

const mainRoutes = require('./routes/main');
const versionRoutes = require('./routes/api/v1/version');
const authRoutes = require('./routes/api/v1/auth');

app.use('/api/v1/', authRoutes);
app.get('/', mainRoutes);
app.use('/api/v1/', versionRoutes);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});