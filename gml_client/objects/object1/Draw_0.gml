/// @description Insert description here
// You can write your code in this editor
draw_text(0,0,"wawa");
var messagesToDrawSize = ds_list_size(messagesToDraw)
if messagesToDrawSize > 0 {
	var i = 0;
	repeat messagesToDrawSize {
		var drawX = messagesToDraw[|i][$"x"]
		var drawY = messagesToDraw[|i][$"y"]
		var drawText = messagesToDraw[|i].text
		draw_text(drawX, drawY, drawText)
		i++
	}
}
