const errorHandler = (err, req, res, next) => {
    console.log('Error : ', err.stack)
    res.status(500).json({
        success: false,
        message: err.message
    })
}

module.exports = errorHandler