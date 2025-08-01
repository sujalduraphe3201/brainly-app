import { Request, Response, Router } from "express";
import { ContentModel, UserSignupModel } from "../models/schema";
import { userMiddleware } from "../middleware/userMiddleware";


const router = Router();

const jwt_key = process.env.JWT_PASS || "default_jwt_secret";
if (!jwt_key) {
    console.error("JWT secret key is not set in environment variables.");
    process.exit(1);
}
// Add Content

router.post("/content", userMiddleware, async (req: Request, res: Response) => {
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
router.get("/content", userMiddleware, async (req: Request, res: Response) => {
    try {
        const content = await ContentModel.find({ userId: req.userId }).populate("userId");
        res.status(200).json({ content });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to fetch content" });
    }
});

// Delete Content
router.delete("/content", userMiddleware, async (req: Request, res: Response) => {
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

export default router;