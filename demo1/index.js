var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;

var config = {
    userName: 'aaron',
    password: 'q999999Q',
    server: 'aaron-db-server.database.windows.net',
    // If you are on Microsoft Azure, you need this:  
    options: { encrypt: true, database: 'aaron-db-1' }
};
var connection = new Connection(config);

var showMessages = '';

function testQuery() {
    request = new Request("SELECT * FROM users_info", function (err) {
        if (err) {
            console.log(err);
        }
    });
    var result = "";
    request.on('row', function (columns) {
        columns.forEach(function (column) {
            if (column.value === null) {
                console.log('NULL');
            } else {
                result += column.value + " ";
            }
        });
        console.log(result);
        showMessages = result;
        result = "";
    });

    request.on('done', function (rowCount, more) {
        console.log(rowCount + ' rows returned');
    });
    connection.execSql(request);
}

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    connection.on('connect', function (err) {
        console.log("Connected");
        testQuery();
    });

    if (req.query.name || (req.body && req.body.name)) {
        context.res = {
            status: 200,
            body: "Demo1 Hello " + showMessages
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        };
    }
    context.done();
};