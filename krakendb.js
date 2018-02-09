class db {
    constructor (name, rows) {
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
