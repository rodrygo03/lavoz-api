import {db} from "../connect.js"
import moment from "moment"

export const getStories = (req, res) => {
    const q = `SELECT s.*, u.id AS userId, username, profilePic FROM stories AS s
    JOIN users AS u ON (u.id = s.userId)
    LEFT JOIN relationships AS r ON (s.userId = r.followedUserId) WHERE (r.followerUserId = ? OR s.userId = ?) AND s.createdAt >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
    ORDER BY s.createdAt DESC`

    db.query(q, [req.user.id, req.user.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
}

export const addStory = (req, res) => {
    const q = "INSERT INTO stories(`img`, `createdAt`, `userId`) VALUES (?)";
    const values = [
      req.body.img,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      req.user.id,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Story has been created.");
    });
};

export const deleteStory = (req, res) => {
    const q = "DELETE FROM stories WHERE `id`=? AND `userId` = ?";

    db.query(q, [req.params.id, req.user.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if(data.affectedRows>0) return res.status(200).json("Story has been deleted.");
      return res.status(403).json("You can delete only your story")
    });
};
