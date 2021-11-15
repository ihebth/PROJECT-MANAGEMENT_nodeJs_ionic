var Board = require('../models/board');
var User = require('../models/user');
var Task = require('../models/task');

exports.getBoards = function (req, res) {
    User.findById(req.user.id)
    .populate([{ 'path': 'boards'}])
    .exec((err, user) => {
        if (err) {
            return res.status(400).json(err);
        }
        res.json({boards: user.boards});
    });
};

exports.addBoard = function (req, res) {
    if (!req.body.name || !req.body.desc) {
        return res.status(400).send({"msg": "You must set the name and descripiton of the board!"});
    }
    var newBoard = Board(req.body);
    newBoard.creator = req.user.id;

    newBoard.save((err, board) => {
        if (err || !board) {
            return res.status(400).json(err);
        }

        User.findByIdAndUpdate(req.user.id, { $push: {boards: board} }).exec();
        
        res.status(201).json(board);
    });
};

exports.getBoard = function (req, res) {
    Board.findById(req.params.id)
    .populate([ { 'path': 'tasks', 'select': 'name priority color assignee due_date'}])
    .populate([{ 'path': 'creator', 'select': 'email first_name last_name'}])
    .populate([{ 'path': 'users', 'select': 'email first_name last_name'}])
    .exec((err, board) => {
        if (err) {
            return res.status(400).json(err);
        }
        res.json(board);
    });
};

exports.updateBoard = function (req, res) {
    if (!req.body.name || !req.body.desc) {
        return res.status(400).send({"msg": "You must set the name and descripiton of the board!"});
    }

    Board.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, board) => {
        if (err) {
            return res.status(400).json(err);
        }
        res.json(board);
    });
};

exports.deleteBoard = function (req, res) {
    Board.findByIdAndRemove(req.params.id, (err, board) => {
        if (err) {
            return res.status(400).json(err);
        }

        User.findByIdAndUpdate(req.user.id, { $pull: {boards: board._id} }).exec();

        for (var i = 0; i < board.tasks.length; i++) {
            let oneTask = board.tasks[i];
            Task.findByIdAndRemove(oneTask).exec();
        }

        res.json(board);
    });
};

exports.deleteBoardTask = function (req, res) {
    let taskId = req.params.taskId;

    if (!req.params.id || !taskId) {
        return res.status(400).send({"msg": "You must send the Task ID and Board ID!"});
    }

    Board.findByIdAndUpdate(req.params.id, { $pull: { tasks: taskId} }, (err, board) => {
        if (err) {
            return res.status(400).json(err);
        }
        Task.findByIdAndRemove(taskId, (err, task) => {
            if (err) {
                return res.status(400).json(err);
            }

            res.json(board);
        });
    });
};