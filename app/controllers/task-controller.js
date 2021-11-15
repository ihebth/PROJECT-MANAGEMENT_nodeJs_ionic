var Task = require('../models/task');
var Board = require('../models/board');
var User = require('../models/user');
var emailCtrl = require('./email-controller');

exports.addTask = function(req, res) {
    let boardId = req.params.boardId;

    if (!req.body.name || !boardId) {
        return res.status(400).send({"msg": "You must set the name and the board ID of the task"});
    }

    let newTask = Task(req.body);
    newTask.creator = req.user.id;

    newTask.save((err, task) => {
        if (err) {
            return res.status(400).json(err);
        }

        Board.findByIdAndUpdate(boardId, { $push: { tasks: task}}).exec();

        if (task.creator != task.assignee) {
            User.findById(task.assignee, (err, user) => {
                if (user) {
                    emailCtrl.sendNewTaskEmail(user, task);
                }
            });
        }
        res.status(201).json(task);
    });
};

exports.getTask = function(req, res) {
    Task.findById(req.params.id)
    .populate([{'path': 'comments.user', 'select': 'email first_name last_name'}])
    .exec((err, task) => {
        if (err) {
            return res.status(400).json(err);
        }

        res.json(task);
    });
};

exports.updateTask = function(req, res) {
    Task.findByIdAndUpdate(req.params.id, req.body, (err, task) => {
        if (err) {
            return res.status(400).json(err);
        }

        if (task.assignee != req.body.assignee) {
            User.findById(req.body.assignee, (err, user) => {
                if (user) {
                    emailCtrl.sendNewTaskEmail(user, task);
                }
            });
        }

        res.json(task);
    });
};

exports.addComment = function(req, res) {
    req.body.user = req.user.id;
    req.body.created_at = new Date().getTime();

    Task.findByIdAndUpdate(req.params.id, { $push: { comments: req.body}}, { new: true }, (err, task) => {
        if (err) {
            return res.status(400).json(err);
        }

        return res.json(task);
    });
};

exports.addAttachement = function(req, res) { 
    req.body.created_at = new Date().getTime();

    Task.findByIdAndUpdate(req.params.id, { $push: { attachements: req.body}}, { new: true }, (err, task) => {
        if (err) {
            return res.status(400).json(err);
        }

        return res.json(task);
    });
};