var pg = require('pg'), //framework for postgres data base
	Base = require(process.cwd() + '/config/default_config'), //load default configuration
	conString = "postgres://" + Base.user + ":" + Base.pass + "@" + Base.host + ":" + Base.port + "/" + Base.bd, //string connection define
	socket = require('./socket.js'); //socket functions

//HANDLER CONNECTION 
exports.Connect = function Connect(fn) {
	var client = new pg.Client(conString); //client is equal to new postgres connection
	client.connect(); //open handler
	fn(client); //return opened handler   
}

//RETURN OPENED HANDLER
exports.Handler = function Handler(fn) {
	socket.gethandler(function (result) //get opened handler
		{
			fn(result); //return handler
		});
}

//HANDLER CLOSE
exports.Disconect = function Disconect(handler) {
	handler.end(); //close
}
