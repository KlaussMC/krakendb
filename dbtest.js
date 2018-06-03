var db = require('./index')

// if (db.dbexists('test'))
// 	db.loaddb('test')
// else{
// 	db.newdb('test', ['arg1', 'arg2'])
// 	db.exportdb();
// }

db.loaddb('user')

db.print();
// db.push('KlaussMC', ['jakieschneider13@gmail.com', 'Klauss_net1', []])
// db.exportdb();
// db.push('entry', ['row1', 'row2'])

db.print();