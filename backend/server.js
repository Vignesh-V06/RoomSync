const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const routes = require('./routes');
app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('RoomSync API is running...');
});

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const socket = require('./socket');
socket.init(server);

server.listen(PORT, () => {
    console.log(`Server and Socket are running on port ${PORT}`);
});
