/// @description Insert description here
// You can write your code in this editor
var buffer = buffer_create(4096, buffer_grow,1)
buffer_write(buffer, buffer_string, "this is some data? " + string(random(1000)))
var bufferSize = buffer_get_size(buffer)
network_send_raw(client, buffer, bufferSize)
buffer_delete(buffer)