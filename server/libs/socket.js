var pg = require('./PostgresConnect'),
	bd_struct = require('./bd_struct');

var handler = {};

// export function for listening to the socket
exports.m_scoket = function (socket) {
	pg.Connect(function (hand) { //create new handler connection
		socket.handler = hand; //save this handler for this socket
	});


	socket.on('get:handler', function () {
		return handler;
	});

	exports.time_out = function time_out(){
		socket.emit('time_out');
	}
	
	exports.gethandler = function gethandler(fn) {
		fn(socket.handler); //return open handler
	}
	

	socket.on('get:obj', function (str, fn) {
		obj = bd_struct.newobj(str);
		obj.get(function () {
			fn(obj);
		});
	});

	//when closed the socket
	socket.on('disconnect', function () {
		pg.Disconect(socket.handler); //close handler
	});
};
