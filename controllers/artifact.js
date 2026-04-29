import { db } from "../connect.js";
import moment from "moment";

const now = () => moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

// POST /api/escrows/:id/submit
// Stores the artifact record and transitions the escrow to submitted in one operation.
export const submitArtifact = (req, res) => {
    const escrowId = req.params.id;
    const { fileUrl, description } = req.body;

    if (!fileUrl) return res.status(400).json({ error: "fileUrl is required." });

    db.query("SELECT * FROM escrows WHERE id = ?", [escrowId], (err, data) => {
        if (err) return res.status(500).json(err);
        if (!data || data.length === 0) return res.status(404).json({ error: "Escrow not found." });

        const escrow = data[0];

        if (escrow.studentId !== req.user.id) return res.status(403).json({ error: "Forbidden." });
        if (escrow.status !== "active") return res.status(409).json({ error: "Only active escrows can be submitted." });

        const ts = now();

        const artifactQ = "INSERT INTO artifacts(`escrowId`, `studentId`, `fileUrl`, `description`, `createdAt`) VALUES (?)";
        const artifactValues = [escrowId, req.user.id, fileUrl, description ?? null, ts];

        db.query(artifactQ, [artifactValues], (err, artifactData) => {
            if (err) return res.status(500).json(err);

            db.query(
                "UPDATE escrows SET status = 'submitted', submittedAt = ? WHERE id = ?",
                [ts, escrowId],
                (err) => {
                    if (err) return res.status(500).json(err);
                    return res.status(201).json({ id: artifactData.insertId });
                }
            );
        });
    });
};

// GET /api/artifacts/:escrowId
// Returns all artifacts for an escrow. Only participants and admins may view.
export const getArtifactsByEscrow = (req, res) => {
    const escrowId = req.params.escrowId;

    db.query("SELECT studentId, localId FROM escrows WHERE id = ?", [escrowId], (err, data) => {
        if (err) return res.status(500).json(err);
        if (!data || data.length === 0) return res.status(404).json({ error: "Escrow not found." });

        const escrow = data[0];
        const uid = req.user.id;
        const isParticipant = escrow.studentId === uid || escrow.localId === uid;

        if (req.user.account_type !== "admin" && !isParticipant) {
            return res.status(403).json({ error: "Forbidden." });
        }

        const q = `
            SELECT a.*, u.username, u.profilePic
            FROM artifacts AS a
            JOIN users AS u ON (u.id = a.studentId)
            WHERE a.escrowId = ?
            ORDER BY a.createdAt DESC
        `;
        db.query(q, [escrowId], (err, artifacts) => {
            if (err) return res.status(500).json(err);
            return res.status(200).json(artifacts);
        });
    });
};

// DELETE /api/artifacts/:id
// Student (owner) may delete only while the escrow is still active.
export const deleteArtifact = (req, res) => {
    db.query(
        "SELECT a.*, e.status AS escrowStatus FROM artifacts AS a JOIN escrows AS e ON (e.id = a.escrowId) WHERE a.id = ?",
        [req.params.id],
        (err, data) => {
            if (err) return res.status(500).json(err);
            if (!data || data.length === 0) return res.status(404).json({ error: "Artifact not found." });

            const artifact = data[0];

            if (artifact.studentId !== req.user.id) return res.status(403).json({ error: "Forbidden." });
            if (artifact.escrowStatus !== "active") return res.status(409).json({ error: "Artifacts can only be deleted while the escrow is active." });

            db.query("DELETE FROM artifacts WHERE id = ?", [req.params.id], (err) => {
                if (err) return res.status(500).json(err);
                return res.status(200).json("Artifact deleted.");
            });
        }
    );
};
