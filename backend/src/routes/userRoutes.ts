import { Request, Response, Router } from "express";
import { UserSignupModel } from "../models/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
const jwt_key = process.env.JWT_PASS || "default_jwt_secret";
if (!jwt_key) {
    console.error("JWT secret key is not set in environment variables.");
    process.exit(1);
}
// Signup Route
const router = Router();
router.post("/signup", async (req: Request, res: Response) => {
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
router.post("/signin", async (req: Request, res: Response) => {
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
export default router;