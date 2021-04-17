const sql = require('mssql')

const config = {
    user: 'boardies',
    password: 'Cc123456',
    server: 'boardies.database.windows.net', 
    port : 1433,
    database: 'Boardies',
    options: {
        encrypt: true
    }
}

function runQuery(sqlQuery, callback) {
    sql.connect(config, function (err) {
        if (err) console.log(err);
        var request = new sql.Request();
        request.query(sqlQuery, function (err, recordset) {
            if(err) {
                console.log(err);
            }
            callback(recordset); // USING CALLBACK
        });
    });    
};
module.exports = {
    runQuery: runQuery
};