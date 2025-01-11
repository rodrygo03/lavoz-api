import {db} from "../connect.js";
import moment from "moment";
import jwt from "jsonwebtoken";

export const getNotifications = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "ascxvdfTuwerj4529asdf!/-adsf", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    const q = `SELECT n.*, u.id AS userId, username, profilePic FROM notifications AS n JOIN users AS u ON (u.id = n.userFrom) WHERE userTo = ? ORDER BY createdAt DESC LIMIT 30;`;
    db.query(q, [userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const getNewNotifications = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");
  jwt.verify(token, "ascxvdfTuwerj4529asdf!/-adsf", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    const q = `SELECT * FROM notifications WHERE new = 1 AND userTo = ?`;
    db.query(q, [userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const getFollowNotif = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "ascxvdfTuwerj4529asdf!/-adsf", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    const q = `SELECT * FROM relationships WHERE id = ?`;
    db.query(q, [req.query.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

export const getLikeNotif = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");
  
    jwt.verify(token, "ascxvdfTuwerj4529asdf!/-adsf", (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");
      const q = `SELECT * FROM likes WHERE id = ?`;
      db.query(q, [req.query.id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
      });
    });
};

export const getCommentNotif = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");
  
    jwt.verify(token, "ascxvdfTuwerj4529asdf!/-adsf", (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");
      const q = `SELECT * FROM comments WHERE id = ?`;
      db.query(q, [req.query.id], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
      });
    });
};

export const clearNotifAlert = (req, res) => {
    const q =
      "UPDATE notifications SET new = ? WHERE id = ?";
    const values = [
      0,
      req.body.id
    ];
    
    db.query(q, values, (err, data) => {
      if (err) {
          console.error("Error clearing notif alert:", err);
          return res.status(500).json("Error updating notification.");
      } 
      else {
          return res.status(200).json("Notification alert cleared successfully.");
      }
    });
};