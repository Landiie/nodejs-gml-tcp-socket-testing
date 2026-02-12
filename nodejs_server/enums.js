/**
 * Operation codes for the tcp server and client
 * @readonly
 * @enum {number}
 */
export const OP_CODES = {
    CLOSE: 0,
    HEARTBEAT: 1,
    ECHO: 50
}

/**
 * Close codes to accompany the `OP_CODE.CLOSE` type.
 * @readonly
 * @enum {number}
 */
export const CLOSE_CODES = {
    HEARTBEAT_FAILED: 0,
    UNKNOWN_OP_CODE: 1,
}

/**
 * Packet header lengths and types.
 * @readonly
 * @enum {number}
 */
export const PCK_HD = { //packet header
    MSG_LENGTH: 8,
    OP_CODE: 1
}