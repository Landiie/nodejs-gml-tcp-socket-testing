/// @description Insert description here
// You can write your code in this editor
show_debug_message("wawa");
client = network_create_socket(network_socket_tcp);
network_connect_raw_async(client, "127.0.0.1", 9472);