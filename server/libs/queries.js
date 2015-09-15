var database = require("./PostgresConnect");

var queryPrototype = {
	init: function (obj) {
		this.querys = [{
			_variable: (obj.variable !== undefined) ? 'Select ' + obj.variable : 'Select *',
			_from: ' from ' + obj.from,
			_where: (obj.where !== undefined) ? ' where ' + obj.where : '',
			_order: (obj.order !== undefined) ? ' order by ' + obj.order : '',
			_offset: (obj.offset !== undefined) ? ' offset ' + obj.offset : '',
			_limit: (obj.limit !== undefined) ? ' limit ' + obj.limit : '',
			parametres: (obj.parametres !== undefined) ? '(' + obj.parametres + ')' : ''
			}];
	},
	add: function (obj) {
		var aux = {
			_variable: (obj.variable !== undefined) ? 'Select ' + obj.variable : 'Select *',
			_from: ' from ' + obj.from,
			_where: (obj.where !== undefined) ? ' where ' + obj.where : '',
			_order: (obj.order !== undefined) ? ' order by ' + obj.order : '',
			_offset: (obj.offset !== undefined) ? ' offset ' + obj.offset : '',
			_limit: (obj.limit !== undefined) ? ' limit ' + obj.limit : '',
			parametres: (obj.parametres !== undefined) ? '(' + obj.parametres + ')' : ''
		};
		this.querys.push(aux);
	},
	execute: function (callback) {
		var aux = this;
		database.Handler(function (db) {
			var results = [];
			for (var i = 0; i < aux.querys.length; i++) {
				var querys = aux.querys[i]._variable +
					aux.querys[i]._from +
					aux.querys[i].parametres +
					aux.querys[i]._where +
					aux.querys[i]._order +
					aux.querys[i]._offset +
					aux.querys[i]._limit,
					query = db.query(querys);
				var rows = [];
				query.on('row', function (row) {
					rows.push(row);
				});
				query.on('end', function (err, result) {
					results.push(rows);
					rows = [];
					if (results.length === aux.querys.length) {
						try {
							if (aux.querys.length === 1) {
								results = results[0];
							}
							callback(results);
						} catch (err) {
							console.log(err);
							console.log(query.text);
							callback(false);
						}
					}
				});
			}
		});
	}
};

exports.query = function (model) {
	function F() {};
	F.prototype = queryPrototype;
	var f = new F();
	f.init(model[0]);
	for (var i = 1; i < model.length; i++) {
		f.add(model[i]);
	}
	return f;
}
