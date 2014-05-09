exports.definition = {
	config: {
		columns: {
		    "id": "TEXT",
		    "name": "TEXT",
		    "color": "TEXT"
		},
		defaults: {
		    "id": null,
		    "name": null,
		    "color": null
		},
		adapter: {
			type: "sql",
			collection_name: "statuses",
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
                    if (key === "name") {
                        if (value === null || value.length <= 0) {
                            return "Error: No name!";
                        }
                    }
                    if (key === "color") {
                        if (value === null || value.length <= 0) {
                            return "Error: No color!";
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
    	    comparator: function(thisStatus) {
        	    return thisStatus.get('name');
            },
    //         add: function(theseStatuses) {
				// // For array
				// theseStatuses = _.isArray(theseStatuses) ? theseStatuses.slice() : [theseStatuses]; //From backbone code itself
				// for (i = 0, length = theseStatuses.length; i < length; i++) {
				//     var thisStatus = ((theseStatuses[i] instanceof this.model) ? theseStatuses[i]  : new this.model(theseStatuses[i])); // Create a model if it's a JS object
				//     // Using isDupe routine
				//     // var isDupe = this.any(function(_thisStatus) {
				//     //     return _thisStatus.get('id') === thisStatus.get('id');
				//     // });
				// 	var isDupe = this.get(thisStatus.get('id'));
			 //        // Ti.API.error("isDupe is "+JSON.stringify(isDupe));
				//     if (typeof (isDupe) !== 'undefined') {
				//         // Return false if duplicate
				// 	    Backbone.Model.prototype.save.call(isDupe, thisStatus);
				//         // return false;
				//     } else {
				// 	    Backbone.Collection.prototype.add.call(this, thisStatus);
				//     }
				//     // if (isDupe) {
				//     // 	// Backbone.Model.prototype.save.call(_thisStatus)
				//     //     // Return false if duplicate
				//     //     return false;
				//     // }
				//     // Backbone.Collection.prototype.add.call(this, thisStatus);
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