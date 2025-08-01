import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { DB } from "./db/db";
import { userMiddleware } from "./middleware/userMiddleware";
import { ContentModel, ShareModel, UserSignupModel } from "./models/schema";
import userRoutes from "./routes/userRoutes";
import contentRoutes from "./routes/contentRoutes";
import { generateLink } from "./utils";

const app = express();
dotenv.config();
DB();

app.use(express.json());
app.use("/api/v1", userRoutes);
app.use("/api/v1", contentRoutes);

const jwt_key = process.env.JWT_PASS || "default_jwt_secret";
if (!jwt_key) {
    console.error("JWT secret key is not set in environment variables.");
    process.exit(1);
}
const PORT = process.env.PORT || 3000;

// 🔗 POST /share - create a shareable link
app.post("/api/v1/brain/share", userMiddleware, async (req: Request, res: Response) => {
    const { share } = req.body;

    if (!share) {
        res.status(400).json({ message: "Share data is required" });
        return 
    }

    try {
        const hash = generateLink(Date.now());
        await ShareModel.create({
            userId: req.userId,
            hash: hash
        });

        res.status(201).json({ message: "Share link created", link: `/api/v1/brain/${hash}` });
    } catch (error) {
        res.status(500).json({ message: "Error creating share link", error });
    }
});

// 🔗 GET /share/:sharelink - access shared content
app.get("/api/v1/brain/:sharelink", async (req: Request, res: Response) => {
    const hash = req.params.sharelink;

    try {
        const link = await ShareModel.findOne({ hash });
        if (!link) {
            res.status(404).json({ message: "Share link not found" });
            return
        }

        const content = await ContentModel.find({ userId: link.userId });
        const user = await UserSignupModel.findById(link.userId);

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return 
        }

        res.json({ username: user.username, content });
    } catch (error) {
        res.status(500).json({ message: "Error fetching shared content", error });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});
