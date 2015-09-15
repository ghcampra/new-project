//LOAD MODULE
var sql = require(process.cwd() + '/libs/queries'),
	url = require('url');

module.exports = function Index(req, res) {
	var data = {};
	switch (url.parse(req.url).pathname) {
		case "/get":
			if (req.session.isAuthenticate) {
				data.url = 'partials/pages/index.html';
				data.result = true;
			} else {
				data.url = 'partials/pages/login.html';
				data.result = false;
			}
			res.send(data);
			break;
		case "/login":
			var body = req.body;
			var query = [{
				from: 'usuarios',
				where: "usuario = '" + body.user.replace(/\'/g, "''") + "' AND habilitado = TRUE"
			}];
			var query_result = sql.query(query);
			query_result.execute(function (result) {
				if (result.length > 0 && body.pass === result[0].pass) {
					req.session.isAuthenticate = true;

					req.session.user_id = result[0].id_usuario;
					data.result = true;
					data.url = 'partials/pages/index.html';
				} else {
					data.result = false;
				}
				res.send(data);
			});
			break;
	}
}
