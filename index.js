import express from "express";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import authRoutes from "./routes/auth.js";
import likeRoutes from "./routes/likes.js";
import relationshipRoutes from "./routes/relationships.js";
import ratingRoutes from "./routes/ratings.js";
import notifRoutes from "./routes/notifications.js";
import messageRoutes from "./routes/messages.js";
import storyRoutes from "./routes/stories.js";
import embedRoutes from "./routes/embeds.js";
import adRoutes from "./routes/ads.js";
import cors from "cors";
import multer from "multer";
import cookieParser from "cookie-parser";
import { PutObjectCommand, DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3"
import dotenv from 'dotenv';
import crypto from 'crypto';
import cron from 'node-cron';
import { db } from "./connect.js";
import path from "path";
import fs from "fs";
// import { convertToJpg, isImage } from "./img_process.js";
// import sharp from "sharp";
// import imagemin from "imagemin";
// import mozjpeg from "imagemin-mozjpeg";

const app = express();

//middlewares
app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Credentials", true);
    next();
});
app.use(express.json())

// Enable CORS for the specified origin
app.use(cors({
    // origin: "http://localhost:3000",
    origin: "https://www.postsstation.com",
    methods: ["GET", "POST", "DELETE", "FETCH", "PUT"],
    credentials: true
}));
app.use(cookieParser());

// OPTION 2: MULTER MEMORY STORAGE + S3 BUCKET: WORKS
dotenv.config();
const randomImageName = (filename, bytes = 32) => {
    // Generate a random name
    const randomName = crypto.randomBytes(bytes).toString('hex');
  
    // Get the original file extension
    const originalExtension = filename.toLowerCase().match(/\.(jpg|jpeg|png|gif||webp|mp4|mp3|mov|heic|m4a)$/);
  
    // If the original extension exists, append it to the random name; otherwise, use a default extension
    const finalName = originalExtension ? `${randomName}${originalExtension[0]}` : `${randomName}.bin`;
  
    return finalName;
};

const s3 = new S3Client({
    // accessKeyId: process.env.ACCESS_KEY,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
    region: process.env.BUCKET_REGION
});
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const bucketName = 'lavozbucket';

// DB  CLEANUP FEATURE: DELETE POSTS > 4WKS OLD
cron.schedule('0 0 0 * * *', () => {
    const today = new Date();
    const deleteDate = new Date(today.setDate(today.getDate() - 28));
    const formattedDate = deleteDate.toISOString().split('T')[0];

    const q = "DELETE FROM posts WHERE DATE(`createdAt`) < ?";
    db.query(q, formattedDate, (err, data) => {
        if (err) console.log("Error running scheduled post cleanup.");
        else console.log("Scheduled post cleanup successful.");
    });
});

// DB  CLEANUP FEATURE: DELETE SHORTS > 4WKS OLD
cron.schedule('0 0 0 * * *', () => {
    const today = new Date();
    const deleteDate = new Date(today.setDate(today.getDate() - 28));
    const formattedDate = deleteDate.toISOString().split('T')[0];

    const q = "DELETE FROM shorts WHERE DATE(`createdAt`) < ?";
    db.query(q, formattedDate, (err, data) => {
        if (err) console.log("Error running scheduled post cleanup.");
        else console.log("Scheduled post cleanup successful.");
    });
});

// DB CLEANUP FEATURE: DELETE OLD/SEEN NOTIFICATIONS
cron.schedule('0 0 0 * * *', () => {
    const today = new Date();
    const deleteDate = new Date(today.setDate(today.getDate() - 28));
    const formattedDate = deleteDate.toISOString().split('T')[0];

    const q = "DELETE FROM notifications WHERE DATE(`createdAt`) < ? OR `new` = false";
    db.query(q, formattedDate, (err, data) => {
        if (err) console.log("Error running scheduled notification cleanup.");
        else console.log("Scheduled notification cleanup successful.");
    });
});

