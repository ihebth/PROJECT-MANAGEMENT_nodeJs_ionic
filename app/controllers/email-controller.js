var config = require('../../config');
var mailgun = require('mailgun-js')({apiKey: config.mailgun.apiKey, domain: config.mailgun.domain});
var ejs = require('ejs');
var fs = require('fs');
var path = require('path');

var jsonPathStyle = path.join(__dirname, '..', 'templates', 'email_style.html');
var css = fs.readFileSync(jsonPathStyle, 'utf8');

exports.sendWelcomeEmail = function (user) {
    sendEmail('Welcome!', user, 'welcome');
}

exports.sendResetPasswordEmail = function (user, pw) {
    user.pw = pw;
    sendEmail('Password recovery', user, 'lost_pw');
}

exports.sendNewTaskEmail = function(user, task) {
    let additional = { task: task };
    sendEmail('Task assigned', user, 'new_task', additional);
}

exports.sendInvitationEmail = function (user, board) {
    let additional = { board: board };
    sendEmail('You have been invited!', user, 'invitation', additional);
}

function sendEmail(subject, user, template_name, additional_data) {
    var jsonPath = path.join(__dirname, '..', 'templates', template_name + '.html');
    var template = fs.readFileSync(jsonPath, 'utf8');

    var options = { user: user, subject: subject, style: css};

    if (additional_data && additional_data !== undefined) {
        options = Object.assign(options, additional_data);
    }

    var text = ejs.render(template, options);

    var data = {
        from: 'iheb <iheb.thlithi@gmail.com>',
        to: 'iheb.th@outlook.fr',
        subject: subject,
        html: text
    };

    mailgun.messages().send(data, function(error, body) {
        console.log('body: ', body);
    })
};