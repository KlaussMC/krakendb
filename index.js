'use strict'
const fs = require("fs"),
      path = require("path"),
      root = path.resolve(__dirname).split('/node_modules')[0],
      functions = {};

// console.log(root)



class db {
    constructor (name, rows, cont) {
        this.name = name;
        this.rows = rows;

        this.data = [['0']];

        if (Number.isInteger(rows) || rows.constructor === Array) {
            for (let i in rows) {
                this.data[0].push(rows[i]);
            }
        } else {
            throw "The second argument must be an array of strings or an integer.";
        }
    }
    entry (item) {
        let arr = new Array(this.rows.length + 1);
        arr[0] = item;
        this.data.push(arr);
    }
    set (row, column, val) {
        for(let i in this.data) {
            if(this.data[i][0] == row) {
                if (column) {
                    let colIndex = this.data[0].indexOf(column);
                    if (colIndex == -1)
                        throw "row not found in database"
                    else
                        this.data[i][colIndex] = val;
                        return;
                } else {
                    throw "All 3 arguments are required";
                }
            }
        }
        throw "Something failed";
    }
    get (row, column) {
        for(let i in this.data) {
            if(this.data[i][0] == row) {
                if (column) {
                    let colIndex = this.data[0].indexOf(column);
                    if (colIndex == -1)
                        throw "row not found in database"
                    else
                        return this.data[i][colIndex];
                } else {
                    return this.data[i];
                }
            }
        }
        return false;
    }
    del (item, row) {
        let matches = 0;
        for (let i =0; i < this.data.length; i++) {
            if (this.data[i][0] == item) {

                if (row != undefined) {
                    let matches2 = 0;
                    for (let j = 0; j < this.data[0].length; j++) {
                        if (this.data[0][j] == row) {

                            this.data[i][j] = null;

                            matches2 ++;
                            break;
                        }
                    }
                    if (matches2 == 0) {
                        throw "The selected row is not available"
                    }
                } else {
                    this.data.splice(i, 1);
                }

                matches ++;
                break;
            }
        }
        if (matches == 0) {
            throw "The selected item is not available"
        }
    }
	getIndex(index) {
		if (index >= 0)
			return this.data[index + 1]
		else
			throw "The lowest index is 0";
	}
	setIndex(index, row, value) {
		this.set(this.getIndex(index)[0], row, value);
	}
	length() {
		return this.data.length;
	}
	push(items) {
		if (items.length - 1 != this.rows.length) {
			throw "Number of items provided is does not match number of data fields";
		} else {
			var rowName = items.shift()
			this.entry(rowName)
			for (var i = 0; i < this.length(); i++) {
				this.set(rowName, this.rows[i], items[i])
			}
		}
	}
}
var dbs = [];
let activeIndex = 0;
functions.newdb = function (name, rows) {
    dbs.push(new db(name, rows));
}
functions.activeDB = function(name) {
    let matches = 0;
    for (let i in dbs) {
        if (dbs[i].name == name) {
            activeIndex = i;
            matches++;
        }
    }
    if (matches == 0) {
        throw "The selected database does not exist"
    }
}
functions.newEntry = function(name) {
    dbs[activeIndex].entry(name);
}
functions.setItem = function(item, row, val) {
    dbs[activeIndex].set(item, row, val);
}
functions.getItem = function(item, row) {
    return dbs[0].get(item, row)
}
functions.delItem = function(item, row) {
    dbs[activeIndex].del(item, row);
}
functions.exportdb = function(db) {
    if (!db) {
        if (fs.existsSync(path.join(root, "krakendb/"))) {
            fs.writeFileSync(path.join(root, "krakendb/" + dbs[activeIndex].name + ".json"), JSON.stringify(dbs[activeIndex]));
        } else {
            fs.mkdirSync(path.join(root, "krakendb/"));
            fs.writeFileSync(path.join(root, "krakendb/" + dbs[activeIndex].name + ".json"), JSON.stringify(dbs[activeIndex]));
        }
    } else {
        let matches = 0;
        for (let i in dbs) {
            if (dbs[i].name == db) {
                if (fs.existsSync(path.join(root, path.join(__dirname, "krakendb")))) {
                    fs.writeFileSync(path.join(root, "krakendb/" + dbs[i].name + ".json"), JSON.stringify(dbs[i]));
                } else {
                    fs.mkdirSync(path.join(root, "krakendb"));
                    fs.writeFileSync(path.join(root, "krakendb/" + dbs[i].name + ".json"), JSON.stringify(dbs[i]));
                }
                matches++;
                break;
            }
        }
        if (matches == 0) {
            throw "The selected database does not exist"
        }
    }
}
functions.loaddb = function(name) {
    if (name) {
        if (fs.existsSync(path.join(root, "krakendb/" + name + ".json"))) {
            dbs.push(new db(name,
                            JSON.parse(fs.readFileSync(path.join(root, "krakendb/" + name + ".json"))).rows,
                            JSON.parse(fs.readFileSync(path.join(root, "krakendb/" + name + ".json"))).data
            ));
        } else {
            throw "database doesn't exist";
        }
    } else {
        throw "Please specify a database name (without extension)";
    }
}
functions.dbexists = function(name) {
    if (name) {
        if ( fs.existsSync(path.join(root, "krakendb/" + name + ".json")) ) {
            return true;
        } else {
            let matches = 0;
            for (i in dbs.length) {
                if (dbs[i].name == name) {
                    return true;
                }
            }
            if (matches == 0) {
                return false;
            }
        }
    }
}
functions.isset = function (row, column) {
    let db = dbs[activeIndex]
    let output = false;
    for(let i in db.data) {
        if(db.data[i][0] == row) {
            if (column) {
                var colIndex = null;
                for(let j in db.data[i]) {
                    if(db.data[0][j] == column) {
                        colIndex = j;
                    }
                }
                if(colIndex != null )
                    output = db.data[i][colIndex] != null;
                else
                    throw "row not found in database"
            } else {
                output = true;
            }
        }
    }
    return output;
}
functions.indb = function (str) {
    let db = dbs[activeIndex]
    let matches = 0;
    for (let i in db.data) {
        for (let j in db.data[i]) {
            if (db.data[i][j] == str) {
                matches++
            }
        }
    }
    if (matches == 0)
        return false
    else
        return true;
}
functions.length = () => {return dbs[activeIndex].length() }
functions.getByIndex = index => { return dbs[activeIndex].getIndex(index) }
functions.setByIndex = (index, row, value) => { dbs[activeIndex].setIndex(index, row, value) }
functions.push = (args) => { dbs[activeIndex].push(args) }

module.exports = (function() { return functions; } )();                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             vvv

/**
    new user requirements: call var db = require("krakendb")("testdb")

    db.getItem() lah dih dah dih dah
*/