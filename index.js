const express = require('express');
require('dotenv').config();

const uploadRoute = require('./routes/uploadRoute');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Hello! Your Express server is running 🚀'));
app.use('/', uploadRoute);

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
