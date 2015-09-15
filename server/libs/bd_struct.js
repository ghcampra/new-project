var sql = require(process.cwd() + '/libs/queries');

var queryPrototype = {
	init: function (obj, callback) {
		this._name = obj;
		this._attr = [];
	},
	get: function (callback) {
		if (this._attr.length === 0) {
			var query = [{
					variable: 'column_name, is_nullable::boolean',
					from: 'information_schema.columns',
					where: "table_name='" + this._name + "'"
				}],
				query_result = sql.query(query),
				aux = this;
			query_result.execute(function (result) {
				for (var i = 0; i < result.length; i++) {
					var attr = {
						_name: result[i].column_name,
						_value: null,
						_is_nullable: result[i].is_nullable
					};
					aux._attr.push(attr);
				}
				callback();
			});
		}
	},
	set: function (obj) {
		try {
			for (var i = 0; i < this._attr.length; i++) {
				if (obj._attr[i]._value === '' && this._attr[i]._is_nullable === false && obj._attr[i]._name === this._attr[i]._name) {
					return false;
				}
				this._attr[i]._value = obj._attr[i]._value;
			}
			return true;
		} catch (err) {
			return false;
		}
	},
	save: function (function_name, callback) {
		var query = [{
				variable: 'parameter_name, data_type',
				from: 'information_schema.parameters',
				where: "specific_name LIKE '" + function_name + "%'",
				order: 'ordinal_position'
			}],
			query_struct = sql.query(query),
			aux = this,
			_parametres = '';
		query_struct.execute(function (result) {
			for (var i = 0; i < result.length; i++) {
				var j = 0;
				while (j < aux._attr.length && ('_' + aux._attr[j]._name) !== result[i].parameter_name) {
					j++;
				}
				if (j !== aux._attr.length) {
					if (aux._attr[j]._value === '' && aux._attr[j]._is_nullable === false) {
						callback(false);
					} else {
						var str = (aux._attr[j]._value === '' || aux._attr[j]._value === undefined ? 'null' : aux._attr[j]._value);
						if (result[i].data_type.charAt(0) === 'c' || result[i].data_type === 'date' || result[i].data_type === 'text') {
							if (str !== 'null') {
								str = "'" + str.toString().toUpperCase().replace(/\'/g, "''") + "'";
							}
						} else {
							if (str === 'null') {
								str = 0;
							}
						}
						if (i < result.length - 1) {
							str = str + ',';
						}
						_parametres = _parametres + str;
					}
				}
			}
			query = [{
					parametres: _parametres,
					from: function_name
				}],
				query_result = sql.query(query),
				query_result.execute(function (result) {
					callback(result);
				});
		});
	}
};

exports.newobj = function (obj) {
	function F() {};
	F.prototype = queryPrototype;
	var f = new F();
	f.init(obj);
	return f;
}
