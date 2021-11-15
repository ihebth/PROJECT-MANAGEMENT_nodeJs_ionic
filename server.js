var bodyParser = require('body-parser'),
    config = require('./config'),
    cors = require('cors'),
    express = require('express'),
    helmet = require('helmet'),
    http = require('http'),
    mongoose = require('mongoose'),
    morgan = require('morgan'),
    winston = require('winston'),
    passport = require('passport'),
    JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt,
    User = require('./app/models/user');

//
// CONFIGURATION
//
var app = express();

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());


// Passport Setup
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.jwtSecret;

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.findById(jwt_payload.id, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
}));

app.use(passport.initialize());

const logger = winston.createLogger({
  level: 'info',
  transports: [
    // - Write to all logs with level `info` and below to `combined.log` 
    // - Write all logs error (and below) to `error.log`.
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (config.env !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}
module.exports = logger;

//
// APP
//
var port = config.port;

app.use(require('./app/routes/routes.js'));

app.listen(port, function (err) {
    logger.info('listening in http://localhost:' + port);
});

//
// MONGODB
//
mongoose.Promise = global.Promise;
mongoose.connect(config.db);

mongoose.connection.on('error', (err) => {
    logger.error(err);
    logger.info('MongoDB connection error. Please make sure MongoDB is running.');
    process.exit();
});