const notFoundHandler = (req, res, next) => {
    const error = new Error("Not Found.");
    error.status = 404;
    return next(error);
};

export default notFoundHandler;