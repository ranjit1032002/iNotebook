const connectToDB = require('./db');
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
connectToDB();

app.use(cors())
//Middleware
app.use(express.json());

// Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))


app.listen(port, () => {
  console.log(`http://localhost:${port}`);
})