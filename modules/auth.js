const crypto = require('crypto');

const genPassword = (password) => {
    return crypto
        .createHash('sha512')
        .update(password)
        .digest('hex');
};

const checkAuth = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
};


const checkAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.isAdmin) {
        next();
    } else {
        req.flash('error', 'Nincs jogosultságod megtekinteni ezt az oldalt!');
        res.redirect('/');
    }
};

module.exports = {
    genPassword,
    checkAuth,
    checkAdmin,
};
