const pageNotFound = (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Requested page not found, please check url.'
    });
}

module.exports = pageNotFound