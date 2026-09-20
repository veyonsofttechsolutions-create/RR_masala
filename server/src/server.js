import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: env.clientUrl, credentials: true },
});
io.on("connection", (socket) => {
  socket.on("join:user", (id) => socket.join(`user:${id}`));
  socket.on("join:admin", () => socket.join("admins"));
});
app.set("io", io);
connectDB()
  .then(() =>
    server.listen(env.port, () => console.log(`API listening on ${env.port}`)),
  )
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
