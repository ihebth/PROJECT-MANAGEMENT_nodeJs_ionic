var Board = require('../models/board');
var Invitation = require('../models/invitation');
var User = require('../models/user');
var emailCtrl = require('./email-controller');

exports.inviteUser = function (req, res) {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json(err);
        }

        if (user.boards.indexOf(req.params.boardId) > -1) {
            return res.status(400).json({msg: 'User is already part of this board!'});
        }

        let newInvitation = Invitation();
        newInvitation.from = req.user.id;
        newInvitation.board = req.params.boardId;
        newInvitation.to = user.id;

        newInvitation.save((err, invitation) => {
            if (err) {
                return res.status(400).json(err);
            }

            Invitation.findById(invitation._id)
            .populate([{ 'path': 'board' }])
            .populate([{ 'path': 'to', 'select': 'email first_name' }])
            .exec((err , invitation) => {
                if (err) {
                    return res.status(400).json(err);
                }

                emailCtrl.sendInvitationEmail(invitation.to, invitation.board);
                res.json(invitation);
            });
        });
    });
}

exports.getMyInvitations = function (req, res) {
    Invitation.find({ to: req.user.id})
    .populate([{ 'path': 'board', select: 'name desc' }])
    .populate([{ 'path': 'from', 'select': 'email first_name last_name' }])
    .exec((err , invitations) => {
        if (err) {
            return res.status(400).json(err);
        }

        res.json(invitations);
    });
}

exports.answerInvitation = function (req, res) {
    let accepeted = req.params.accept;

    Invitation.findByIdAndRemove(req.params.id, (err, invitation) => {
        if (accepeted == 1) {
            Board.findByIdAndUpdate(invitation.board, { $addToSet: { users: invitation.to }}, {new: true}, (err, board) => {
                if (err) {
                    return res.status(400).json(err);
                }
                User.findByIdAndUpdate(invitation.to, { $addToSet: { boards: board }}).exec();
                return res.json(board);
            });
        } else {
            res.json(null);
        }
    });
}