//LOAD MODULE
var sql = require(process.cwd() + '/libs/queries'),
	url = require('url');

//VERB ACTIONS
module.exports = function Index(req, res) {
	var data = {};
	switch (url.parse(req.url).pathname) {
		case '/INFO-Get':
			res.send(info[req.body.table]);
			break;
		case '/INFO-Render':
			var query = [info[req.body.table][req.body.id]];
			var query_result = sql.query(query);
			query_result.execute(function (result) {
				if (result) {
					data.result = true;
					data.rows = result;
				} else {
					data.result = false;
				}
				res.send(data);
			});
			break;
	}
}
