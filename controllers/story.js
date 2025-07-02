import {db} from "../connect.js"
import moment from "moment"
import jwt from "jsonwebtoken";

export const getStories = (req, res) => {
    const userId = req.query.userId;
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");
  
    jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");
      const q = `SELECT s.*, u.id AS userId, username, profilePic FROM stories AS s 
      JOIN users AS u ON (u.id = s.userId)
      LEFT JOIN relationships AS r ON (s.userId = r.followedUserId) WHERE (r.followerUserId = ? OR s.userId = ?) AND s.createdAt >= DATE_SUB(NOW(), INTERVAL 24 HOUR) 
      ORDER BY s.createdAt DESC`
  
      const values = [userInfo.id, userInfo.id];
  
      db.query(q, values, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
      });
    });
}
// export const getStories = (req, res) => {
//   const userId = req.query.userId;
//   const token = req.cookies.accessToken;

//   // Initialize query and values for database query
//   let q;
//   let values;

//   // Check if token is present
//   if (token) {
//     // If token is present, verify it to get user info
//     jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
//       if (err) {
//         // If token verification fails, return 403 status
//         console.error("Error verifying token:", err);
//         return res.status(403).json("Token is not valid!");
//       } else {
//         // If token verification is successful, construct query and values to filter stories based on followed users
//         q = `SELECT s.*, u.id AS userId, name, profilePic FROM stories AS s 
//           JOIN users AS u ON (u.id = s.userId)
//           LEFT JOIN relationships AS r ON (s.userId = r.followedUserId) WHERE (r.followerUserId = ? OR s.userId = ?) AND s.createdAt >= DATE_SUB(NOW(), INTERVAL 24 HOUR) 
//           ORDER BY s.createdAt DESC`;
//         values = [userInfo.id, userInfo.id];
//       }
//     });
//   } else {
//     // If token is not present, return 401 status (you can customize this as needed)
//     return res.status(401).json("Not logged in!");
//   }
// }
  
  export const addStory = (req, res) => {
      const token = req.cookies.accessToken;
      if (!token) return res.status(401).json("Not logged in!");
    
      jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");
    
        const q =
          "INSERT INTO stories(`img`, `createdAt`, `userId`) VALUES (?)";
        const values = [
          req.body.img,
          moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
          userInfo.id,
        ];
    
        db.query(q, [values], (err, data) => {
          if (err) return res.status(500).json(err);
          return res.status(200).json("Story has been created.");
        });
      });
  };
  
  export const deleteStory = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");
  
    jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");
  
      const q =
        "DELETE FROM stories WHERE `id`=? AND `userId` = ?";
  
      db.query(q, [req.params.id, userInfo.id], (err, data) => {
        if (err) return res.status(500).json(err);
        if(data.affectedRows>0) return res.status(200).json("Story has been deleted.");
        return res.status(403).json("You can delete only your story")
      });
    });
  };