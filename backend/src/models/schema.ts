import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { timestamps: true });

const TagSchema = new mongoose.Schema({
    title: { type: String, required: true }
}, { timestamps: true });

const ContentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    link: { type: String, required: true },
    tags: [{ type: mongoose.Types.ObjectId, ref: "Tag" }],
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

const ShareSchema = new mongoose.Schema({
    hash: { type: String },
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

export const UserSignupModel = mongoose.model("User", UserSchema);
export const TagModel = mongoose.model("Tag", TagSchema);
export const ContentModel = mongoose.model("Content", ContentSchema);
export const ShareModel = mongoose.model("Share", ShareSchema);
