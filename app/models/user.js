var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// Defines the collection Users
var userSchema = new mongoose.Schema({
    email: { type: String, unique: true, lowercase: true },
    password: String,
    first_name: String,
    last_name: String,
    img: String,
    boards: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Board'
        }
    ]
});

/**
 * Hash the password for security.
 * "Pre" is a Mongoose middleware that executes before each user.save() call.
 */
userSchema.pre('save', function (next) {

    var user = this;

    if (!user.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});


/**
* Validate user's password.
* Used by Passport-Local Strategy for password validation.
*/
userSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', userSchema);
