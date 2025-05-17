import jwt from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config()

export const createTokens = (user) => {
    const accessToken = jwt.sign(
        { username: user.username, id: user.id }, 
        process.env.JWT_SECRET
    );

    return accessToken;
};

// export const validateToken = (req, res, next) => {
//     const accessToken = req.cookies["accessToken"];

//     if (!accessToken) {
//         return res.status(400).json({error: "User not authenticated!"});
//     }

//     try {
//         const validToken = jwt.verify(accessToken, process.env.JWT_SECRET);
//         if (validToken) {
//             req.authenticated = true;
//             return next()
//         }
//     } catch(err) {
//         return res.status(400).json({error: err}); 
//     }
// }