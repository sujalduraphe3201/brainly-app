import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

const jwt_key = process.env.JWT_PASS || "default_jwt_secret";

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["authorization"];
        if (!authHeader || !authHeader.startsWith("Bearer")) {
        res.status(403).json({ message: "Incorrect token provided" });
        return
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        res.status(403).json({ message: "Token missing" });
        return
    }

    try {
        const decoded = jwt.verify(token, jwt_key) as { id: string };
        req.userId = decoded.id;
        next();
    } catch (error) {
        res.status(403).json({ message: "Invalid or expired token" });
        return
    }
};
