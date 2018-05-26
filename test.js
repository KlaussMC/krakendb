var db = require("./db")

if (db.dbexists("test")) {
	db.loaddb("test")
} else {
	db.newdb("test", ["row1", "row2"])
	db.exportdb("test")
}