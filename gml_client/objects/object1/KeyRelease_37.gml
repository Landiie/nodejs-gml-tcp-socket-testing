/// @description Insert description here
// You can write your code in this editor
var data = "let go"
var echoBuffer = buffer_create(string_length(data),buffer_fixed,1)
buffer_write(echoBuffer, buffer_text, data)
send_message(OP_ECHO,echoBuffer)
buffer_delete(echoBuffer)