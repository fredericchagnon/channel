exports.definition = {
	config: {
		columns: {
		    "id": "TEXT",
		    "status_id": "TEXT",
		    "persona_id": "TEXT",
		    "protocol_id": "TEXT",
		    "rank": "INTEGER",
		    "enabled": "INTEGER"
		},
		defaults: {
		    "id": null,
		    "status_id": null,
		    "persona_id": null,
		    "protocol_id": null,
		    "rank": 0,
		    "enabled": 0
		},
		adapter: {
			type: "sql",
			collection_name: "persona_handles",
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
                    if (key === "status_id") {
                        if (value === null || value.length <= 0) {
                            return "Error: No status_id!";
                        }
                    }
                    if (key === "persona_id") {
                        if (value === null || value.length <= 0) {
                            return "Error: No persona_id!";
                        }	
                    }
                    if (key === "protocol_id") {
                        if (value === null || value.length <= 0) {
                            return "Error: No protocol_id!";
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
    	    comparator: function(thisPersonaHandle) {
        	    return thisPersonaHandle.get('rank');
            },
    //         add: function(thesePersonaHandles) {
				// // For array
				// thesePersonaHandles = _.isArray(thesePersonaHandles) ? thesePersonaHandles.slice() : [thesePersonaHandles]; //From backbone code itself
				// for (i = 0, length = thesePersonaHandles.length; i < length; i++) {
				//     var thisPersonaHandle = ((thesePersonaHandles[i] instanceof this.model) ? thesePersonaHandles[i]  : new this.model(thesePersonaHandles[i])); // Create a model if it's a JS object
				//     // Using isDupe routine
				//     // var isDupe = this.any(function(_thisPersonaHandle) {
				//     //     return _thisPersonaHandle.get('id') === thisPersonaHandle.get('id');
				//     // });
				// 	var isDupe = this.get(thisPersonaHandle.get('id'));
			 //        // Ti.API.error("isDupe is "+JSON.stringify(isDupe));
				//     if (typeof (isDupe) !== 'undefined') {
				//         // Return false if duplicate
				// 	    Backbone.Model.prototype.save.call(isDupe, thisPersonaHandle);
				//         // return false;
				//     } else {
				// 	    Backbone.Collection.prototype.add.call(this, thisPersonaHandle);
				//     }
				//     // if (isDupe) {
				//     //     // Return false if duplicate
				//     //     return false;
				//     // }
				//     // Backbone.Collection.prototype.add.call(this, thisPersonaHandle);
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