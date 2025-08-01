import express, { Request, Response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { DB } from "./db/db";
import { userMiddleware } from "./middleware/userMiddleware";
import { ContentModel, ShareModel, UserSignupModel } from "./models/Schema";

dotenv.config();
const app = express();
app.use(express.json());

DB();
const jwt_key = process.env.JWT_PASS || "default_jwt_secret";
if (!jwt_key) {
    console.error("JWT secret key is not set in environment variables.");
    process.exit(1);
}
const PORT = process.env.PORT || 3000;

// Signup Route
app.post("/api/v1/signup", async (req: Request, res: Response) => {
    const { username, email, password } = req.body;

    if (!email || !password || !username) {
        res.status(400).json({ message: "Email and password are required" });
        return
    }

    try {
        const existing = await UserSignupModel.findOne({ email });
        if (existing) {
            res.status(409).json({ message: "User already exists" });
            return
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await UserSignupModel.create({ email, password: hashedPassword, username });

        const token = jwt.sign({ id: user._id }, jwt_key, { expiresIn: "4d" });

        res.status(200).json({ message: "Signup successful", token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Signup failed" });
    }
});

// Signin Route
app.post("/api/v1/signin", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: "Email and password are required" });
        return
    }

    try {
        const user = await UserSignupModel.findOne({ email });
        if (!user) {
            res.status(401).json({ message: "Invalid email or password" });
            return
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: "Invalid email or password" });
            return
        }

        const token = jwt.sign({ id: user._id }, jwt_key, { expiresIn: "4d" });

        res.status(200).json({ message: "Signin successful", token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Signin failed" });
    }
});



// Add Content
app.post("/api/v1/content", userMiddleware, async (req: Request, res: Response) => {
    const { title, link } = req.body;

    if (!title || !link) {
        res.status(400).json({ message: "Title and link are required" });
        return
    }

    try {
        await ContentModel.create({
            title,
            tag: [],
            link,
            userId: req.userId
        });

        res.status(201).json({ message: "Content added" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to add content" });
    }
});

// Get User Content
app.get("/api/v1/content", userMiddleware, async (req: Request, res: Response) => {
    try {
        const content = await ContentModel.find({ userId: req.userId }).populate("userId");
        res.status(200).json({ content });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch content" });
    }
});

// Delete Content
app.delete("/api/v1/content", userMiddleware, async (req: Request, res: Response) => {
    const { contentId } = req.body;

    if (!contentId) {
        res.status(400).json({ message: "Content ID is required" });
        return
    }

    try {
        await ContentModel.deleteOne({
            _id: contentId,
            userId: req.userId
        });

        res.status(200).json({ message: "Content deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to delete content" });
    }
});

// Share Route
app.post("/api/v1/share", userMiddleware, async (req: Request, res: Response) => {
    const { share } = req.body;

    if (!share) {
        res.status(400).json({ message: "Share data is required" });
        return
    }

    try {
        await ShareModel.create({
            userId: req.userId,
            share
        });
        res.status(201).json({ message: "Content shared" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to share content" });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
