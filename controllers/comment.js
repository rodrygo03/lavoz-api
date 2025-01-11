import {db} from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getComments = (req, res) => {
    const q = `SELECT c.*, u.id AS userId, username, profilePic FROM comments AS c JOIN users AS u ON (u.id = c.userId)
      WHERE c.postId = ? ORDER BY c.createdAt DESC`;
    
    db.query(q, [req.query.postId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
};

export const getCommentDesc = (req, res) => {
  const q = `SELECT \`desc\` FROM comments WHERE id = ?`;
  const commentId = parseInt(req.query.commentId, 10);

  db.query(q, [commentId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
  });
}

export const addComment = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "ascxvdfTuwerj4529asdf!/-adsf", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    const q = "INSERT INTO comments(`desc`, `createdAt`, `userId`, `postId`, `gif`) VALUES (?)";
    const values = [
      req.body.desc,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
      req.body.postId,
      req.body.gif
    ];
    
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      const commentId = data.insertId;
      sendCommentNotif(req.body.postUserId, userInfo.id, commentId, req.body.postId);
      return res.status(200).json("Comment has been created.");
    });
  });
};
// Notification Logic
const sendCommentNotif = (postUserId, userId, commentId, postId) => {
  const notificationQ = "INSERT INTO notifications(`type`, `userTo`, `userFrom`, `objectId`, `createdAt`, `postId`) VALUES (?)";
  const notificationValues = ['comment', postUserId, userId, commentId, moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"), postId];

  db.query(notificationQ, [notificationValues], (err, data) => {
      if (err) console.error("Error creating comment notification:", err);
      return;
  });
};
  