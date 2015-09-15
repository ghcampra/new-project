//Modulos que va a cargar para corroborar la existencia del archivo
var async = require('async'),
    fs = require('fs'),
    exec = require('child_process').exec;

//Comprueba si existe el archivo '/config/user_config.json'
if (!fs.existsSync(process.cwd() + '/config/user_config.json')) {
    //En caso que no exista crea el archivo copiando la configuracion de default_config
    async.parallel([
		async.apply(exec, "cp " + process.cwd() + '/config/default_config.json' + ' ' + process.cwd() + '/config/user_config.json')
	], function (err, results) {});
}

var express = require('express'), //Framework para utilizado para la configuración de server
    app = module.exports.app = express(),
    server = require('http').createServer(app), //Crea el servidor http útilizando express
    io = require('socket.io'), //Framework que escucha los sockets creados con los usuarios
    socket = require('./libs/socket.js').m_scoket, //Archivo de configuración del socket
    sockets = io.listen(server, {
        log: false
    }), //Vincula el socket con el servidor
    config = require('./config/config.js')(app, express); //Configura el servidor a partir del archivo de configuración

server.listen(app.get('port'), function () { //Lanza el servidor en el puerto definido anteriormente (config)
    console.log("Express server listening on port " + app.get('port'));
});

//Lanza la conexión de un nuevo socket por cada nuevo usuario (/libs/socket.js)
sockets.on('connection', socket);