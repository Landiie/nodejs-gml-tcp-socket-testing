import net from "net";
import { heartbeatStart, refreshAliveStatus } from "./heartbeat.js";
import { CLOSE_CODES, OP_CODES, PCK_HD } from "./enums.js";
const PORT = 9472;
const server = net.createServer();

/** @type {net.Socket} */
export let clientSocket = null;

server.on("connection", sock => {
  if (clientSocket !== null) {
    //no matter what, listen to errors. otherwise app crash. probably handle this differently so no duplicate code.
    sock.on("error", err => {
      clientSocket = null;
      console.log("invalid socket closed:", err.message);
      sock.destroy();
      sock.end();
    });

    sock.on("close", (hadError) => {
      console.log("Closed invalid socket. had error: " + hadError)
    })
    console.log("Client already connected.")
    //no message needed.
    sock.end()
    return
  }
  clientSocket = sock
  console.log("CONNECTED:", sock.remoteAddress + ":" + sock.remotePort);

  let buffer = Buffer.alloc(0);
  heartbeatStart()


  //for (let i = 0; i < 1000; i++) {
  //  sendMessage(sock, `WAAAAA, a response plus number: ${getRandomInt(1, 10000)}`)
  //}

  sock.on("data", chunk => {
    buffer = Buffer.concat([buffer, chunk]);

    // Handle all complete messages

    while (buffer.length >= PCK_HD.MSG_LENGTH) {
      const msgLength = Number(buffer.readBigUInt64LE(0));

      if (buffer.length < PCK_HD.MSG_LENGTH + msgLength) {
        break; // Wait for more data
      }

      const msgBuffer = buffer.slice(PCK_HD.MSG_LENGTH, PCK_HD.MSG_LENGTH + msgLength);
      processMessage(sock, msgBuffer)

      // Remove processed message from the buffer
      buffer = buffer.slice(PCK_HD.MSG_LENGTH + msgLength);

      //sock.write("WAAAAA")
      //sendMessage(sock, `WAAAAA, a response plus number: ${getRandomInt(1, 10000)}`)
    }
  });

  sock.on("end", () => {
    console.log("CONNECTION CLOSED:", sock.remoteAddress + ":" + sock.remotePort);
  });

  sock.on("error", err => {
    clientSocket = null;
    console.log("Error:", err.message);
    sock.destroy();
    sock.end();
  });

  sock.on("close", (hadError) => {
    console.log("Closed socket. had error: " + hadError)
  })
});

server.listen(PORT, () => {
  console.log("TCP Server is running on port", PORT);
});

export function sendMessage(socket, opCode, dataBuffer = null) {
  let packet = Buffer.alloc(8);
  let content = Buffer.alloc(1);
  content.writeUInt8(opCode, 0)
  if (dataBuffer !== null) {
    content = Buffer.concat([content, dataBuffer])
  }
  packet.writeBigUInt64LE(BigInt(content.length))
  packet = Buffer.concat([packet, content])
  socket.write(packet)
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * @description Processes a complete message from socket.
 * @param {net.Socket} socket Socket to optionally send a response to based on the provided op code in the msgBuffer
 * @param {Buffer} msgBuffer message buffer to process.
 */
function processMessage(socket, msgBuffer) {
  const opCode = msgBuffer.readUInt8(0)
  refreshAliveStatus();
  switch (opCode) {
    case OP_CODES.HEARTBEAT: {
      console.log("HEARTBEAT: badum.")
    } break;
    case OP_CODES.ECHO: {
      const textData = msgBuffer.toString('utf-8', 1)
      console.log("ECHO: " + textData)
    } break;
    default: {
      console.error("Unknown Op Code: " + opCode)
      closeClientSocket(CLOSE_CODES.UNKNOWN_OP_CODE)
    }
  }
}

/**
 * @description Closes the client socket with an error code. An error code is required to be communicated.
 * @param {number} closeCode use enum `CLOSE_CODES` to pick your close code.
 */
export function closeClientSocket(closeCode) {
  if (clientSocket !== null) {
    const buffer = Buffer.alloc(1)
    buffer.writeUint8(closeCode, 0)
    sendMessage(clientSocket, OP_CODES.CLOSE, buffer)
    clientSocket.destroy()
    clientSocket.end()
    clientSocket = null
  }
}