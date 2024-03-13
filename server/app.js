import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './routes/index.js';
const app = express();
import { Server as socketIO } from 'socket.io';
const server = http.createServer(app);
export const io = new socketIO(server);
import http from 'http';

app.use(express.json());
app.use(cors({
  origin: ["http://localhost:3001"],
  methods: ["POST", "GET"],
  credentials: true
}));
app.use(cookieParser());

app.use(routes);

const PORT = process.env.PORT || 3003;
server.listen(PORT, () => {
  console.log("running..");
});
