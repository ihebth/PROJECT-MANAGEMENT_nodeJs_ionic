var express = require('express');
var passport = require('passport');

var router = express.Router();

router.use('/boards', passport.authenticate('jwt', { session: false }), require('./board_routes'));
router.use('/users', require('./user_routes'));
router.use('/tasks', passport.authenticate('jwt', { session: false }), require('./task_routes'));
router.use('/invitations', passport.authenticate('jwt', { session: false }), require('./invitation_routes'));

module.exports = router;