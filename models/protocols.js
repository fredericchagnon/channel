exports.definition = {
	config: {
		columns: {
		    "id": "TEXT",
		    "contact_handle_id": "TEXT",
		    "type": "TEXT",
		    "active": "INTEGER"
		},
		defaults: {
		    "id": null,
		    "contact_handle_id": null,
		    "type": null,
		    "active": 0
		},
		adapter: {
			type: "sql",
			collection_name: "protocols",
			idAttribute: "id"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
            validate: function (attrs) {
    	        for (var key in attrs) {
                    var value = attrs[key];
                    if (key === "id") {
                        if (value === null || value.length <= 0) {
                            return "Error: No id!";
                        }
                    }
                    if (key === "contact_handle_id") {
                        if (value === null || value.length <= 0) {
                            return "Error: No contact_handle_id!";
                        }
                    }
                    if (key === "type") {
                        if (value === null || value.length <= 0) {
                            return "Error: No type!";
                        }	
                    }
                }
            },
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here
    	    comparator: function(thisProtocol) {
        	    return thisProtocol.get('id');
            },
    //         add: function(theseProtocols) {
				// // For array
				// theseProtocols = _.isArray(theseProtocols) ? theseProtocols.slice() : [theseProtocols]; //From backbone code itself
				// for (i = 0, length = theseProtocols.length; i < length; i++) {
				//     var thisProtocol = ((theseProtocols[i] instanceof this.model) ? theseProtocols[i]  : new this.model(theseProtocols[i])); // Create a model if it's a JS object
				//     // Using isDupe routine
				//     // var isDupe = this.any(function(_thisProtocol) {
				//     //     return _thisProtocol.get('id') === thisProtocol.get('id'));
				//     // });
				// 	var isDupe = this.get(thisProtocol.get('id'));
			 //        // Ti.API.error("isDupe is "+JSON.stringify(isDupe));
				//     if (typeof (isDupe) !== 'undefined') {
				//         // Return false if duplicate
				// 	    Backbone.Model.prototype.save.call(isDupe, thisProtocol);
				//         // return false;
				//     } else {
				// 	    Backbone.Collection.prototype.add.call(this, thisProtocol);
				//     }
				//     // Backbone.Collection.prototype.add.call(this, thisProtocol);
				// }
    //         },
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