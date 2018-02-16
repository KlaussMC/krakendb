const fs = require("fs");
const path = require("path");

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
    set (item, row, val) {
        let matches = 0;
        for (let i in this.data) {
            if (this.data[i][0] == item) {

                let matches2 = 0;
                for (let j in this.data[0]) {
                    if (this.data[0][j] == row) {

                        this.data[i][j] = val;

                        matches2 ++;
                        break;
                    }
                }

                if (matches2 == 0) {
                    throw "The selected row is not available"
                }

                matches ++;
                break;
            }
        }
        if (matches == 0) {
            throw "The selected item is not available"
        }
    }
    get (item, row) {
        let matches = 0;
        for (let i in this.data) {
            if (this.data[i][0] == item) {

                if (row != undefined) {
                    let matches2 = 0;
                    for (let j in this.data[0]) {
                        if (this.data[0][j] == row) {

                            return this.data[i][j];

                            matches2 ++;
                            break;
                        }
                    }
                    if (matches2 == 0) {
                        throw "The selected row is not available"
                    }
                } else {
                    return this.data[i];
                }

                matches ++;
                break;
            }
        }
        if (matches == 0) {
            throw "The selected item is not available"
        }
    }
    del (item, row) {
        let matches = 0;
        for (let i in this.data) {
            if (this.data[i][0] == item) {

                if (row != undefined) {
                    let matches2 = 0;
                    for (let j in this.data[0]) {
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
}
let dbs = [];
let activeIndex = 0;
module.exports.newdb = function (name, rows) {
    dbs.push(new db(name, rows));
}
module.exports.activeDB = function(name) {
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
module.exports.newEntry = function(name) {
    dbs[activeIndex].entry(name);
}
module.exports.setItem = function(item, row, val) {
    dbs[activeIndex].set(item, row, val);
}
module.exports.getItem = function(item, row) {
    dbs[activeIndex].get(item, row);
}
module.exports.delItem = function(item, row) {
    dbs[activeIndex].del(item, row);
}
module.exports.exportdb = function(db) {
    if (!db) {
        if (fs.existsSync(path.join(__dirname, "krakendb"))) {
            fs.writeFileSync(path.join(path.join(__dirname, "krakendb"), dbs[activeIndex].name + ".json"), JSON.stringify(dbs[activeIndex]));
        } else {
            fs.mkdirSync(path.join(__dirname, 'krakendb'));
            fs.writeFileSync(path.join(path.join(__dirname, "krakendb"), dbs[activeIndex].name + ".json"), JSON.stringify(dbs[activeIndex]));
        }
    } else {
        let matches = 0;
        for (let i in dbs) {
            if (dbs[i].name == db) {
                if (fs.existsSync(path.join(__dirname, "krakendb"))) {
                    fs.writeFileSync(path.join(path.join(__dirname, "krakendb"), dbs[i].name + ".json"), JSON.stringify(dbs[i]));
                } else {
                    fs.mkdirSync(path.join(__dirname, 'krakendb'));
                    fs.writeFileSync(path.join(path.join(__dirname, "krakendb"), dbs[i].name + ".json"), JSON.stringify(dbs[i]));
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
module.exports.loaddb = function(name) {
    if (name) {
        if (fs.existsSync(path.join(path.join(__dirname, "krakendb"), name + ".json"))) {
            dbs.push(new db(name,
                            JSON.parse(fs.readFileSync(path.join(path.join(__dirname, "krakendb"), name + ".json"))).rows,
                            JSON.parse(fs.readFileSync(path.join(path.join(__dirname, "krakendb"), name + ".json"))).data
            ));
        } else {
            throw "database doesn't exist";
        }
    } else {
        throw "Please specify a database name (without extension)";
    }
}
module.exports.dbexists = function(name) {
    if (name) {
        if ( fs.existsSync(path.join(path.join(__dirname, "krakendb"), name + ".json")) ) {
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
module.exports.isset = function (row, column) {
    let db = dbs[activeIndex]
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
                    return db.data[i][colIndex] != null;
                else
                    throw "row not found in database"
            } else {
                return true;
            }
        }
    }
    return false;
}
module.exports.indb = function (str) {
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
