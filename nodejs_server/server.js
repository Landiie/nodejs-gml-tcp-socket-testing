import net from "net";
const server = net.createServer();
const PORT = 9472

server.on("connection", sock => {
  console.log("CONNECTED: " + sock.remoteAddress + ":" + sock.remotePort);

  sock.on("data", data => {
    console.log("DATA " + sock.remoteAddress + ": " + data);
    sock.write("Hello client from server");
  });

  sock.on("end", () => {
    console.log(
      "CONNECTION CLOSED: " + sock.remoteAddress + ":" + sock.remotePort
    );
  });

  sock.on("error", err => {
    console.log(`Error ${sock.remoteAddress}: ${err}`);
  });
});

server.listen(PORT, () => {
    console.log('TCP Server is running on port ' + PORT + '.');
});
