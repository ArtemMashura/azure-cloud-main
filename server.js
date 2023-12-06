require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const corsSettings = require('./config/corsSettings');
const checkQueue = require('./controllers/queue/checkQueue');

const PORT = process.env.PORT || 3500;

app.use(cors(corsSettings));

app.use(express.json({limit: '50mb'}));

app.use('/categories', require('./routes/categories'));
app.use('/adminpanel', require('./routes/adminpanel'));
app.use('/goods', require('./routes/goods'));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    checkQueue.handleConstantlyCheckQueue()
})