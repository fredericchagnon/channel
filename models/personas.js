exports.definition = {
	config: {
		columns: {
		    "id": "TEXT",
		    "user_id": "TEXT",
		    "avatar_id": "TEXT",
		    "category": "TEXT",
		    "public_name": "TEXT",
		    "rank": "INTEGER",
		    "prefix": "TEXT",
		    "first_name": "TEXT",
		    "first_name_phonetic": "TEXT",
		    "middle_name": "TEXT",
		    "last_name": "TEXT",
		    "last_name_phonetic": "TEXT",
		    "suffix": "TEXT",
		    "nickname": "TEXT",
		    "job_title": "TEXT",
		    "department": "TEXT",
		    "company": "TEXT"
		},
		defaults: {
		    "id": null,
		    "user_id": null,
		    "avatar_id": null,
		    "category": null,
		    "public_name": null,
		    "rank": 0,
		    "prefix": null,
		    "first_name": null,
		    "first_name_phonetic": null,
		    "middle_name": null,
		    "last_name": null,
		    "last_name_phonetic": null,
		    "suffix": null,
		    "nickname": null,
		    "job_title": null,
		    "department": null,
		    "company": null
		},
		adapter: {
			type: "sql",
			collection_name: "personas",
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
                    if (key === "user_id") {
                        if (value === null || value.length <= 0) {
                            return "Error: No user_id!";
                        }
                    }
                    if (key === "category") {
                        if (value === null || value.length <= 0) {
                            return "Error: No category!";
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
    	    comparator: function(thisPersona) {
        	    return thisPersona.get('rank');
            },
    //         add: function(thesePersonas) {
				// // For array
				// thesePersonas = _.isArray(thesePersonas) ? thesePersonas.slice() : [thesePersonas]; //From backbone code itself
				// for (i = 0, length = thesePersonas.length; i < length; i++) {
				//     var thisPersona = ((thesePersonas[i] instanceof this.model) ? thesePersonas[i]  : new this.model(thesePersonas[i])); // Create a model if it's a JS object
				//     // Using isDupe routine
				//     // var isDupe = this.any(function(_thisPersona) {
				//     //     return _thisPersona.get('id') === thisPersona.get('id');
				//     // });
				// 	var isDupe = this.get(thisPersona.get('id'));
			 //        // Ti.API.error("isDupe is "+JSON.stringify(isDupe));
				//     if (typeof (isDupe) !== 'undefined') {
				//         // Return false if duplicate
				// 	    Backbone.Model.prototype.save.call(isDupe, thisPersona);
				//         // return false;
				//     } else {
				// 	    Backbone.Collection.prototype.add.call(this, thisPersona);
				//     }
				//     // if (isDupe) {
				//     //     // Return false if duplicate
				//     //     return false;
				//     // }
				//     // Backbone.Collection.prototype.add.call(this, thisPersona);
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