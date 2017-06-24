var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bigshop'
});

function queryDB(sql, arrValue) {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) return reject(new Error('Không thể kết nối đến server!'));
            connection.query(sql, arrValue, (errQuery, results, fields) => {
                // And done with the connection.
                connection.release();
                if (errQuery) return reject(new Error('Lỗi truy vấn dữ liệu!'));
                resolve(results);
            });
        });
    });
}

module.exports = queryDB;


// queryDB('SELECT * FROM tblUser', [])
//     .then(e => console.log(e))
//     .catch(er => console.log(er));

// const pg = require('pg');

// const pool = new pg.Pool({
//     host: 'localhost',
//     port: 5432,
//     database: 'NODE1305',
//     user: 'postgres',
//     password: 'khoapham',
//     max: 10,
//     idleTimeoutMillis: 1000,
// });

// function queryDB(sql, arrValue) {
//     return new Promise((resolve, reject) => {
//         pool.connect((err, client, done) => {
//             if (err) return reject(err);
//             client.query(sql, arrValue, (errQuery, result) => {
//                 done(errQuery);
//                 if (errQuery) return reject(errQuery);
//                 resolve(result);
//             });
//         });
//     });
// }

// module.exports = queryDB;