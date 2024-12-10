// Helper function
const factoryResponse = (status, message) => ({ status, message });

export const isAuthenticated = (req, res, next) => {
    return req.isAuthenticated()
        ? next()
        : res.status(401).json(factoryResponse(401, "Unauthorized"));
};

//Might add role authorization checking later.