exports.definition = {
	config: {
		columns: {
		    "id": "TEXT",
		    "name": "TEXT",
		    "value": "TEXT",
		    "url": "TEXT",
		    "country_name": "TEXT",
		    "country_code": "TEXT"
		},
		defaults: {
		    "id": null,
		    "name": null,
		    "value": null,
		    "url": null,
		    "country_name": null,
		    "country_code": null
		},
		adapter: {
			type: "sql",
			collection_name: "contact_handles",
			idAttribute: "id"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
            validate: function(attrs) {
    	        for (var key in attrs) {
                    var value = attrs[key];
                    if (key === "id") {
                        if (value === null || value.length <= 0) {
                            return "Error: No id!";
                        }
                    }
                    if (key === "name") {
                        if (value === null || value.length <= 0) {
                            return "Error: No name!";
                        }
                    }
                    if (key === "value") {
                        if (value === null || value.length <= 0) {
                            return "Error: No value!";
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
    	    comparator: function(thisContactHandle) {
        	    return thisContactHandle.get('name');
            },
    //         update: function(theseContactHandles) {
    //         	Backbone.Collection.prototype.reset.call(this, theseContactHandles);
    //         	return this.invoke('save');
    //         	// return this.collection.invoke('save');s
    //         },
    //         add: function(theseContactHandles) {
				// // For array
				// theseContactHandles = _.isArray(theseContactHandles) ? theseContactHandles.slice() : [theseContactHandles]; //From backbone code itself
				// for (i = 0, length = theseContactHandles.length; i < length; i++) {
				//     var thisContactHandle = ((theseContactHandles[i] instanceof this.model) ? theseContactHandles[i]  : new this.model(theseContactHandles[i])); // Create a model if it's a JS object
				//     // Using isDupe routine
				//     // var isDupe = this.any(function(_thisContactHandle) {
				//     //     return _thisContactHandle.get('id') === thisContactHandle.get('id');
				//     // });
				// 	var isDupe = this.get(thisContactHandle.get('id'));
			 //        // Ti.API.error("isDupe is "+JSON.stringify(isDupe));
				//     if (typeof (isDupe) !== 'undefined') {
				//         // Return false if duplicate
				// 	    Backbone.Model.prototype.save.call(isDupe, thisContactHandle);
				//         // return false;
				//     } else {
				// 	    Backbone.Collection.prototype.add.call(this, thisContactHandle);
				//     }
				//     // if (isDupe) {
				//     //     // Return false if duplicate
				//     //     return false;
				//     // }
				//     // Backbone.Collection.prototype.add.call(this, thisContactHandle);
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