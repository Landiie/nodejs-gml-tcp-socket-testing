/// @description Insert description here
// You can write your code in this editor

#macro BUFFER_U64_SIZE 8 //used to remove size prefix from content size calculations

show_debug_message("wawa");
client = network_create_socket(network_socket_tcp);
clientSendBuffer = buffer_create(0, buffer_grow,1)
clientRecieveBuffer = buffer_create(0, buffer_grow, 1);
clientRecieveBufferSize = 0;
messagesToDraw = ds_list_create();
network_connect_raw_async(client, "127.0.0.1", 9472);

connectCooldown = current_time

function send_message(msg) {
	buffer_seek(clientSendBuffer, buffer_seek_start, 0)
	//msg length prefix!
	buffer_write(clientSendBuffer, buffer_u64, 0)
	buffer_write(clientSendBuffer, buffer_text, msg)
	var contentSize = buffer_tell(clientSendBuffer) - BUFFER_U64_SIZE
	buffer_seek(clientSendBuffer, buffer_seek_start, 0)
	buffer_write(clientSendBuffer, buffer_u64, contentSize)
    network_send_raw(client, clientSendBuffer, contentSize + BUFFER_U64_SIZE);
}