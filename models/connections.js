exports.definition = {
	config: {
		columns: {
		    "id": "TEXT",
		    "type": "TEXT",
		    "from_id": "TEXT",
		    "to_id": "TEXT",
		    "by_id": "TEXT",
		    "other_id": "TEXT",
		    "from_name": "TEXT",
		    "to_name": "TEXT",
		    "by_name": "TEXT",
		    "other_name": "TEXT",
		    "from_persona_id": "TEXT",
		    "to_persona_id": "TEXT",
		    "by_persona_id": "TEXT",
		    "other_persona_id": "TEXT"
		},
		adapter: {
			type: "sql",
			collection_name: "connections",
			idAttribute: "id"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
			deleteAll: function() {
                var collection = this;
                var sql = "DELETE FROM " + collection.config.adapter.collection_name;
                db = Ti.Database.open(collection.config.adapter.db_name);
                db.execute(sql);
                db.close();
                collection.trigger('sync');
            },        
		});

		return Collection;
	}
};