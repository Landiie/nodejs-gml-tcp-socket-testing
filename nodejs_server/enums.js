export const OP_CODES = {
    CLOSE: 0,
    HEARTBEAT: 1,
    ECHO: 50
}

export const CLOSE_CODES = {
    HEARTBEAT_FAILED: 0,
    UNKNOWN_OP_CODE: 1,
}

export const PCK_HD = { //packet header
    MSG_LENGTH: 8,
    OP_CODE: 1
}

Object.freeze(OP_CODES)
Object.freeze(PCK_HD)