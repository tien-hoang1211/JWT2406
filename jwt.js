const jwt = require('jsonwebtoken');
const SECRET_KEY = "jbvnbvknfdkgfnblkfnkbfnmfk";

function getObject(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, SECRET_KEY, (err, obj) => {
            if (err) return reject(err);
            resolve(obj);
        });
    });
}

function getToken(obj) {
    return new Promise((resolve, reject) => {
        jwt.sign(obj, SECRET_KEY, { expiresIn: 5000 }, (err, token) => {
            if (err) return reject(err);
            resolve(token);
        });
    });
}

module.exports = { getObject, getToken };