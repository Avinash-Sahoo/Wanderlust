const wrapAsync = function (fun) {
    return function (req, res, next) {
        return fun(req, res, next).catch(next)
    }
}

module.exports = wrapAsync