import {db} from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getMessages = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");
  
  jwt.verify(token, "ascxvdfTuwerj4529asdf!/-adsf", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    const q = `
      SELECT m.*, u.id AS userId, name, profilePic
      FROM messages AS m JOIN users AS u ON (u.id = m.msgFrom)
      WHERE (msgFrom = ? AND msgTo = ?)
        OR (msgTo = ? AND msgFrom = ?)
      ORDER BY createdAt
      LIMIT 100;
    `;
    const params = [userInfo.id, req.query.userId, userInfo.id, req.query.userId];

    db.query(q, params, (err, data) => {
      if (err) {
        console.error("Error executing SQL query:", err);
        return res.status(500).json(err);
      }

      // if (!data || data.length === 0) {
      //   return res.status(204).json("No messages found.");
      // }

      return res.status(200).json(data);
    });
  });
};

export const getNewMessages = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");
  jwt.verify(token, "ascxvdfTuwerj4529asdf!/-adsf", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    const q = `SELECT * FROM messages WHERE \`read\` = 0 AND msgTo = ?`;
    db.query(q, [userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const markAsRead = (req, res) => {
  const q =
    "UPDATE messages SET \`read\` = ? WHERE id = ?";
  const values = [
    1,
    req.body.id
  ];
  
  db.query(q, values, (err, data) => {
    if (err) {
        console.error("Error clearing msg alert:", err);
        return res.status(500).json("Error updating msg notification.");
    } 
    else {
        return res.status(200).json("Message alert cleared successfully.");
    }
  });
};

export const getAllMessages = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "ascxvdfTuwerj4529asdf!/-adsf", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const currentUserId = userInfo.id; // Assuming the user ID is stored in the 'id' property of userInfo
    const q = `
        SELECT
            u.id AS user_id,
            u.username AS user_username,
            u.name AS user_name,
            u.profilePic AS user_profile_pic,
            m.latest_message_time,
            m.latest_message_content,
            m.latest_message_read,
            m.latest_message_to
        FROM
            users u
            JOIN
            (
                SELECT
                    LEAST(msgFrom, msgTo) AS user_a,
                    GREATEST(msgFrom, msgTo) AS user_b,
                    MAX(createdAt) AS latest_message_time,
                    SUBSTRING_INDEX(GROUP_CONCAT(msg ORDER BY createdAt DESC), ',', 1) AS latest_message_content,
                    SUBSTRING_INDEX(GROUP_CONCAT(\`read\` ORDER BY createdAt DESC), ',', 1) AS latest_message_read,
                    SUBSTRING_INDEX(GROUP_CONCAT(msgTo ORDER BY createdAt DESC), ',', 1) AS latest_message_to
                FROM messages
                WHERE ? IN (msgFrom, msgTo)
                GROUP BY user_a, user_b
            ) AS m
            ON u.id IN (m.user_a, m.user_b) AND u.id != ?
        ORDER BY
            m.latest_message_time DESC;
      `;

    db.query(q, [currentUserId, currentUserId], (err, data) => {
      if (err) {
        console.error("Error executing SQL query:", err);
        return res.status(500).json(err);
      }

      // Check if data is undefined or empty
      if (!data || data.length === 0) {
        // If no messages are found, return a 204 No Content status
        return res.status(204).json("No messages found.");
      }

      return res.status(200).json(data);
    });
  });
};

export const addMessage = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "ascxvdfTuwerj4529asdf!/-adsf", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    const q = "INSERT INTO messages(`msg`, `createdAt`, `msgTo`, `msgFrom`) VALUES (?)";
    const values = [
      req.body.msg,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      req.body.msgTo,
      userInfo.id,
    ];
    
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      // const commentId = data.insertId;
      // sendCommentNotif(req.body.postUserId, userInfo.id, commentId, req.body.postId);
      return res.status(200).json("Message has been sent.");
    });
  });
};
// // Notification Logic
// const sendMessageNotif = (postUserId, userId, commentId, postId) => {
//   const notificationQ = "INSERT INTO notifications(`type`, `userTo`, `userFrom`, `objectId`, `createdAt`, `postId`) VALUES (?)";
//   const notificationValues = ['comment', postUserId, userId, commentId, moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"), postId];

//   db.query(notificationQ, [notificationValues], (err, data) => {
//       if (err) console.error("Error creating comment notification:", err);
//       return;
//   });
// };
  