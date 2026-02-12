import { clientSocket, sendMessage, closeClientSocket } from "./server.js";
import { CLOSE_CODES, OP_CODES } from "./enums.js";

const INTERVAL = 2000

let timerId = null;
let isAlive = true;

/**
 * Starts the heartbeat.
 */
export function start() {
    stop();
    isAlive = true

    timerId = setInterval(() => {
        if (clientSocket === null) {
            stop()
            return
        }

        if (!isAlive) {
            console.error("Heartbeat failed to recieve in time from client. closing.")
            closeClientSocket(CLOSE_CODES.HEARTBEAT_FAILED)
            stop() //should already get called when the socket closes, but just doing this incase.
            return;
        }

        isAlive = false;
        sendMessage(clientSocket, OP_CODES.HEARTBEAT)
    }, INTERVAL);
}

/**
 * Starts the heartbeat.
 */
export function refreshAliveStatus() {
    stop();
    start();
}

export function stop() {
    if (timerId !== null) {
        clearInterval(timerId)
        timerId = null
    }
}