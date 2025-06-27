import { clientSocket, sendMessage, closeClientSocket } from "./server.js";
import { CLOSE_CODES, OP_CODES } from "./enums.js";

const INTERVAL = 2000

let timerId = null;
export let isAlive = true;


export function heartbeatStart() {
    heartbeatStop();
    isAlive = true

    timerId = setInterval(() => {
        if (clientSocket === null) {
            heartbeatStop()
            return
        }

        if (!isAlive) {
            console.error("Heartbeat failed to recieve in time from client. closing.")
            closeClientSocket(CLOSE_CODES.HEARTBEAT_FAILED)
            heartbeatStop() //should already get called when the socket closes, but just doing this incase.
            return;
        }

        isAlive = false;
        sendMessage(clientSocket, OP_CODES.HEARTBEAT)
    }, INTERVAL);
}

export function refreshAliveStatus() {
    heartbeatStop();
    heartbeatStart();
}

export function heartbeatStop() {
    if (timerId !== null) {
        clearInterval(timerId)
        timerId = null
    }
}