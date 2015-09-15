//LOAD MODULES 
var express = require('express'), //express in node_modules
	routes = require(process.cwd() + '/routes'), //routes in main/routes
	path = require('path'), //node module -- path
	socket = require(process.cwd() + '/libs/socket.js');

var app = express();

var session = require('express-session');
var bodyParser = require('body-parser');

module.exports = function (app, express) {
	var config = this; //equal config with module
	app.set('port', process.env.PORT || 8880); //port define 
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.enable('view cache');
	app.use(session({
		resave: true,
		saveUninitialized: true,
		cookie: {
			expires: new Date(Date.now() + 600000), //add ten minutes by a post
			maxAge: 1200000 //max time for expire
		}, //time expires cookies / one minutes = 60000  / ten minutes = 600000
		secret: 'uwotm8'
	}));
	app.use(express.static(path.join(__dirname, '../../client')));

	app.post('/login', function (req, res) {
		routes(req, res);
	});

	app.post('/get', function (req, res) {
		routes(req, res);
	});

	app.post('/*', function (req, res) {
		if (req.session.isAuthenticate) {
			req.session._garbage = Date();
			req.session.touch();
			routes(req, res);
		} else {
			res.status(505).end();
			socket.time_out();
		}
	});
	
	return config;
}
