const sql = require('mssql/msnodesqlv8')

const config = {
    database: 'Boardies',
    server: 'DESKTOP-EERPVD9\\SQL2019',
    driver: 'msnodesqlv8',
    options: {
        trustedConnection: true
    }
}
const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to MSSQL')
        return pool
    })
    .catch(err => console.log('Database Connection Failed! Bad Config: ', err))

module.exports = {sql, poolPromise}