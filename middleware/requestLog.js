const requestLog = (req, res, next) => {
    console.log('Request Log: ', req.method);
    next();
}

module.exports = requestLog