// FOR POSTS (DELETE EVERY 4 WEEKS)
app.post("/api/uploadPost", upload.single("file"), async (req, res) => {
    try {
        const file = req.file;
        const imageName = randomImageName(req.file.originalname);

        let fileBuffer = file.buffer;

        // FOR IMAGE COMPRESSION
        // if (isImage(imageName)) {
        //     const miniBuffer = await imagemin.buffer(file.buffer, {
        //         plugins: [convertToJpg, mozjpeg({ quality: 85 })]
        //     });
        //     fileBuffer = await sharp(miniBuffer)
        //         .resize({ height: 600, width: 600, fit: "inside" })
        //         .toBuffer()
        // }

        const params = {
            Bucket: bucketName,
            Key: imageName,
            Body: fileBuffer,
            ContentType: req.file.mimetype,
            Tagging: "post=true"
        };

        const command = new PutObjectCommand(params);

        await s3.send(command);

        const imageUrl = `https://${bucketName}.s3.amazonaws.com/${imageName}`;

        res.status(200).json(imageUrl);
    } catch (error) {
        console.error("Error uploading post to S3:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// FOR STORIES (delete every 48hr)
app.post("/api/uploadStory", upload.single("file"), async (req, res) => {
    try {
        const file = req.file;
        const imageName = randomImageName(req.file.originalname);

        let fileBuffer = file.buffer;

        const params = {
            Bucket: bucketName,
            Key: imageName,
            Body: fileBuffer,
            ContentType: req.file.mimetype,
            Tagging: "story=true"
        };

        const command = new PutObjectCommand(params);

        await s3.send(command);

        const imageUrl = `https://${bucketName}.s3.amazonaws.com/${imageName}`;

        res.status(200).json(imageUrl);
    } catch (error) {
        console.error("Error uploading story to S3:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// FOR NON-POSTS
app.post("/api/upload", upload.single("file"), async (req, res) => {
    try {
        const file = req.file;
        const imageName = randomImageName(req.file.originalname);

        let fileBuffer = file.buffer;

        // // FOR IMAGE COMPRESSION
        // if (isImage(imageName)) {
        //     const miniBuffer = await imagemin.buffer(file.buffer, {
        //         plugins: [convertToJpg, mozjpeg({ quality: 85 })]
        //     });
        //     fileBuffer = await sharp(miniBuffer)
        //         .resize({ height: 600, width: 600, fit: "inside" })
        //         .toBuffer()
        // }

        const params = {
            Bucket: bucketName,
            Key: imageName,
            Body: fileBuffer,
            ContentType: req.file.mimetype,
            Tagging: 'post=false'
        };

        const command = new PutObjectCommand(params);

        try {
            await s3.send(command);
        }
        catch {
            console.log("error with s3");
        }

        const imageUrl = `https://${bucketName}.s3.amazonaws.com/${imageName}`;

        res.status(200).json(imageUrl);
    } catch (error) {
        console.error("Error uploading non-post to S3:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.delete("/api/delete/:img", async (req, res) => {
    const imgURL = req.params.img;
    const objectKey = new URL(imgURL).pathname.substring(1);
    try {
        if (objectKey != null && objectKey != "") {
            const params = {
              Bucket: 'lavozbucket',
              Key: objectKey
            };
            const command = new DeleteObjectCommand(params);
            await s3.send(command);
            res.status(200);
        }
    } catch {
        console.error("error deleting from s3:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/comments", commentRoutes)
app.use("/api/likes", likeRoutes)
app.use("/api/relationships", relationshipRoutes)
app.use("/api/ratings", ratingRoutes)
app.use("/api/notifications", notifRoutes)
app.use("/api/messages", messageRoutes)
app.use("/api/stories", storyRoutes)
app.use("/api/embeds", embedRoutes)
app.use("/api/ads", adRoutes)

const PORT = process.env.PORT || 8800;
app.listen(PORT, ()=>{
    console.log("api working!")
})

//  app.listen(8800, ()=>{
//      console.log("API working!")
//  })