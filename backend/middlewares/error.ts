import logger from '../helpers/loggers/logger';
class JSONParseError extends SyntaxError {
    status: number;
}

module.exports = function (err, req, res, next) {
    logger.error(err.message, err);
    console.error(`${err.message}`);
    if (err as JSONParseError instanceof SyntaxError && err.status === 400) {
        return res.status(400).json({
            "status": "FAILURE",
            statusCode: 400,
            error: {
                code: "INVALID_JSON",
                message: "The body of your request is not valid JSON."
            },
            message: "Something went wrong."
        });
    }
    res.status(500).json({
        "status": "FAILURE", statusCode: 500, message: "Something went wrong."
    });
}