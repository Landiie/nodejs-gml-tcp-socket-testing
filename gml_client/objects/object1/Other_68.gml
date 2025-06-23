/// @description Insert description here
// You can write your code in this editor

switch(async_load[?"type"]) {
	case network_type_data: {
		scr_process_chunk(async_load[?"buffer"], async_load[?"size"])
		//show_debug_message(buffer_read(async_load[?"buffer"], buffer_text))
		break;
	}
}

function scr_process_chunk(chunk, chunkSize) { //the chunk buffer passed in here automatically clears, no need to destroy it
	var combinedBufferSize = clientRecieveBufferSize + chunkSize //we already know the expected size, no extra computations
	var combinedBuffer = buffer_create(combinedBufferSize, buffer_grow, 1)
	var combinedBufferOffset = 0;
	
	// Copy old buffer content into combined buffer
	if clientRecieveBufferSize > 0 {
		buffer_copy(clientRecieveBuffer, 0, clientRecieveBufferSize, combinedBuffer, combinedBufferOffset);
		combinedBufferOffset = buffer_tell(clientRecieveBuffer)
	}
	
	// copy incoming chunk content into combined buffer
	buffer_copy(chunk, 0, chunkSize, combinedBuffer, combinedBufferOffset)
	
	
	buffer_delete(clientRecieveBuffer) //discard old buffer
	clientRecieveBuffer = combinedBuffer
	clientRecieveBufferSize = combinedBufferSize
	
	while clientRecieveBufferSize >= 8 {
		buffer_seek(clientRecieveBuffer, buffer_seek_start, 0)
		var msgLength = buffer_read(clientRecieveBuffer, buffer_u64)
		
		if clientRecieveBufferSize < 8 + msgLength {
			break; //wait for more data, unfinished
		}
		//at this point, there should be at least one fully formed message in the recieve buffer.
		//take a message, send it to evaluation, and remove it from recieve buffer when finished.
		var msg = buffer_create(msgLength, buffer_fixed, 1)
		var i = 0;
		repeat msgLength {
			buffer_write(msg, buffer_u8, buffer_peek(clientRecieveBuffer, 8 + i, buffer_u8))
			i++;
		}
		
		scr_process_message(msg)
		buffer_delete(msg)
		msg = -1
		
		var clientRecieveBufferWithoutMsg = buffer_create(clientRecieveBufferSize - (8 + msgLength), buffer_grow, 1)
		buffer_copy(clientRecieveBuffer, 8 + msgLength, clientRecieveBufferSize - (8 + msgLength), clientRecieveBufferWithoutMsg, 0)
		
		buffer_delete(clientRecieveBuffer) //discard old buffer
		clientRecieveBuffer = clientRecieveBufferWithoutMsg
		clientRecieveBufferSize = clientRecieveBufferSize - (8 + msgLength)
	}
}

//does not delete the msgBuffer, thats handled in the async network event.
function scr_process_message(msgBuffer) {
	buffer_seek(msgBuffer, buffer_seek_start, 0)
	//show_debug_message(buffer_read(msgBuffer, buffer_text))
	ds_list_add(messagesToDraw, {x: random(1366), y: random(768), text: buffer_read(msgBuffer, buffer_text)})
	
}