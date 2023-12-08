const event = require("./event");
const ChatController = require("../controllers/chat");
module.exports.listen = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: "*",
    },
  });

  console.log(`Socket is listening`);

  io.on(event.connection, (socket) => {
    console.log(socket.id);

    socket.on(event.joinRoom, async (roomId) => {
      if (roomId) await socket.join(roomId);
    });

    socket.on(event.sendMessage, async (roomId, message) => {
      if (roomId) {
        console.log(message);
        await ChatController.saveMessage(roomId, message);
        io.sockets.in(roomId).emit(event.receiveMessage, message);
        io.to(`${socket.id}`).emit(event.receiveNoti, "new_message");
      }
    });

    socket.on(event.disconnect, async (roomId) => {
      if (roomId) {
        await socket.leave(roomId);
      }
    });
  });
};
