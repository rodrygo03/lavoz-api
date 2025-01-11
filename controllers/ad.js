import {db} from "../connect.js"
import moment from "moment"
import jwt from "jsonwebtoken";
import { addPost } from "./post.js";

export const getPendingAds = async (req, res) => {
    const token = req.cookies.accessToken;
  
    if (!token) return res.status(401).json("Not logged in!");
  
    jwt.verify(token, "ascxvdfTuwerj4529asdf!/-adsf", (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");
  
      const q =
        "SELECT a.*, u.id AS userId, username, profilePic FROM ads AS a JOIN users AS u ON (u.id = a.userId) WHERE a.approved = false ORDER BY a.createdAt DESC"
  
      db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
      });
    });
};

export const getApprovedAds = async (req, res) => {
    const token = req.cookies.accessToken;
  
    if (!token) return res.status(401).json("Not logged in!");
  
    jwt.verify(token, "ascxvdfTuwerj4529asdf!/-adsf", (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");
  
      const q =
        "SELECT a.*, u.id AS userId, username, profilePic FROM ads AS a JOIN users AS u ON (u.id = a.userId) WHERE a.approved = true ORDER BY a.createdAt DESC"
  
      db.query(q, (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(data);
      });
    });
};

export const postAd = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");

    jwt.verify(token, "ascxvdfTuwerj4529asdf!/-adsf", (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");
      const sanitizedDesc = req.body.desc.replace(/\n/g, '\n');
      const q =
        "INSERT INTO ads(`desc`, `img0`, `img1`, `img2`, `img3`, `img4`, `img5`, `img6`, `img7`, `img8`, `img9`, `createdAt`, `userId`, `category`, `approved`) VALUES (?)";
      const values = [
        sanitizedDesc,
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
        false
      ];
      
      db.query(q, [values], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Ad has been created.");
      });
    });
};

export const approveAd = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in!");
  
    jwt.verify(token, "ascxvdfTuwerj4529asdf!/-adsf", (err, userInfo) => {
      if (err) return res.status(403).json("Token is not valid!");
      const q =
        "UPDATE ads SET approved = ? WHERE id = ?";
      const values = [
        req.body.approved,
        req.body.id
      ];
      
      db.query(q, values, (err, data) => {
        if (err) {
            console.log("Error updating ad:", err);
            return res.status(500).json("Error updating ad.");
        } 
        else {
          console.log("Ad updated successfully!");
          if (req.body.approved === false) {
              // If ad is not approved, delete the ad
              console.log('h')
              deleteAd(req.body.id);
              return;
          } else {
            convertToPost(req.body.desc, req.body.img0, req.body.img1, req.body.img2, req.body.img3, req.body.img4, req.body.img5, req.body.img6, req.body.img7, req.body.img8, req.body.img9, userInfo.id, req.body.category);
            return res.status(200).json("Ad approved successfully.");
          }
        }
      });
    });
};

const convertToPost = (desc, img0, img1, img2, img3, img4, img5, img6, img7, img8, img9, userId, category) => {
    const q =
      "INSERT INTO posts(`desc`, `img0`, `img1`, `img2`, `img3`, `img4`, `img5`, `img6`, `img7`, `img8`, `img9`, `createdAt`, `userId`, `category`, `ad`) VALUES (?)";
    const values = [
      desc,
      img0,
      img1,
      img2,
      img3,
      img4,
      img5,
      img6,
      img7,
      img8,
      img9,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userId,
      category,
      true
    ];
    
    db.query(q, [values], (err, data) => {
      if (err) console.error("Error creating post from ad.", err);
      return;
    });
};

const deleteAd = (id) => {
    const q =
      "DELETE FROM ads WHERE id=?";
    db.query(q, id, (err, data) => {
      if (err) console.log("Error deleting add.", err);
      if(data.affectedRows>0) return;
    });
};