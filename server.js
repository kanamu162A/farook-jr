const express = require('express');
const cors = require('cors');
const path = require('path');
const transactionRoutes = require('./routes/transactionRoutes.js');

const app = express();
const port = 3355;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', transactionRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
  
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
