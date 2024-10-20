import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import loginRoute from "./routes/login.js";
import regRoute from "./routes/register.js";
import { UserRouter } from "./routes/User.js";
import chatRouter from "./routes/chats.js";
import messageRouter from "./routes/messageRouter.js";
import { createServer as httpServer } from "node:http";
import { createServer as httpsServer } from "node:https";
import { Server } from "socket.io";
import { log } from "node:console";

dotenv.config();

const app = express();
let server;
if (process.env.ENVIRONMENT == "DEV") {
  server = httpServer(app);
} else {
  server = httpsServer(app);
}
// const server = createServer(app);

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
    transports: ["websocket", "polling"],
  },
  allowEIO3: true,
});

const port = process.env.PORT || 4000;
const MONGOURI = process.env.MONGOURI;
app.use(bodyParser.json({ limit: "10mb" }));
// app.use(express.json())

app.use(cors(corsOptions));

app.get("/", async (req, res) => {
  res.send("Hello World");
});

app.use("/login", loginRoute);
app.use("/register", regRoute);
app.use("/user", UserRouter);
app.use("/chat", chatRouter);
app.use("/message", messageRouter);

server.listen(port, () => {
  console.log("Server Started on port " + port);
});

io.on("connection", (socket) => {
  // console.log(' connected to socket.io');
  socket.on("setup", (userData) => {
    socket.join(userData._id); //rrom for that user only
    // console.log(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    // console.log("User Joined Room "+room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageReceived) => {
    // console.log("Hit socket");
    var chat = newMessageReceived.chat;
    if (!chat.users) return; // console.log("chat.users not defined")

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageReceived);
    });
  });

  socket.off("setup", () => {
    socket.leave(userData?._id);
  });
});

mongoose
  .connect(MONGOURI)
  .then(() => {
    console.log("Connected to MongoDb database");
  })
  .catch(() => {
    // console.log("Error Connecting to database");
  });
