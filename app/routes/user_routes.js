var express = require('express');
var router = express.Router();
var userCtrl = require('../controllers/user-controller');
var passport = require('passport');

router.post('/', userCtrl.addUser);
router.post('/login', userCtrl.loginUser);
router.post('/reset', userCtrl.resetUserPw);

router.put('/', passport.authenticate('jwt', { session: false }), userCtrl.updateUser);
router.delete('/', passport.authenticate('jwt', { session: false }), userCtrl.deleteUser);
router.get('/', passport.authenticate('jwt', { session: false }), userCtrl.getUser);

module.exports = router;