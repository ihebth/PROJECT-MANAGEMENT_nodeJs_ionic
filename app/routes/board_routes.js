var express = require('express');
var boardCtrl = require('../controllers/board-controller');
var User = require('../models/user');
var router = express.Router();

var ConnectRoles = require('connect-roles');
var user = new ConnectRoles({ async: true });

user.use('boards', req => {
    let userId = req.user.id;

    let promise = new Promise((resolve) => {
        User.findById(userId, 'boards', (err, user) => {
            let index = user.boards.indexOf(req.params.id);
            if (index == -1) {
                return resolve(false);
            } else {
                return resolve(true);
            }
        });
    });
    return promise;
});

router.use(user.middleware());

router.post('/', boardCtrl.addBoard);
router.get('/', boardCtrl.getBoards);
router.get('/:id', user.can('boards'), boardCtrl.getBoard);
router.put('/:id', user.can('boards'), boardCtrl.updateBoard);
router.delete('/:id', user.can('boards'), boardCtrl.deleteBoard);
router.delete('/:id/:taskId', user.can('boards'), boardCtrl.deleteBoardTask);

module.exports = router;