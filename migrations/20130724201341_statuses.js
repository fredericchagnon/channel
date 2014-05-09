migration.up = function(db) {
	db.createTable({
		"columns": {
		    "id": "TEXT",
		    "name": "TEXT",
		    "color": "TEXT"
		}
	});
};

migration.down = function(db) {
	db.dropTable("statuses");
};
