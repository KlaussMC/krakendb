const fs = require("fs");
const path = require("path");

class db {
    constructor (name, rows, cont) {
        if (name && rows) {
            this.name = name;
            this.rows = rows;

            this.data = [['0']];

            if (Number.isInteger(rows) || rows.constructor === Array) {
                for (let i in rows) {
                    this.data[0].push(rows[i]);
                }
            } else {
                console.log("The second argument must be an array of strings or an integer.");
            }
        } else {
            this.data = cont;
        }
    }
    entry (item) {
        let arr = new Array(this.rows.length + 1);
        arr[0] = item;
        this.data.push(arr);
    }
    set (item, row, val) {
        let matches = 0;
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i][0] == item) {

                let matches2 = 0;
                for (let j = 0; j < this.data[0].length; j++) {
                    if (this.data[0][j] == row) {

                        this.data[i][j] = val;

                        matches2 ++;
                        break;
                    }
                }

                if (matches2 == 0) {
                    console.log("The selected row is not available")
                }

                matches ++;
                break;
            }
        }
        if (matches == 0) {
            console.log("The selected item is not available")
        }
    }
    get (item, row) {
        let matches = 0;
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i][0] == item) {

                if (row != undefined) {
                    let matches2 = 0;
                    for (let j = 0; j < this.data[0].length; j++) {
                        if (this.data[0][j] == row) {

                            return this.data[i][j];

                            matches2 ++;
                            break;
                        }
                    }
                    if (matches2 == 0) {
                        console.log("The selected row is not available")
                    }
                } else {
                    return this.data[i];
                }

                matches ++;
                break;
            }
        }
        if (matches == 0) {
            console.log("The selected item is not available")
        }
    }
    del (item, row) {
        let matches = 0;
        for (let i = 0; i < this.data.length; i++) {
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
                        console.log("The selected row is not available")
                    }
                } else {
                    this.data.splice(i, 1);
                }

                matches ++;
                break;
            }
        }
        if (matches == 0) {
            console.log("The selected item is not available")
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
        console.log("The selected database does not exist")
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
            console.log("The selected database does not exist")
        }
    }
}
module.exports.loaddb = function(name) {
    if (name) {
        if (fs.existsSync(path.join(path.join(__dirname, "krakendb"), name + ".json"))) {
            dbs.push(new db(null, null, JSON.parse(fs.readFileSync(path.join(path.join(__dirname, "krakendb"), name + ".json")))));
        } else {
            console.log("database doesn't exist");
        }
    } else {
        console.log("Please specify a database name (without extension)");
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
