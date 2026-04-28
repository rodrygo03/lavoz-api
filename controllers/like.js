import {db} from "../connect.js";
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
    const q = "INSERT INTO likes(`userId`, `postId`, `reaction`) VALUES (?)";
    const values = [
        req.user.id,
        req.body.postId,
        req.body.reaction
    ];

    db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        sendLikeNotification(req.body.postUserId, req.user.id, data.insertId, req.body.postId);
        return res.status(200).json("Post has been liked.");
    });
};

export const addShortLike = (req, res) => {
    const q = "INSERT INTO short_likes(`userId`, `shortId`, `reaction`) VALUES (?)";
    const values = [
        req.user.id,
        req.body.shortId,
        req.body.reaction
    ];

    db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Short has been liked.");
    });
};

const sendLikeNotification = (postUserId, userId, id, postId) => {
    const notificationQ = "INSERT INTO notifications(`type`, `userTo`, `userFrom`, `objectId`, `createdAt`, `postId`) VALUES (?)";
    const notificationValues = ['reaction', postUserId, userId, id, moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"), postId];

    db.query(notificationQ, [notificationValues], (err, data) => {
        if (err) console.error("Error creating notification:", err);
        return;
    });
};

export const deleteLike = (req, res) => {
    const q = "DELETE FROM likes WHERE `userId` = ? AND `postId` = ?";

    db.query(q, [req.user.id, req.query.postId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Post has been disliked.");
    });
};

export const deleteShortLike = (req, res) => {
    const q = "DELETE FROM short_likes WHERE `userId` = ? AND `shortId` = ?";

    db.query(q, [req.user.id, req.query.shortId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Short has been disliked.");
    });
};
