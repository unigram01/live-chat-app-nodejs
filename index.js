const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const path = require("path");
const { Server } = require("socket.io");
const io = new Server(server);
app.set("view engine", "ejs");
app.use(express.static("./public"));
app.get("/", (req, res) => {
  res.render("chat.ejs");
});
let usersInRoom = {};
io.on("connection", (socket) => {
  const newUser = socket.handshake.query.user;
  console.log("A new user is connected: ", newUser);
  usersInRoom[socket.id] = newUser;
  socket.emit("usersList", { room: usersInRoom });
  socket.broadcast.emit("new_user", { newUser: newUser, room: usersInRoom });
  socket.on("disconnect", () => {
    delete usersInRoom[socket.id];

    socket.broadcast.emit("user_left", {
      userLeft: socket.handshake.query.user,
      room: usersInRoom,
    });
  });
  socket.on("chat-message", (msg) => {
    socket.broadcast.emit("user-message", msg);
  });
});
server.listen(3000, () => {
  console.log("Listening on : http://localhost:3000");
});
