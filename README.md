# krakendb

 - Help! The Readme file doesn't show up on NPMjs.com!!!

The package contains a very basic method of managing what is essentially, a database.

The package can create, read, write and delete content in a very basic manner.

To install the package, type:

    npm install krakendb --save

To use:

    const krakendb = require("krakendb");

To create a database:

    krakendb.newdb();

     - this function takes two arguments, the name of the Database and the names of the rows.
     - The second argument can be an array of strings, if this is the case, all the row names will be named according to the array values.
     - If, however, this is not the case, and instead, an integer is provided, the rows will be named by number.
     - These are the only methods of naming rows. once this is set, this cannot be changed.

To add a new entry to the database:

    krakendb.newEntry();

     - This takes a single argument, the name of the entry.

To set an item:

    krakendb.setItem();

     - This function takes 3 arguments, the entry, item and value in that order.

     - The first argument specifies the entry to reference.
     - The second argument references the item, or the column, if the database is looked at in the form of a table.
     - The third argument is the value that the referenced item will be set to.

To retrieve an item:

    krakendb.getItem();

     - Takes 2 arguments, entry and optionally, item.

     - If only one argument is provided, returns whole entry in Array form
     - if both, returns string with value of referenced value.

To delete an item:

    krakendb.delItem();

     - Takes 2 arguments, entry and optionally, item.

     - If only one argument is provided, deletes whole entry in Array form
     - if both, deletes referenced value.

To switch databases:

    krakendb.activeDB();

     - Takes one argument, database name.

```
    if you find any bugs, please report them to https://github.com/KlaussMC/krakendb. If you wish to contribute, feel free. I would happily accept help.
```
