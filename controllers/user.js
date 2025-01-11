import {db} from "../connect.js";
import jwt from "jsonwebtoken";

export const getUser = (req, res) => {
    const userId = req.params.userId;
    const q = "SELECT * FROM users WHERE id=?";
  
    db.query(q, [userId], (err, data) => {
      if (err) return res.status(500).json(err);
      if (!data || data.length === 0) return res.status(500).json("Password undefined");
      const { password, ...info } = data[0];
      return res.json(info);
    });
};
  
export const getAllUsers = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "ascxvdfTuwerj4529asdf!/-adsf", (err, userInfo) => {
    const q = `SELECT * FROM users`;
    db.query(q, (err, data) => {
      if (err) {
        console.error("Error fetching users:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // Exclude "password" field from each user
      const usersWithoutPassword = data.map((user) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });

      return res.json(usersWithoutPassword);
    });
  });
};

export const getFollowers = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "ascxvdfTuwerj4529asdf!/-adsf", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    const q = `SELECT users.*, CASE WHEN relationships.followedUserId IS NOT NULL THEN 1 ELSE 0 END AS following
               FROM users 
               JOIN relationships ON users.id = relationships.followedUserId 
               WHERE relationships.followerUserId = ?`; 
    
    db.query(q, [userInfo.id], (err, data) => {
      if (err) {
        console.error("Error fetching users:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // Exclude "password" field from each user
      const usersWithoutPassword = data.map((user) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });

      return res.json(usersWithoutPassword);
    });
  });
}

export const getFollowing = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "ascxvdfTuwerj4529asdf!/-adsf", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    const q = "SELECT users.* FROM users JOIN relationships ON users.id = relationships.followedUserId WHERE relationships.followerUserId = ?"; 
    
    db.query(q, [userInfo.id], (err, data) => {
      if (err) {
        console.error("Error fetching users:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // Exclude "password" field from each user
      const usersWithoutPassword = data.map((user) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });

      return res.json(usersWithoutPassword);
    });
  });
}

export const updateUser = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, "ascxvdfTuwerj4529asdf!/-adsf", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "UPDATE users SET `name`=?,`city`=?,`language`=?,`profilePic`=?,`coverPic`=?,`instagram`=?,`twitter`=?,`facebook`=?,`website`=?, `account_type`=?, `business_type`=?, `bio`=? WHERE id=? ";

    db.query(
      q,
      [
        req.body.name,
        req.body.city,
        req.body.language,
        req.body.profilePic,
        req.body.coverPic,
        req.body.instagram,
        req.body.twitter,
        req.body.facebook,
        req.body.website,
        req.body.account_type,
        req.body.business_type,
        req.body.bio,
        userInfo.id,
      ],
      (err, data) => {
        if (err) res.status(500).json(err);
        if (data.affectedRows > 0) return res.json("Updated!");
        return res.status(403).json("You can update only your profile!");
      }
    );
  });
};