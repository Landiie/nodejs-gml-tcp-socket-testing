import net from "net";

const PORT = 9472;
const server = net.createServer();

server.on("connection", sock => {
  console.log("CONNECTED:", sock.remoteAddress + ":" + sock.remotePort);

  let buffer = Buffer.alloc(0);

  //for (let i = 0; i < 1000; i++) {
  //  sendMessage(sock, `WAAAAA, a response plus number: ${getRandomInt(1, 10000)}`)
  //}

  sock.on("data", chunk => {
    buffer = Buffer.concat([buffer, chunk]);

    // Handle all complete messages

    while (buffer.length >= 8) {
      const msgLength = Number(buffer.readBigUInt64LE(0));

      if (buffer.length < 8 + msgLength) {
        break; // Wait for more data
      }

      const msg = buffer.slice(8, 8 + msgLength);
      console.log("Received:", msg.toString());

      // Remove processed message from the buffer
      buffer = buffer.slice(8 + msgLength);

      //sock.write("WAAAAA")
      sendMessage(sock, `WAAAAA, a response plus number: ${getRandomInt(1, 10000)}`)
    }
  });

  sock.on("end", () => {
    console.log("CONNECTION CLOSED:", sock.remoteAddress + ":" + sock.remotePort);
  });

  sock.on("error", err => {
    console.log("Error:", err.message);
  });
});

server.listen(PORT, () => {
  console.log("TCP Server is running on port", PORT);
});

function sendMessage(socket, msg) {
  const contentBuffer = Buffer.from(msg)
  let buffer = Buffer.alloc(8);
  buffer.writeBigUInt64LE(BigInt(contentBuffer.length))
  buffer = Buffer.concat([buffer, contentBuffer])
  socket.write(buffer)
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}