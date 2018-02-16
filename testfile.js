const db = require("./krakendb");

// db.newdb("test", ["arg1", "arg2", "arg3"]);
// db.activeDB("test");
// db.newEntry("row1")
// db.setItem("row1", "arg1", "hello");
// db.exportdb("test")

db.newdb("demo", ["un", "email", "password"]);
db.activeDB("demo");
db.newEntry("user1")
db.setItem("user1", "un", "test");
db.setItem("user1", "email", "a@b.c");
db.exportdb("demo")
console.log(db.isset("user1", "un"));
console.log(db.indb("a@b.c"));


// let isIt = db.indb("arg1", "row1");
//
// console.log(isIt);
