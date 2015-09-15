//FILE ANGULAR CONFIG
'use strict';
//Load required modules and seter application name
angular.module('myApp', [ //application name
	'ngTouch', //enable Angular touch tools 
	'ngRoute', //use route tools
	'ngAnimate', //enable Angular animate tools
	'myApp.services-main', //load services.js file
	'myApp.services-menus', //load services.js file

	'myApp.controllers-main', //load controllers-main.js file
	'myApp.controllers-menus', //load controllers.js file
	'myApp.informes' //load informes.js file
]).
	//Config routes 
config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
	$routeProvider.when('/', { //conduct if url is /
		templateUrl: 'partials/body.html' //load body.html
	});
	$routeProvider.otherwise({
		redirectTo: '/'
	}); //if url not is / then redirect to /
	$locationProvider.html5Mode({
		enabled: true,
		requireBase: false
	});
}]);
