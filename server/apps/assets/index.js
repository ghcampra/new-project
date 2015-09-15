//LOAD MODULE
var sql = require(process.cwd() + '/libs/queries'),
	url = require('url');

//VERB ACTIONS
module.exports = function Index(req, res) {
	var data = {};
	switch (url.parse(req.url).pathname) {
		case '/menu_load':
			var query = [{
					variable: 'menu, permiso, depende, abreviatura',
					from: 'perfil_v',
					where: 'id_usuario = ' + req.session.user_id
				},
				{
					variable: "nombre || ' ' || apellido as nombre",
					from: 'usuarios',
					where: 'id_usuario = ' + req.session.user_id
				}];
			var query_result = sql.query(query);
			query_result.execute(function (result) {
				data.nav = result[0];
				data.user = result[1][0].nombre;
				data.id_user = req.session.user_id;
				data.url = 'partials/menus/home.html';
				res.send(data);
			});
			break;
		case '/logout':
			req.session.isAuthenticate = false;
			req.session.user_id = '';
			data.result = true;
			data.url = 'partials/pages/login.html';
			res.send(data);
			break;
		case '/Validate':
			var query = [{
				from: 'perfil_v',
				where: 'id_usuario = ' + req.session.user_id + " and abreviatura = '" + req.body.abreviatura + "'"
			}];
			var query_result = sql.query(query);
			query_result.execute(function (result) {
				if (result) {
					data.result = true;
					data.url = 'partials/menus/' + result[0].url + '.html';
				} else {
					data.result = false;
				}
				res.send(data);
			});
			break;
	}
}
