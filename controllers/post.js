import {db} from "../connect.js"
import moment from "moment"
import jwt from "jsonwebtoken";
import schedule from "node-schedule";

export const getTopPosts = (req, res) => {
    const q = `
      SELECT p.*, u.id AS userId, username, profilePic, COUNT(l.userId) AS likeCount
      FROM posts AS p
      JOIN users AS u ON (u.id = p.userId)
      LEFT JOIN likes AS l ON (p.id = l.postId)
      WHERE p.createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY p.id
      HAVING likeCount > 0
      ORDER BY p.createdAt DESC
      LIMIT 5
    `;

    db.query(q, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
};

export const getLatestNews = (req, res) => {
    const q = `
      SELECT p.*, u.id AS userId, name, profilePic
      FROM posts AS p
      JOIN users AS u ON (u.id = p.userId)
      WHERE p.createdAt >= DATE_SUB(NOW(), INTERVAL 1 HOUR)
      AND (p.category = "news" OR p.category = "local" OR p.category = "latam" OR p.category = "usa" OR p.category = "global")
      ORDER BY p.createdAt DESC
    `;

    db.query(q, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
};

// export const getPosts = async (req, res) => {
//   const userId = req.query.userId;
//   const token = req.cookies.accessToken;
//   const limit = 25;

//   if (!token) return res.status(401).json("Not logged in!");

//   jwt.verify(token, "ascxvdfTuwerj4529asdf!/-adsf", (err, userInfo) => {
//     if (err) return res.status(403).json("Token is not valid!");
//     const q =
//       userId !== "undefined"
//         ? `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.userId = ? ORDER BY p.createdAt DESC`
//         : `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId)
//     LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId= ? OR p.userId =? OR p.ad = true
//     ORDER BY p.createdAt DESC LIMIT ${limit}`;
    
//     const values =
//       userId !== "undefined" ? [userId] : [userInfo.id, userInfo.id];

//     db.query(q, values, (err, data) => {
//       if (err) return res.status(500).json(err);
//       return res.status(200).json(data);
//     });
//   });
// }

export const getPosts = async (req, res) => {
  const userId = req.query.userId;
  const token = req.cookies.accessToken; // Get token from cookies

  const limit = 25;

  // Initialize query and values for database query
  let q;
  let values;

  // Check if token is present
  if (token) {
    // If token is present, verify it to get user info
    jwt.verify(token, "ascxvdfTuwerj4529asdf!/-adsf", (err, userInfo) => {
      if (err) {
        // If token verification fails, proceed without user info
        console.error("Error verifying token:", err);
      } else {
        // If token verification is successful, construct query and values to filter posts based on followed users
        // q =
        //   userId !== "undefined"
        //     ? `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.userId = ? ORDER BY p.createdAt DESC`
        //     : `SELECT p.*, u.id AS userId, name, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId)
        //     LEFT JOIN relationships AS r ON (p.userId = r.followedUserId) WHERE r.followerUserId= ? OR p.userId =? OR p.ad = true    
        //     ORDER BY p.createdAt DESC LIMIT ${limit}`;
              
        // values =
        //   userId !== "undefined" ? [userId] : [userInfo.id, userInfo.id];

        if (userId !== "undefined") { 
            q = `SELECT p.*, u.id AS userId, username, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.userId = ? ORDER BY p.createdAt DESC LIMIT ${limit}`;
            values = [userId];
        } else {
            // Make sure limit is a number and it's safe to use. You might want to enforce a default/max limit.
            q = `SELECT p.*, u.id AS userId, username, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) ORDER BY p.createdAt DESC LIMIT ${limit}`;
            values = [];
        }
      }
    });
  } else {
    // If token is not present, construct query and values to fetch all posts
    q = `SELECT p.*, u.id AS userId, username, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId)
      ORDER BY p.createdAt DESC LIMIT ${limit}`;
    values = [];
  }

  // Execute database query
  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const getShorts = (req, res) => {
  const q =
  `SELECT v.*, u.id AS userId, username, profilePic FROM shorts AS v JOIN users AS u ON (u.id = v.userId)
  ORDER BY v.createdAt DESC LIMIT 30`;

 db.query(q, (err, data) => {
   if (err) return res.status(500).json(err);
   return res.status(200).json(data);
 });
}

export const getEvents = (req, res) => {
    const q =
     `SELECT e.*, u.id AS userId, username, profilePic FROM events AS e JOIN users AS u ON (u.id = e.userId)
     WHERE e.date >= DATE(NOW()) 
     ORDER BY e.date DESC`;

    db.query(q, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
};

export const getJobs = (req, res) => {

    const q =
     `SELECT j.*, u.id AS userId, username, profilePic FROM jobs AS j JOIN users AS u ON (u.id = j.userId)
     ORDER BY j.createdAt DESC`;

    db.query(q, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
};

export const findPost = (req, res) => {
    const q = `SELECT p.*, u.id AS userId, username, profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.id = ?`;
    db.query(q, [req.query.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
}

export const addPost = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");
    jwt.verify(token, "ascxvdfTuwerj4529asdf!/-adsf", (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");
      const q =
        "INSERT INTO posts(`desc`, `img0`, `img1`, `img2`, `img3`, `img4`, `img5`, `img6`, `img7`, `img8`, `img9`, `createdAt`, `userId`, `category`, `flag`, `article`, `url`) VALUES (?)";
      const values = [
        req.body.desc,
        req.body.img0,
        req.body.img1,
        req.body.img2,
        req.body.img3,
        req.body.img4,
        req.body.img5,
        req.body.img6,
        req.body.img7,
        req.body.img8,
        req.body.img9,
        moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        userInfo.id,
        req.body.category,
        req.body.hasFlag,
        req.body.article,
        req.body.url
      ];
      db.query(q, [values], (err) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Post has been created.");
      });
    });
};

export const addShort = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");
  jwt.verify(token, "ascxvdfTuwerj4529asdf!/-adsf", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    const q =
      "INSERT INTO shorts(`desc`, `videoURL`, `createdAt`, `userId`) VALUES (?)";
    const values = [
      req.body.desc,
      req.body.imgUrl,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
    ];
    db.query(q, [values], (err) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Short has been created.");
    });
  });
}

// const replaceImage = (postId) => {
//   const q = `UPDATE posts SET img0 = ?, img1 = ?, img2 = ?, img3 = ?, img4 = ?, img5 = ?, img6 = ?, img7 = ?, img8 = ?, img9 = ? WHERE id = ?`;
//   const values = ["not-found", null, null, null, null, null, null, null, null, null, postId];
//   db.query(q, values, (err, data) => {
//     if (err) console.error("Error replacing image", err);
//     return;
//   });
// }

export const addEvent = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "ascxvdfTuwerj4529asdf!/-adsf", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    const dateTimeStr = `${req.body.date} ${req.body.time}`;
    const q =
      "INSERT INTO events(`name`, `location`, `date`, `description`, `file`, `url`, `userId`) VALUES (?)";
    const values = [
      req.body.name,
      req.body.location,
      moment(dateTimeStr).format("YYYY-MM-DD HH:mm:ss"),
      req.body.description,
      req.body.img,
      req.body.url,
      userInfo.id
    ];
    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Event has been created.");
    });
  });
};

