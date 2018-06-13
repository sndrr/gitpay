'use strict'

const express = require('express');
const cors = require('cors');
const sslRedirect = require('heroku-ssl-redirect');
const app = express();
const session = require('express-session')
const bodyParser = require('body-parser');
const loading = require('./loading/loading');
const passport = require('passport');
const passportConfig = require('./config/passport');
const load = require('./modules/load/load');
const feed = require('feed-read');

if(process.env.NODE_ENV != 'production') {
  app.use(cors());
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SECRET_PHRASE
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(sslRedirect())

app.set('port', (process.env.PORT || 3000));

app.use(express.static(__dirname + '/frontend/public/'));

app.get('/octos', function (req, res) {

    feed("http://feeds.feedburner.com/Octocats", (err, articles) => {
        if (err) throw err;

        console.log(articles);

    });

    return res.json({

    }).end();
});

load.init(app);

app.listen(app.get('port'), () => {
    console.log('Node app is running on port', app.get('port'));
});

module.exports = app
