var express = require('express');
var router = express.Router();
var taskCtrl = require('../controllers/task-controller');

router.post('/:boardId', taskCtrl.addTask);
router.get('/:id', taskCtrl.getTask);
router.put('/:id', taskCtrl.updateTask);
router.post('/:id/comments', taskCtrl.addComment)
router.post('/:id/attachements', taskCtrl.addAttachement)

module.exports = router;