var sql = require('mssql');
const config = {user: 'Rhyan1', password: 'jack', server: 'localhost', port: '4001', database: 'DAT', options: {encrypt: false}}
const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to MSSQL')
        return pool
    })
    .catch(err => console.log('Database Connection Failed! Bad Config: ', err))
// async function test () {
//     const Username = 'bob';
//     const IsClone = 1;
//     const id = 1;
//     const pool = await poolPromise;
//     const result = await pool.request()
//         .query("SELECT TOP(1) * FROM csvData WHERE ID = "+id+"");
//     const results = result['recordset'][0];
//     if(results['Username1'] != ''){
//         await pool.request().query("INSERT INTO csvData (Username1,IsClone1) VALUES ('"+Username+"',"+IsClone+")");
//     }
//     if(results['Username2'] != ''){
//         await pool.request().query("INSERT INTO csvData (Username2,IsClone2) VALUES ('"+Username+"',"+IsClone+")")
//     }
//     if(results['Username3'] != ''){
//         await pool.request().query("INSERT INTO csvData (Username3,IsClone3) VALUES ('"+Username+"',"+IsClone+")")
//     }
// }
//  test();
module.exports = {
    sql, poolPromise
}