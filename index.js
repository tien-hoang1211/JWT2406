const express = require('express');
const jsonParser = require('body-parser').json();
const jwt = require('./jwt');
const User = require('./User');
const app = express();
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('public'));

app.get('/', (req, res) => res.render('home'));
app.post('/signIn', jsonParser, async(req, res) => {
    const { username, password } = req.body;
    const user = new User(username, password);
    try {
        const result = await user.signIn();
        // res.cookie('TOKEN', token);
        res.send({ result: result });
    } catch (err) {
        res.send({ err: 'Loi dang nhap' });
    }
});

app.post('/signInNext', jsonParser, async(req, res) => {
    try {
        if (req.cookies.TOKEN) {
            const username = await jwt.getObject(req.cookies.TOKEN);
            const user = new User(username);
            const result = await user.signIn();
            const token = await jwt.getToken({ username: result.username, email: result.email, fullname: result.fullname });
            res.send({ result: result, token: token });
        } else {
            const { username, password } = req.body;
            const user = new User(username, password);
            const result = await user.signIn();
            const token = await jwt.getToken({ username: result.username, email: result.email, fullname: result.fullname });
            res.cookie('TOKEN', token);
            res.send({ result: result, token: token });
        }
    } catch (err) {
        res.send({ err: 'Loi dang nhap' });
    }
});

app.post('/signUp', jsonParser, async(req, res) => {
    const { username, password, fullname, email, phone } = req.body;
    const user = new User(username, password, fullname, email, phone);
    try {
        await user.signUp();
        res.send('Them moi thanh cong!');
    } catch (err) {
        res.send('Them moi that bai');
    }
});

app.listen(3000, () => console.log('Server started!'));