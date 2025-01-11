import {db} from "../connect.js";
import moment from "moment";
import jwt from "jsonwebtoken";

export const getRelationships = (req,res) => {
    const q = "SELECT followerUserId FROM relationships WHERE followedUserId = ?";
    db.query(q, [req.query.followedUserId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data.map(relationship=>relationship.followerUserId));
    });
}

export const addRelationship = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "ascxvdfTuwerj4529asdf!/-adsf", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");
        const q = "INSERT INTO relationships (`followerUserId`, `followedUserId`) VALUES (?)";
        const values = [
            userInfo.id,
            req.body.userId
        ];
        
        db.query(q, [values], (err, data) => {
            if (err) return res.status(500).json(err);
            // Trigger follow notification
            sendFollowNotification(userInfo.id, req.body.userId, data.insertId);
            return res.status(200).json("Following");
        });
    });
};

export const followUser = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "ascxvdfTuwerj4529asdf!/-adsf", (err, userInfo) => {
        if (err) return res.status(403).json("Token is not valid!");
        const q = "INSERT INTO relationships (`followerUserId`, `followedUserId`) VALUES (?)";
        const values = [
            req.body.followerId,
            req.body.followedId
        ];
        
        db.query(q, [values], (err, data) => {
            console.log("hello")
            if (err) return res.status(500).json(err);
            // Trigger follow notification
            sendFollowNotification(req.body.followerId, req.body.followedId, data.insertId);
            return res.status(200).json("Following");
        });
    });
};

// Notification Logic
const sendFollowNotification = (followerUserId, followedUserId, relationshipId) => {
    const notificationQ = "INSERT INTO notifications (`userTo`, `userFrom`, `type`, `createdAt`, `objectId`) VALUES (?)";
    const notificationValues = [followedUserId, followerUserId, 'follow', moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"), relationshipId];

    db.query(notificationQ, [notificationValues], (err, data) => {
        if (err) console.error("Error creating follow notification:", err);
        return;
    });
};

export const deleteRelationship = (req, res) => {

    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");
  
    jwt.verify(token, "ascxvdfTuwerj4529asdf!/-adsf", (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");
  
      const q = "DELETE FROM relationships WHERE `followerUserId` = ? AND `followedUserId` = ?";
  
      db.query(q, [userInfo.id, req.query.userId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Unfollow");
      });
    });
};

export const unfollowUser = (req, res) => {

    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");
  
    jwt.verify(token, "ascxvdfTuwerj4529asdf!/-adsf", (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");
  
      const q = "DELETE FROM relationships WHERE `followerUserId` = ? AND `followedUserId` = ?";
  
      db.query(q, [req.body.followerId, req.query.followedId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Unfollow");
      });
    });
};