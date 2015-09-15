//CONTROLLER FILE
'use strict';

var host = 'http://' + location.host, //host url
	data = {},
	socket = io.connect(), //connect io socket for user control and db conect
	table_limit = 10,
	abreviatura;

var Table_Active = function () {
	this.table = '';
};

Table_Active.prototype = {
	setStrategy: function (table) {
		$('.header_table').empty();

		this.table = table;
		this.table.offset = 0; //offset, utilizado para las tablas
		this.table.where = undefined;
		abreviatura = this.table.abreaviatura;
	},
	load: function (callback) {
		if (window.matchMedia('(max-height: 500px)').matches) {
			table_limit = 5;
		} else {
			table_limit = 10;
		}

		this.table.where = (this.table.where !== undefined ? this.table.where.replace(/\'/g, "''") : undefined);
		return this.table.load(callback);
	},
	get: function () {
		return this.table;
	},
	save: function (callback) {
		var _this = this;
		console.log($('.id').text().length);
		if($('.id').text().length == 0){
			$('.id').text('0');
		}
		return this.table.save(function (result) {
			if (result == true) {
				swal({
						title: 'Operación realizada con exito',
						text: 'Se realizo el registro de manera correcta',
						timer: 2000,
						type: 'success'
					},
					function () {
						_this.table.reset();
					});
			} else {
				swal({
					title: 'Error',
					text: 'Ocurrio un error al tratar de guardar, por favor verifique',
					timer: 2000,
					type: 'error'
				});
			}
		});
	},
	table_click: function (id) {
		$('.div_table').toggleClass('hide');
		$('.div_datos').toggleClass('hide');
		$('.div_datos input').eq(0).focus();
		return this.table.table_click(id);
	},
	reset: function () {
		return this.table.reset();
	}
};

var Table_active = new Table_Active();


angular.module('myApp.controllers-main', [])
	/////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////   GENERAL /////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////
	//Parametros
	//	$scope:	es un vinculo con el html, proporcionado por Angular
	//	$http:	es la forma de realizar request por parte de Ajax  
	.controller('MainCtrl', ['$scope', '$http', function ($scope, $http) {
		//Defino cual va a ser la página activa en una primera instancia 
		$scope.pages = [{
			name: 'page.html',
			url: 'partials/pages/login.html'
		}];
		//Los request tienen que estar definidos en routes.json (server/routes)
		$http({
			method: 'POST', //Verbo js
			data: JSON.stringify(data), //datos que se envian al servidor
			contentType: 'application/json',
			url: host + '/get' //nombre de request
				//Si la request se realizo de forma exitosa
		}).success(function (data) {
			//Controla si el proceso realizado en el servidor fue exitoso
			if (data.result == true) {
				//carga la url del html
				$scope.pages[0].url = data.url;
				//Setea el menu activo
				$scope.menus = data.menus;
			}
		}).error(function (data, status, headers, config) {});
		$scope.page = $scope.pages[0];
}])
	/////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////// LOGIN ////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////
	//Parametros
	//	$scope:	es un vinculo con el html, proporcionado por Angular
	//	$http:	es la forma de realizar request por parte de Ajax  
	.controller('LoginCtrl', ['$scope', '$http', function ($scope, $http) {
		//CONTROLADORA DEL LOGIN
		//Crea una función login bindeada con scope - Parametros: Codigo ascii de la tecla precionada
		$scope.login = function (e) {
			//Si la tecla precionada es enter
			if (e == 13) {
				if ($scope.user !== undefined && $scope.password !== undefined) {
					//Seteo el objeto json con los valores ingresados por el usuario
					data.user = $scope.user;
					data.pass = sha1($scope.user.substring(0, 2) + MD5($scope.password) + $scope.user.substring($scope.user.length - 2, $scope.user.length));
					//Los request tienen que estar definidos en routes.json (server/routes)
					$http({
						method: 'POST', //Verbo js
						data: JSON.stringify(data), //datos que se envian al servidor
						contentType: 'application/json',
						url: host + '/login' //nombre de request
							//Si la request se realizo de forma exitosa
					}).success(function (data) {
						//Controla si el proceso realizado en el servidor fue exitoso
						if (data.result == true) {
							//Carga la siguiente pagina activa
							$scope.pages[0].url = data.url;
						} else {
							//Crea un mensaje emergente
							swal({
									title: 'Log In',
									text: 'Usuario o Contraseña erronea, por favor verifique',
									type: 'info'
								},
								function () {
									$('input[type="password"]').val('');
									$scope.password = '';
								});


						}
					}).error(function (data, status, headers, config) {});
				} else {
					swal({
							title: 'Log In',
							text: 'Por favor ingrese usuario y contraseña',
							timer: 2000,
							type: 'info'
						},
						function () {
							$('input[type="password"]').val('');
							$scope.password = '';
						});
				}
			}
		}

		//Comportamiento al precionar una tecla en el input usuario
		$('input[name="usuario"]').on('keyup', function (e) {
			var code = e.keyCode || e.which;
			if (code == 13) {
				//cambia el foco al input password
				$('input[name="password"]').focus();
			}
		});
}])
	/////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////   INDEX ////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////
	//Parametros
	//	$scope:	es un vinculo con el html, proporcionado por Angular
	//	$http:	es la forma de realizar request por parte de Ajax  
	//	validarperfil: función definida en service.js
	.controller('IndexCtrl', ['$scope', '$http', 'validarperfil', 'GeneralFct', function ($scope, $http, validarperfil, GeneralFct) {
		$scope.partials = [{
			name: 'partial.html',
			url: ''
		}];
		//Carga los menues a los cuales el usuario tiene permisos
		//	Parametros:
		//		url
		validarperfil.validar_nav(function (url) {
			$scope.active.url = url
		});

		//Carga el menu home
		$('#navbox').on('click', 'img', function () {
			location.reload();
		});

		$('#navbox').on('click', 'li.menu_empty>a', function () {
			//Elimina el elemento anteriormente seleccionado
			if ($(this).parent('li').parent('ul').parent('li').hasClass('has-sub') != true) {
				$('.has-sub').children('ul').slideUp(200);
				$('.has-sub').removeClass('open');
			}
			$('.menu_empty').children('a').removeClass('active');

			//Agrega la clase "active" al menu clickeado
			$(this).addClass('active');
			$scope.active.url = null;

			data.abreviatura = $(this).attr('name');
			$http({
				method: 'POST', //Verbo js
				data: JSON.stringify(data), //datos que se envian al servidor
				contentType: 'application/json',
				url: host + '/Validate' //nombre de request
					//Si la request se realizo de forma exitosa
			}).success(function (data) {
				if (data.result) {
					//Cambia el menú activo
					$scope.active.url = data.url;
				} else {
					$scope.pages[0].url = data.url;
				}
				//Error de servidor
			}).error(function (data, status, headers, config) {});

		});

		$('#navbox').on('click', 'li.has-sub>a', function () {
			$('.menu_empty').children('a').removeClass('active');
			var element = $(this).parent('li');
			if (element.hasClass('open')) {
				element.removeClass('open');
				element.find('li').removeClass('open');
				element.find('ul').slideUp(200);
			} else {
				element.addClass('open');
				element.children('ul').slideDown(200);
				element.siblings('li').children('ul').slideUp(200);
				element.siblings('li').removeClass('open');
				element.siblings('li').find('li').removeClass('open');
				element.siblings('li').find('ul').slideUp(200);
			}
		});

		//Cerrar Sesion
		$('#close_sesion').on('click', function () {
			//Los request tienen que estar definidos en routes.json (server/routes)
			$http({
				method: 'POST', //Verbo js
				data: JSON.stringify(data), //datos que se envian al servidor
				contentType: 'application/json',
				url: host + '/logout' //nombre de request
					//Si la request se realizo de forma exitosa
			}).success(function (data) {
				//Redirecciona a la ruta recibida 
				$scope.pages[0].url = data.url;
			}).error(function (data, status, headers, config) {});
		});
		$scope.active = $scope.partials[0];

		//BLOCKADE BY SOCKET
		socket.on('blockade', function () {
			$scope.active.url = null;
			$('.active').removeClass('active');
		});

		/////////////////////////////////////////////////////////////////////////////////////////
		//							NAVEGABILIDAD EN TABLA
		//	Habilita la navegabilidad con la fecla arriba y con la flecha abajo

		var flag = true;

		//Desbindea del body el keydown
		$('body').off('keydown');
		//Bindea al body el keydown
		$('body').on('keydown', function (e) {
			//Iguala la variable code con el keyCode
			var code = e.keyCode || e.which,
				//Iguala la variable selec_actual con la posicion donde se encuentra la fila seleccionada
				selec_actual = $('.rowselect').index(),
				table = Table_active.get();

			//Comprobación que se realiza para evitar doble salto de linea
			if (flag) {
				switch (code) {
					//page up
					case 33:
						if (table.offset > 0) {
							//Llama a la función table_navCtrl para manejar la navegabilidad de la tabla (service.js)
							//Parametros
							//	Accion
							//	offset actual
							//	función
							GeneralFct.table_navCtrl('pageup', table.offset, function (result) {
								table.offset = result;
								Table_active.load(function () {
									//Cambia la fila seleccionada
									$('.table.focus').children('li').removeClass('rowselect');
									$('.table.focus').children('li').first().addClass('rowselect');
								});
							});
						}
						break;
					case 34:
						if ($('.table.focus').children('li').length == table_limit) {
							//Llama a la función table_navCtrl para manejar la navegabilidad de la tabla (service.js)
							//Parametros
							//	Accion
							//	offset actual
							//	función
							GeneralFct.table_navCtrl('pagedown', table.offset, function (result) {
								table.offset = result;
								console.log(result);
								Table_active.load(function () {
									//Cambia la fila seleccionada
									$('.table.focus').children('li').removeClass('rowselect');
									$('.table.focus').children('li').last().addClass('rowselect');
								});
							});
						}
						break;
						//flecha arriba
					case 38:
						//Si es la primera fila
						if (selec_actual == 0) {
							//si no es el primer registro
							if (table.offset > 0) {
								//Llama a la función table_navCtrl para manejar la navegabilidad de la tabla (service.js)
								//Parametros
								//	Accion
								//	offset actual
								//	función
								GeneralFct.table_navCtrl('sub', table.offset, function (result) {
									table.offset = result;
									Table_active.load(function () {
										//Cambia la fila seleccionada
										$('.table.focus').children('li').removeClass('rowselect');
										$('.table.focus').children('li').first().addClass('rowselect');
									});
								});
							}
						} else {
							//Cambia la fila seleccionada
							$('.table.focus').children('li').removeClass('rowselect');
							selec_actual = selec_actual - 1;
							$('.table.focus').children('li').eq(selec_actual).addClass('rowselect');
						}
						break;
						//Flecha abajo
					case 40:
						//Comprueba si es el último registro de la tabla
						if (selec_actual == $('.table.focus').children('li').length - 1 && $('.table.focus').children('li').length == table_limit) {
							//Llama a la función table_navCtrl para manejar la navegabilidad de la tabla (service.js)
							//Parametros
							//	Accion
							//	offset actual
							//	función
							GeneralFct.table_navCtrl('add', table.offset, function (result) {
								table.offset = result;
								Table_active.load(function () {
									//Cambia la fila seleccionada
									$('.table.focus').children('li').removeClass('rowselect');
									$('.table.focus').children('li').last().addClass('rowselect');
								});
							});
						} else {
							if (selec_actual >= 0) {
								//Cambia la fila seleccionada
								$('.table.focus').children('li').removeClass('rowselect');
								selec_actual = selec_actual + 1;
								$('.table.focus').children('li').eq(selec_actual).addClass('rowselect');
							} else {
								//Cambia la fila seleccionada
								$('.table.focus').children('li').removeClass('rowselect');
								$('.table.focus').children('li').first().addClass('rowselect');
							}
						}
						break;
				}
				flag = false;
			}
			//Establece un intervalo en el que la bandera volvera a ser true
			var interval = setInterval(function () {
				flag = true;
				clearTimeout(interval);
			}, 150);
		});

		$('body').on('mousewheel', '.table', function (event, delta) {
			var selec_actual = $('.rowselect').index(),
				table = Table_active.get();

			if (delta > 0) {
				//Si es la primera fila
				if (selec_actual == 0) {
					//si no es el primer registro
					if (table.offset > 0) {
						//Llama a la función table_navCtrl para manejar la navegabilidad de la tabla (service.js)
						//Parametros
						//	Accion
						//	offset actual
						//	función
						GeneralFct.table_navCtrl('sub', table.offset, function (result) {
							table.offset = result;
							Table_active.load(function () {
								//Cambia la fila seleccionada
								$('.table.focus').children('li').removeClass('rowselect');
								$('.table.focus').children('li').first().addClass('rowselect');
							});
						});
					}
				} else {
					//Cambia la fila seleccionada
					$('.table.focus').children('li').removeClass('rowselect');
					selec_actual = selec_actual - 1;
					$('.table.focus').children('li').eq(selec_actual).addClass('rowselect');
				}
			} else {
				//Comprueba si es el último registro de la tabla
				if (selec_actual == $('.table.focus').children('li').length - 1 && $('.table.focus').children('li').length == table_limit) {
					//Llama a la función table_navCtrl para manejar la navegabilidad de la tabla (service.js)
					//Parametros
					//	Accion
					//	offset actual
					//	función
					GeneralFct.table_navCtrl('add', table.offset, function (result) {
						table.offset = result;
						Table_active.load(function () {
							//Cambia la fila seleccionada
							$('.table.focus').children('li').removeClass('rowselect');
							$('.table.focus').children('li').last().addClass('rowselect');
						});
					});
				} else {
					if (selec_actual >= 0) {
						//Cambia la fila seleccionada
						$('.table.focus').children('li').removeClass('rowselect');
						selec_actual = selec_actual + 1;
						$('.table.focus').children('li').eq(selec_actual).addClass('rowselect');
					} else {
						//Cambia la fila seleccionada
						$('.table.focus').children('li').removeClass('rowselect');
						$('.table.focus').children('li').first().addClass('rowselect');
					}
				}
			}
		});

		$('body').on('keyup', 'input', function (e) {
			var code = e.keyCode || e.which;
			if (code == 13 && $(this).attr('tabindex') > 0) {
				var tab = parseInt($(this).attr('tabindex')) + 1;
				if ($('input[tabindex="' + tab + '"]').parent().css('display') == 'none') {
					tab += 1;
				}
				$('input[tabindex="' + tab + '"]').focus();
				$('textarea[tabindex="' + tab + '"]').focus();
				$('select[tabindex="' + tab + '"]').focus();
				if($(this).is(":focus")){
					Table_active.save();
				}
			}
		});

		$('body').on('keyup', '.input-number', function () {
			$(this).val($(this).val().replace(/[^0-9/]/g, ''));
		});

		$('body').on('keyup', '.input-decimal', function () {
			$(this).val($(this).val().replace(/[^0-9.,/ ]/g, ''));
			if (($(this).val().match(/\./g) || []).length > 1) {
				$(this).val($(this).val().substring(0, $(this).val().length - 1));
			} else {
				$(this).val($(this).val().replace(',', '.'));
			}
		});
		$('body').on('keyup', '.input-character', function () {
			$(this).val($(this).val().replace(/[^A-Z/^a-z/ ]/g, ''));
		});

		$('body').on('keyup', '.input-periodo', function (e) {
			var code = e.keyCode || e.which,
				length = $(this).val().length;

			$(this).val($(this).val().replace(/[^0-9/]/g, ''));

			if (length == 4 && code !== 8 && code !== 46) {
				$(this).val($(this).val() + '/');
			}

			if ($(this).val().substring(length - 1, length) == '/' && $(this).val().length !== 5) {

				$(this).val($(this).val().substring(0, length - 1));
			}
		});
}]);
/////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////// BLOCKADE ///////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////
socket.on('time_out', function(){
	session_expired();
});

function session_expired() {
	swal({
			title: 'Time Out',
			text: 'Su sesión a caducado',
			timer: 2000,
			type: 'info'
		},
		function () {
			location.reload();
		});
};
