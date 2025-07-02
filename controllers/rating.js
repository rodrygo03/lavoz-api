import {db} from "../connect.js";
import jwt from "jsonwebtoken";

export const getRatings = (req,res) => {
    const q = "SELECT * FROM ratings WHERE commentId = ?";
    
    db.query(q, [req.query.commentId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
}

export const addRating = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");
        const q = "INSERT INTO ratings(`userId`, `commentId`, `value`) VALUES (?)";
        const values = [
            userInfo.id,
            req.body.commentId,
            req.body.stars
        ];
        
        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Comment has been rated.");
        });
    });
};

export const deleteRating = (req, res) => {

    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");
  
    jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");
  
      const q = "DELETE FROM ratings WHERE `userId` = ? AND `commentId` = ?";
  
      db.query(q, [userInfo.id, req.query.commentId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Rating has been deleted.");
      });
    });
};
