const requestLogger = (req, res, next) => {
    const userId = req.user?._id || "anonymous";

    console.log({
        userId,
        timestamp: new Date().toISOString(),
        path: req.originalUrl,
        method: req.method,
    });

    next();
};

export default requestLogger