/// @description Insert description here
// You can write your code in this editor
if current_time > connectCooldown {
	connectCooldown = current_time + 1000
	network_connect_raw_async(client, "127.0.0.1", 9472);
}