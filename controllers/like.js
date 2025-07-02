import {db} from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getLikes = (req,res) => {
    const q = "SELECT userId, reaction FROM likes WHERE postId = ?";
    
    db.query(q, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
    });
};

export const getShortLikes = (req, res) => {
    const q = "SELECT userId, reaction FROM short_likes WHERE shortId = ?";
    db.query(q, [req.query.shortId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
}

export const getReaction = (req,res) => {
    const q = `SELECT \`reaction\` FROM likes WHERE id = ?`;
    const reactionId = parseInt(req.query.reactionId, 10);

    db.query(q, [reactionId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
}

export const addLike = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");
        const q = "INSERT INTO likes(`userId`, `postId`, `reaction`) VALUES (?)";
        const values = [
            userInfo.id,
            req.body.postId,
            req.body.reaction
        ];
        
        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            // Trigger notification logic
            sendLikeNotification(req.body.postUserId, userInfo.id, data.insertId, req.body.postId);
            return res.status(200).json("Post has been liked.");
        });
    });
};

export const addShortLike = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");
        const q = "INSERT INTO short_likes(`userId`, `shortId`, `reaction`) VALUES (?)";
        const values = [
            userInfo.id,
            req.body.shortId,
            req.body.reaction
        ];
        
        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            // Trigger notification logic
            //sendLikeNotification(req.body.shortUserId, userInfo.id, data.insertId, req.body.shortId);
            return res.status(200).json("Short has been liked.");
        });
    });
};

// Notification Logic
const sendLikeNotification = (postUserId, userId, id, postId) => {
    const notificationQ = "INSERT INTO notifications(`type`, `userTo`, `userFrom`, `objectId`, `createdAt`, `postId`) VALUES (?)";
    const notificationValues = ['reaction', postUserId, userId, id, moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"), postId];

    db.query(notificationQ, [notificationValues], (err, data) => {
        if (err) console.error("Error creating notification:", err);
        return;
    });
};
// const deleteNotification = (userId, postId) => {
//     const deleteNotificationQ = "DELETE FROM notifications WHERE `userTo` = ? AND `postId` = ?";
//     const deleteNotificationValues = [userId, postId];

//     db.query(deleteNotificationQ, deleteNotificationValues, (err, data) => {
//         if (err) console.error("Error deleting notification:", err);
//         return;
//     });
// };

// const sendShortLikeNotification = (shortUserId, userId, id, shortId) => {
//     const notificationQ = "INSERT INTO notifications(`type`, `userTo`, `userFrom`, `objectId`, `createdAt`, `postId`) VALUES (?)";
//     const notificationValues = ['reaction', postUserId, userId, id, moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"), postId];

//     db.query(notificationQ, [notificationValues], (err, data) => {
//         if (err) console.error("Error creating notification:", err);
//         return;
//     });
// };

export const deleteLike = (req, res) => {

    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");
  
    jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");
  
      const q = "DELETE FROM likes WHERE `userId` = ? AND `postId` = ?";
  
      db.query(q, [userInfo.id, req.query.postId], (err, data) => {
        if (err) return res.status(500).json(err);
        // deleteNotification(userInfo.id, req.query.postId);
        return res.status(200).json("Post has been disliked.");
      });
    });
};

export const deleteShortLike = (req, res) => {

    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");
  
    jwt.verify(token, process.env.JWT_SECRET, (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");
  
      const q = "DELETE FROM short_likes WHERE `userId` = ? AND `shortId` = ?";
  
      db.query(q, [userInfo.id, req.query.shortId], (err, data) => {
        if (err) return res.status(500).json(err);
        // deleteNotification(userInfo.id, req.query.postId);
        return res.status(200).json("Short has been disliked.");
      });
    });
};