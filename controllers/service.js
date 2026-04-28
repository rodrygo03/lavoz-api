import { db } from "../connect.js";

export const getServices = (req, res) => {
    const q = `
        SELECT s.id, s.userId, u.username, u.profilePic, u.university,
               s.title, s.description, s.skills, s.availability, s.createdAt
        FROM services AS s
        JOIN users AS u ON (u.id = s.userId)
        ORDER BY s.createdAt DESC
    `;
    db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
    });
};

export const createService = (req, res) => {
    const q = "INSERT INTO services(`userId`, `title`, `description`, `skills`, `availability`) VALUES (?)";
    const values = [
        req.user.id,
        req.body.title,
        req.body.description,
        req.body.skills ?? null,
        req.body.availability ?? null,
    ];
    db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(201).json({ id: data.insertId });
    });
};

export const deleteService = (req, res) => {
    // Owner or admin may delete
    db.query("SELECT userId FROM services WHERE id = ?", [req.params.id], (err, data) => {
        if (err) return res.status(500).json(err);
        if (!data || data.length === 0) return res.status(404).json({ error: "Service not found." });

        const isOwner = data[0].userId === req.user.id;
        const isAdmin = req.user.account_type === "admin";

        if (!isOwner && !isAdmin) return res.status(403).json({ error: "Not allowed." });

        db.query("DELETE FROM services WHERE id = ?", [req.params.id], (err) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json("Service deleted.");
        });
    });
};
