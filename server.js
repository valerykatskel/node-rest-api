require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');

// Connect to MongoDB
connectToDatabase(process.env.DB_CONNECT); 

// Create an express app
const app = express();

// Use middlewares
app.use(cors()); // Enable CORS
app.use(helmet()); // Add security headers
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: false })); // Parse application/x-www-form-urlencoded request bodies

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