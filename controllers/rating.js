import {db} from "../connect.js";

export const getRatings = (req,res) => {
    const q = "SELECT * FROM ratings WHERE commentId = ?";

    db.query(q, [req.query.commentId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
}

export const addRating = (req, res) => {
    const q = "INSERT INTO ratings(`userId`, `commentId`, `value`) VALUES (?)";
    const values = [
        req.user.id,
        req.body.commentId,
        req.body.stars
    ];

    db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Comment has been rated.");
    });
};

export const deleteRating = (req, res) => {
    const q = "DELETE FROM ratings WHERE `userId` = ? AND `commentId` = ?";

    db.query(q, [req.user.id, req.query.commentId], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Rating has been deleted.");
    });
};
