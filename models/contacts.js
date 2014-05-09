exports.definition = {
	config: {
		columns: {
		    "id": "TEXT",
		    "user_id": "TEXT",
		    "persona_id": "TEXT",
		    "first_name": "TEXT",
		    "last_name": "TEXT",
		    "fullname": "TEXT"
		},
		adapter: {
			type: "sql",
			collection_name: "contacts",
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