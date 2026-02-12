/// @description Insert description here
// You can write your code in this editor

#macro BUFFER_U64_SIZE 8 //used to remove size prefix from content size calculations
#macro BUFFER_U8_SIZE 1

#macro OP_CLOSE 0	
#macro OP_HEARTBEAT 1
#macro OP_ECHO 50

#macro CLOSE_CODE_HEARTBEAT_FAILED 0
#macro CLOSE_CODE_UNKNOWN_OP_CODE 1

show_debug_message("wawa");
client = network_create_socket(network_socket_tcp);
clientSendBuffer = buffer_create(0, buffer_grow,1)
clientRecieveBuffer = buffer_create(0, buffer_grow, 1);
clientRecieveBufferSize = 0;
messagesToDraw = ds_list_create();
network_connect_raw_async(client, "127.0.0.1", 9472);

connectCooldown = current_time

function send_message(opCode, dataBuffer = undefined) {
	var contentSize;
	buffer_seek(clientSendBuffer, buffer_seek_start, 0)
	
	buffer_write(clientSendBuffer, buffer_u64, 0) //msg length prefix! pre-allocating the space for it this way
	buffer_write(clientSendBuffer, buffer_u8, opCode)
	if dataBuffer != undefined {
		var dataBufferSize = buffer_tell(dataBuffer)
		buffer_copy(dataBuffer, 0, dataBufferSize, clientSendBuffer, BUFFER_U64_SIZE + BUFFER_U8_SIZE)
		contentSize = BUFFER_U8_SIZE + dataBufferSize
	} else {
		contentSize = BUFFER_U8_SIZE
	}
	buffer_seek(clientSendBuffer, buffer_seek_start, 0)
	buffer_write(clientSendBuffer, buffer_u64, contentSize)
    var status = network_send_raw(client, clientSendBuffer, contentSize + BUFFER_U64_SIZE);
	show_debug_message(status);
}