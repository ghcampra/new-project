'use strict';
angular.module('myApp.services-main', [])
	/////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////// GENERAL /////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////
	//Funciones para el funcionamiento general del sistema
	//	Parametros:
	//		$http:	Llamado de funcion de Ajax para request asincronas
	.factory('GeneralFct', ['$http', function ($http) {
		return {
			//Esta función se útiliza para el armado de tablas
			//Parametros:
			//	data: son los datos con los que se va a armar la tabla
			//	callback:	función de retorno (callback)
			tableCtrl: function (data, callback) {
				try {
					//Limpia la tabla
					$('.table').empty();
					//ARMADO DE LA TABLA

					//Recorre los datos a mostrar (recorre las filas del array)
					for (var tr = 0; tr < data.rows.length; tr++) {
						//Definición de variables locales
						var li = '', //li: variable que se útiliza para formar la fila de tabla para su posterior inserción
							ban = false; //ban: bandera que se útiliza para corroborar la existenciá del encabezado

						//Corrobora si ya existe encabezado de tabla
						if ($('.header_table').children('span').length == 0) {
							$('.header_table').css('display', 'none');
							ban = true;
						}

						//Recorre las columnas a mostrar (recorre las columnas del array)
						for (var td in data.rows[tr]) {
							//Concatena la variable li con la nueva columna para de esta forma formar la fila
							li += '<span name="' + td.replace(/[ /]/g, '_').toLowerCase() + '">' +
								((data.rows[tr][td] !== null) ? data.rows[tr][td] : '') + '</span>';
							//Comprueba si ya está el encabezado
							if (tr == 0 && ban) {
								$('.header_table').css('display', 'inline-block');
								//Agrega la cabecera 
								$('.header_table').append('<span name="h-' + td.replace(/[ /]/g, '_').toLowerCase() + '">' + td + '</span>');
							}
						}
						//Agrega la fila
						$('.table').append('<li>' + li + '</li>');
					}

					//Calculo el alto de la fila
					var aux = (100 / table_limit) + '%';
					$('.table').children('li').css('height', aux);

					callback(true);
				} catch (err) {
					callback(false);
				}
			},
			//Función útilizada para la navegación por las tablas
			//Parametros:
			//	accion a realizar - Valores aceptados: sub (fila anterior), add(fila siguiente)
			//	offset
			//	función de retorno
			table_navCtrl: function (action, offset, callback) {
				switch (action) {
					//Avanza un registro
					case 'add':
						offset += 1;
						break;
						//Retrocede un registro
					case 'sub':
						if (offset - 1 >= 0) {
							offset -= 1;
						}
						break;
						//Retrocedo una página
					case 'pageup':
						if ((offset / table_limit) % 1 !== 0) {
							offset -= ((offset / table_limit) % 1) * table_limit;
						} else {
							offset -= table_limit;
						}
						break;
						//Avanzo una página
					case 'pagedown':
						if ((offset / table_limit) % 1 !== 0) {
							offset = (offset - (((offset / table_limit) % 1) * table_limit)) + table_limit * 2;
						} else {
							offset += table_limit;
						}
						break;
				}
				//Devuelve el offset actualizado
				callback(offset);
			},
			//Guarda registros llamando al post correspondiente para cada tabla
			//Parametros:
			//	table: Es el nombre de la tabla en que se va a guardar
			//	callback: función de retorno
			Save: function (table, callback) {
				var attr = '',
					post = '/' + abreviatura + '-Save';

				socket.emit('get:obj', table, function (obj) {
					for (var i = 0; i < obj._attr.length; i++) {
						attr = $('#' + obj._attr[i]._name);
						switch ($('#' + obj._attr[i]._name).prop("tagName")) {
							case 'INPUT':
								switch ($('#' + obj._attr[i]._name).prop("type")) {
									case 'radio':
										obj._attr[i]._value = $('#' + obj._attr[i]._name + ':checked').val();
										break;
									case 'checkbox':
										obj._attr[i]._value = $(attr).prop("checked");
										break;
									default:
										obj._attr[i]._value = $(attr).val();
										break;
								}
								break;
							case 'SPAN':
								obj._attr[i]._value = $(attr).text();
								break;
							case 'A':
								obj._attr[i]._value = $(attr).text();
								break;
							default:
								obj._attr[i]._value = $(attr).val();
								break;
						}
						if (obj._attr[i]._value == undefined && obj._attr[i]._is_nullable == false) {
							$(attr).addClass('invalidate');
						} else {
							$(attr).removeClass('invalidate');
						}
					}
					if ($('.invalidate').length == 0) {
						data.obj = obj;
						$http({
							method: 'POST', //accion a realizar
							data: JSON.stringify(data), //datos de la página
							contentType: 'application/json',
							url: host + post //nombre de post
						}).success(function (data) {
							callback(data);
						}).error(function (data, status, headers, config) {});
					}
				});
			},
			//Obtiene un registro a partir de un id
			//Parametros:
			//	id: identificador unequivoco para la obtención del registro
			//	table: tabla donde se buscara el registro
			Get: function (id, table) {
				var post = '/' + abreviatura + '-Get';
				//Parametros que se envian
				data.id = id;
				//Los request tienen que estar definidos en routes.json (server/routes)
				$http({
					method: 'POST', //Verbo js
					data: JSON.stringify(data), //datos que se envian al servidor
					contentType: 'application/json',
					url: host + post //nombre de request
				}).success(function (data) {
					if (data.result !== false) {
						for (var i in data.obj) {
							if (i != 'id_usuario') {
								if ($('#' + i).prop("tagName") !== 'SELECT') {
									if ($('#' + i).prop("type") == 'radio' || $('#' + i).prop("type") == 'checkbox') {
										$('#' + i).prop('checked', data.obj[i]);
									} else {
										$('#' + i).text(data.obj[i]);
										$('#' + i).val(data.obj[i]);
									}
								} else {
									$('#' + i).children('option[value="' + data.obj[i] + '"]').attr("selected", true);
								}
							}
						}
					}
				}).error(function (data, status, headers, config) {});
			}
		}
}])
	/////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////   INDEX ////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////
	.factory('validarperfil', ['$http', function ($http) {
		return {
			//Función para el armado de los menues
			validar_nav: function (callback) {
				//Los request tienen que estar definidos en routes.json (server/routes)
				$http({
					method: 'POST', //Verbo js
					data: JSON.stringify(data), //datos que se envian al servidor
					contentType: 'application/json',
					url: host + '/menu_load' //nombre de request
						//Si la request se realizo de forma exitosa
				}).success(function (data) {
					//Limpia los menues
					$(".nav").empty();
					//Recorre los menues diponibles para el usuario
					for (var i = 0; i < data.nav.length; i++) {
						if (data.nav[i].depende == null) {
							//Agrega Menu
							$(".nav").append("<li class='menu_empty' name='master_" + data.nav[i].abreviatura +
								"'><a name='" + data.nav[i].abreviatura + "'>" + data.nav[i].menu + "</a></li>");
						} else {
							if ($('li[name="master_' + data.nav[i].depende + '"]').children('ul').length == 0) {
								$('li[name="master_' + data.nav[i].depende + '"]').removeClass('menu_empty');
								$('li[name="master_' + data.nav[i].depende + '"]').addClass('has-sub');
								$('li[name="master_' + data.nav[i].depende + '"]').append('<ul></ul>');
							}
							$('li[name="master_' + data.nav[i].depende + '"]').children('ul').append("<li class='menu_empty'><a name='" + data.nav[i].abreviatura + "'>" + data.nav[i].menu + "</a></li>");
						}
					}
					//Selecciona la primera opción
					//$('.nav').children('li').eq(0).addClass('active');

					$('#id_usuario').text(data.id_user);
					callback(data.url);
				}).error(function (data, status, headers, config) {});
			}
		};
}]);
