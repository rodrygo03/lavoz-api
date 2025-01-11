import jwt from "jsonwebtoken";

export const createTokens = (user) => {
    const accessToken = jwt.sign(
        { username: user.username, id: user.id }, 
        "ascxvdfTuwerj4529asdf!/-adsf"
    );

    return accessToken;
};

// export const validateToken = (req, res, next) => {
//     const accessToken = req.cookies["accessToken"];

//     if (!accessToken) {
//         return res.status(400).json({error: "User not authenticated!"});
//     }

//     try {
//         const validToken = jwt.verify(accessToken, "ascxvdfTuwerj4529asdf!/-adsf");
//         if (validToken) {
//             req.authenticated = true;
//             return next()
//         }
//     } catch(err) {
//         return res.status(400).json({error: err}); 
//     }
// }