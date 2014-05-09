migration.up = function(db) {
	db.createTable({
		"columns": {
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
		}
	});
}

migration.down = function(db) {
	db.dropTable("personas");
}
