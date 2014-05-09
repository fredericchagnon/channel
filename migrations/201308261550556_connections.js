migration.up = function(db) {
	db.createTable({
		"columns": {
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
		}
	});
};

migration.down = function(db) {
	db.dropTable("connections");
};
