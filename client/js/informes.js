'use strict';

angular.module('myApp.informes', [])
	/////////////////////////////////////////////////////////////////////////////////////////
	/////////////////////////////////// INFORMES ////////////////////////////////////////////
	/////////////////////////////////////////////////////////////////////////////////////////
	.factory('InformesFct', ['$http', function ($http) {
		return {
			INFO_Load: function () {
				$http({
					method: 'POST', //accion a realizar
					data: JSON.stringify(data), //datos de la página
					contentType: 'application/json',
					url: host + '/INFO-Get' //nombre de post
				}).success(function (data) {
					$('#informe').attr('src', '');
					for (var i in data) {
						$('#posibles_inf').append('<li name="' + i + '" where="' + data[i].where +
							'" ><span>' + data[i].name + '</span></li>');
					}
				}).error(function (data, status, headers, config) {
					if (status === 505) {
						session_expired();
					}
				});
			},
			INFO_Render: function () {
				data.where = ($('#where').val().length > 0 ? '"' + $('.rowselect').attr('where') + '"' + "::TEXT='" +
					$('#where').val() + "'" : '');
				data.id = $('.rowselect').attr('name');
				$http({
					method: 'POST', //accion a realizar
					data: JSON.stringify(data), //datos de la página
					contentType: 'application/json',
					url: host + '/INFO-Render' //nombre de post
				}).success(function (data) {
					$('#informe').attr('src', '');
					if (data.result === true) {
						var doc = new jsPDF(data.orientacion, 'pt', 'a4'),
							width = 595.28,
							height = 841.89,
							flag = true;

						if (data.orientacion == 'l') {
							height = 595.28,
								width = 841.89;
						}

						var x = width * 5 / 100,
							y = height * 4 / 100;

						doc.roundedRect(x, y, width * 90 / 100, height * 10 / 100, 3, 3); //x - y - width - height - round - round

						var now = new Date(),
							day = ("0" + now.getDate()).slice(-2),
							month = ("0" + (now.getMonth() + 1)).slice(-2),
							today = (day) + "-" + (month) + "-" + now.getFullYear();

						doc.setFontType("bold");
						doc.setFontSize(11);

						doc.text('COOPERATIVA DE PROVISION DE ENERGIA ELECTRICA Y OTROS SERVICIOS PUBLICOS', x + 50, y + 16);
						doc.text('Y SOCIALES DE VIVIENDA Y CREDITO DE ELORTONDO LTDA.', x + 50, y + 27);

						doc.setFontSize(20);
						doc.text($('.rowselect').text() + ' ' + $('#where').val(), width * 45 / 100, y + height * 10 / 100 - 10);
						doc.setFontType("normal");
						doc.setFontSize(10);

						doc.text('Fecha: ' + today, x + 14, y + height * 10 / 100 - 16);
						doc.text('Hora:   ' + now.getHours() + ':' + (((now.getMinutes() + 1).toString().length > 1) ? now.getMinutes() : '0' + now.getMinutes()),
							x + 14, y + height * 10 / 100 - 5);

						y += height * 10 / 100 + 4;

						var content_width = width * 90 / 100;

						doc.roundedRect(x, y, width * 90 / 100, height * 4 / 100, 3, 3);
						x += 10;
						var y_header = y + (height * 4 / 100) * 55 / 100,
							page = 1;
						y += height * 4 / 100 + 11;
						doc.text('Pagina ' + page, width * 87 / 100, height - height * 4 / 100);
						var w = 0;

						for (var i = 0; i < data.rows.length; i++) {
							for (var j in data.rows[i]) {
								if (flag && data.width[w] > 0) {
									doc.setFontType("bold");
									doc.text(j, x, y_header);
									doc.setFontType("normal");
								}
								if (data.rows[i][j] !== null && data.rows[i][j] !== undefined && data.width[w] > 0) {
									if (data.rows[i][j] == 'TOTAL') {
										y += 11;
										doc.setFontType("bold");
										doc.setFontSize(11);
									}
									var align = 0,
										fontmit = (doc.internal.getFontSize() / 2) + 0.5;
									if (data.align[w] == 'r') {
										align = (data.width[w] - 3) * fontmit - data.rows[i][j].length * fontmit;
									} else {
										if (data.align[w] == 'c') {
											align = ((data.width[w] - 3) * fontmit - data.rows[i][j].length * fontmit) / 2;
										}
									}
									doc.text(data.rows[i][j], x + align, y);
								}
								x += content_width * data.width[w] / 100;
								w++;
							}

							w = 0;
							y += 11;
							x = width * 5 / 100 + 10;
							flag = false;

							if (y > height - height * 4 / 100 - 11) {
								y_header = height * 4 / 100 + (height * 4 / 100) * 55 / 100,
									y = y_header + height * 4 / 100,
									flag = true;

								doc.addPage();
								doc.roundedRect(x - 10, height * 4 / 100, width * 90 / 100, height * 4 / 100, 3, 3);
								page++;
								doc.text('Pagina ' + page, width * 87 / 100, height - height * 4 / 100);
							}
						}
						var str = doc.output('datauristring');
						$('#iframe').empty();
						$('#iframe').append('<iframe id="iframeId"  src="' + str + '">');
					}
				}).error(function (data, status, headers, config) {
					if (status === 505) {
						session_expired();
					}
				});
			}
		}
}]);
