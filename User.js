const queryDB = require('./db');
const { hash, compare } = require('bcrypt');
const jwt = require('./jwt');

class User {
    constructor(username, password, fullname, email, phone) {
        this.username = username;
        this.password = password;
        this.fullname = fullname;
        this.email = email;
        this.phone = phone;
    }

    static getUserFromToken(token) {
        let userInfo;
        return getObject(token)
            .then(obj => {
                const { UserName, Email, FullName, Phone } = obj;
                userInfo = { UserName, Email, FullName, Phone };
                return getToken(userInfo);
            })
            .then(token => {
                userInfo.token = token;
                return userInfo;
            });
    }

    async signIn() {
        const sql = "SELECT * FROM tblUser WHERE UserName = ?";
        const result = await queryDB(sql, [this.username]);
        if (!result) throw new Error('Tai khoan khong ton tai!');
        const crypt = await compare(this.password, result[0].Password);
        if (!crypt) throw new Error('Mat khau khong chinh xac');
        const { UserName, Email, FullName, Phone } = result[0];
        const kq = { UserName, Email, FullName, Phone }
        const token = await jwt.getToken(kq);
        if (!token) throw new Error('Loi TOKEN!');
        kq.token = token;
        return kq;
    }

    async signUp() {
        const sql = "INSERT INTO tblUser(UserName, Password, FullName, Email, Phone) VALUES (?, ?, ?, ?, ?)";
        const result = await hash(this.password, 8);
        return await queryDB(sql, [this.username, result, this.fullname, this.email, this.phone]);
    }
}

// const user = new User('test', '123', 'Hoang', 'hoang@gmail.com', '016236345784');
// user.signUp()
//     .then(() => console.log('Thanh cong'))
//     .catch(err => console.log(err));

// const user = new User('admin', '123', 'Hoang', 'hoang@gmail.com', '016236345784');
// user.signIn()
//     .then((result) => console.log(result))
//     .catch(err => console.log(err));

module.exports = User;