export const deleteEvent = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "ascxvdfTuwerj4529asdf!/-adsf", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "DELETE FROM events WHERE `id`=?";

    db.query(q, [req.params.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if(data.affectedRows>0) return res.status(200).json("Post has been deleted.");
      return res.status(403).json("You can delete only your post")
    });
  });
};

export const addJob = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "ascxvdfTuwerj4529asdf!/-adsf", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    const dateTimeStr = `${req.body.date} ${req.body.time}`;
    const q =
      "INSERT INTO jobs(`name`, `category`, `pay`, `schedule`, `location`, `description`, `contact`, `userId`, `img`, `createdAt`) VALUES (?)";
    const values = [
      req.body.name,
      req.body.category,
      req.body.pay,
      req.body.schedule,
      // req.body.startDate,
      // req.body.employer,
      req.body.location,
      req.body.description,
      req.body.contact,
      userInfo.id,
      req.body.img,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Job has been created.");
    });
  });
};

export const deleteJob = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "ascxvdfTuwerj4529asdf!/-adsf", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "DELETE FROM jobs WHERE `id`=?";

    db.query(q, [req.params.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if(data.affectedRows>0) return res.status(200).json("Post has been deleted.");
      return res.status(403).json("You can delete only your post")
    });
  });
};

export const deletePost = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "ascxvdfTuwerj4529asdf!/-adsf", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    const q =
      "DELETE FROM posts WHERE `id`=?";
    db.query(q, [req.params.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if(data.affectedRows>0) return res.status(200).json("Post has been deleted.");
      return res.status(403).json("You can delete only your post")
    });
  });
};

export const deleteShort = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "ascxvdfTuwerj4529asdf!/-adsf", async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    const q =
      "DELETE FROM shorts WHERE `id`=?";
    db.query(q, [req.params.id], (err, data) => {
      if (err) return res.status(500).json(err);
      if(data.affectedRows>0) return res.status(200).json("Short has been deleted.");
      return res.status(403).json("You can delete only your post")
    });
  });
};
