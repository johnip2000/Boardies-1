const sql = require('mssql/msnodesqlv8')

const config = {
    database: 'Boardies',
    server: 'DESKTOP-EERPVD9\\SQL2019',
    driver: 'msnodesqlv8',
    options: {
        trustedConnection: true
    }
};

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